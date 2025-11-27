# chat_app/views.py

import json
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpRequest
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Chat, ChatSession
# Importamos la función del servicio de IA (Gemini)
from .ai_service import consultar_gemini
# RAG Service externo se importa dinámicamente en crear_chat() cuando se necesita


@csrf_exempt
@require_http_methods(["GET"])
def test_chat(request: HttpRequest):
    """Vista de test para verificar que las rutas funcionan"""
    return JsonResponse({
        "status": "ok",
        "message": "Chat API funcionando correctamente",
        "timestamp": "2025-10-30"
    })


@login_required
@require_http_methods(["GET"])
def mis_sesiones(request: HttpRequest):
    """Listar todas las sesiones de chat del usuario"""
    sesiones = ChatSession.objects.filter(user=request.user)
    data = [
        {
            "id": s.id,
            "titulo": s.titulo,
            "creado_en": s.creado_en.isoformat(),
            "actualizado_en": s.actualizado_en.isoformat(),
            "mensajes_count": s.mensajes.count(),
        }
        for s in sesiones
    ]
    return JsonResponse({"results": data}, status=200)


@csrf_exempt
@login_required
@require_http_methods(["POST"])
def crear_sesion(request: HttpRequest):
    """Crear una nueva sesión de chat"""
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except Exception:
        payload = {}
    
    titulo = payload.get("titulo", "Nueva conversación")
    sesion = ChatSession.objects.create(user=request.user, titulo=titulo)
    
    return JsonResponse({
        "id": sesion.id,
        "titulo": sesion.titulo,
        "creado_en": sesion.creado_en.isoformat(),
        "mensajes": [],
    }, status=201)


@login_required
@require_http_methods(["GET"])
def obtener_sesion(request: HttpRequest, sesion_id: int):
    """Obtener una sesión con todos sus mensajes"""
    sesion = get_object_or_404(ChatSession, id=sesion_id, user=request.user)
    mensajes = [
        {
            "id": m.id,
            "mensaje_usuario": m.mensaje_usuario,
            "respuesta_ia": m.respuesta_ia,
            "fecha": m.fecha.isoformat(),
        }
        for m in sesion.mensajes.all()
    ]
    
    return JsonResponse({
        "id": sesion.id,
        "titulo": sesion.titulo,
        "creado_en": sesion.creado_en.isoformat(),
        "actualizado_en": sesion.actualizado_en.isoformat(),
        "mensajes": mensajes,
    }, status=200)


@login_required
@require_http_methods(["GET"])
def mis_chats(request: HttpRequest):
    """LEGACY: Listar últimos chats (mantener compatibilidad)"""
    qs = Chat.objects.filter(user=request.user).order_by("-fecha")[:100]
    data = [
        {
            "id": c.id,
            "mensaje_usuario": c.mensaje_usuario,
            "respuesta_ia": c.respuesta_ia,
            "fecha": c.fecha.isoformat(),
        }
        for c in qs
    ]
    return JsonResponse({"results": data}, status=200)


@csrf_exempt
@login_required
@require_http_methods(["POST"])
def crear_chat(request: HttpRequest):
    """Crear un mensaje en una sesión (con RAG si es necesario)"""
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except Exception:
        payload = {}

    mensaje = (payload.get("mensaje_usuario") or "").strip()
    sesion_id = payload.get("sesion_id")
    usar_rag = payload.get("usar_rag", True)  # Por defecto usa RAG
    
    print(f"[CHAT] DEBUG: usar_rag={usar_rag}, mensaje='{mensaje[:50]}...'")
    
    if not mensaje:
        return JsonResponse({"error": "mensaje_usuario requerido"}, status=400)

    # Obtener o crear sesión
    if sesion_id:
        try:
            sesion = ChatSession.objects.get(id=sesion_id, user=request.user)
        except ChatSession.DoesNotExist:
            return JsonResponse({"error": "Sesión no encontrada"}, status=404)
    else:
        # Crear nueva sesión automáticamente
        primer_mensaje_titulo = mensaje[:50] + ("..." if len(mensaje) > 50 else "")
        sesion = ChatSession.objects.create(
            user=request.user,
            titulo=primer_mensaje_titulo
        )
    
    # ========================================
    # RAG: Buscar contexto en PDFs usando RAG Service externo (función centralizada)
    # ========================================
    contexto_rag = ""
    fuentes_rag = []
    if usar_rag:
        print(f"[CHAT] DEBUG: Llamando a RAG Service...")
        try:
            from rag_proxy.views import buscar_contexto_rag
            
            # Llamar a función centralizada que consume RAG Service (top_k=10 para mejor cobertura y precisión)
            contexto_raw, fuentes_rag = buscar_contexto_rag(mensaje, top_k=10)
            
            print(f"[CHAT] DEBUG: RAG retornó {len(fuentes_rag)} fuentes")
            if contexto_raw:
                contexto_rag = "\n\n**Contexto de documentos educativos:**\n" + contexto_raw
                print(f"[CHAT] DEBUG: Contexto RAG generado ({len(contexto_raw)} chars)")
            else:
                print(f"[CHAT] DEBUG: No se encontró contexto relevante")
        except Exception as e:
            print(f"[RAG] Error al llamar RAG Service: {e}")
            import traceback
            traceback.print_exc()
            # Continuar sin RAG si falla
    else:
        print(f"[CHAT] DEBUG: RAG desactivado (usar_rag=False)")
    
    # ========================================
    # Obtener historial de la conversación (últimos 5 turnos = 10 mensajes)
    # ========================================
    mensajes_previos = Chat.objects.filter(session=sesion).order_by('-fecha')[:10]
    mensajes_previos = list(reversed(mensajes_previos))  # Orden cronológico
    
    historial_conversacion = ""
    
    if mensajes_previos:
        print(f"[CHAT] DEBUG: Historial encontrado: {len(mensajes_previos)} mensajes")
        historial_conversacion = "\n\n**CONVERSACIÓN PREVIA:**\n"
        for msg in mensajes_previos:
            historial_conversacion += f"Usuario: {msg.mensaje_usuario}\n"
            historial_conversacion += f"Asistente: {msg.respuesta_ia}\n\n"
        historial_conversacion += "---\n"
    
    # ========================================
    # Construir prompt con RAG + historial + mensaje actual
    # ========================================
    if contexto_rag and historial_conversacion:
        # Caso ideal: RAG + historial
        prompt_completo = f"""Eres un asistente pedagógico experto de la Universidad San Sebastián, especializado en planificación educativa y alfabetización digital.

**DOCUMENTOS DISPONIBLES (ÚNICOS EXISTENTES):**
- Capítulo 2: Alfabetización Digital en Inteligencia Artificial Generativa
- Capítulo 3: Alfabetización Digital en Inteligencia Artificial Generativa (IAGen)
- Capítulo 4: Pensamiento Crítico y Alfabetización Digital
- Capítulo 5: Evaluación en Alfabetización Digital
- Capítulo 6: Competencias Digitales Docentes
- Etapa_ciclo_alfabetizacion_digital.pdf: Guía de las 6 etapas del ciclo de alfabetización digital

**IMPORTANTE:** Solo existen los capítulos 2, 3, 4, 5 y 6. NO existen capítulo 1, 7, 8 ni otros. Si te preguntan por capítulos inexistentes, DEBES indicar que no existen.

{contexto_rag}
{historial_conversacion}
**PREGUNTA ACTUAL:** {mensaje}

REGLAS CRÍTICAS DE COMUNICACIÓN:
1. BREVEDAD: Responde de forma concisa. NO agregues sugerencias adicionales, ejemplos de actividades o estructuras de clase completas a menos que se soliciten EXPLÍCITAMENTE.
2. RESPETO TERMINOLÓGICO: Usa EXACTAMENTE los mismos términos que el usuario. Si dice "prompts", usa "prompts". Si dice "avisos", usa "avisos". NUNCA cambies la terminología del usuario.
3. NO REFORMULAR: Si el usuario presenta un objetivo o texto ya formulado, NO lo reescribas. Si ves oportunidad de mejora, pregunta: "¿Quieres que te sugiera agregar [aspecto específico]?" y espera confirmación.
4. RESPONDER SOLO LO SOLICITADO: Si pregunta "¿Este objetivo es apropiado?", responde Sí/No + 1 razón principal. NO agregues versiones mejoradas ni propuestas de actividades a menos que se pidan.
5. FORMATO NATURAL: NO uses frases pedagógicas forzadas como "Al finalizar la actividad, los estudiantes serán capaces de..." a menos que el usuario ya las use. Respeta su estilo de formulación.
6. PREGUNTAS DE SEGUIMIENTO: Solo ofrece ayuda adicional cuando el usuario muestre incertidumbre explícita (ej: "no estoy seguro", "¿qué opinas?") o cuando la pregunta sea abierta y claramente requiera orientación. NO termines cada respuesta con "¿Te gustaría que...?" automáticamente.
7. CONTEXTO PEDAGÓGICO CONTUNDENTE: Cuando evalúes objetivos de aprendizaje, explica POR QUÉ es apropiado o no basándote en principios pedagógicos sólidos (enfoque en el estudiante vs docente, taxonomía de Bloom, criterios observables y medibles, alineación constructivista).

INSTRUCCIONES DE CONTENIDO:
8. Analiza y aliméntate del contexto proporcionado de los PDFs
9. Proporciona respuestas profundas, bien razonadas y pedagógicamente sólidas
10. **SOLO cita fuentes (Capítulo X, página Y) si el usuario EXPLÍCITAMENTE pide citas, referencias, o pregunta "según qué documento" o "dónde dice eso"**
11. Si el usuario pregunta algo general o pide ayuda con planificación, responde directamente SIN citar fuentes
12. Si el usuario pregunta por capítulos inexistentes (ej: Capítulo 1, 7, 8), responde: "Lo siento, solo tengo acceso a los Capítulos 2, 3, 4, 5 y 6, además del documento de Etapas del Ciclo de Alfabetización Digital. ¿Te puedo ayudar con alguno de estos?"
13. Si el contexto no responde completamente la pregunta, usa tu conocimiento pedagógico pero indícalo claramente
14. Mantén un tono profesional pero cercano y motivador
"""
    elif contexto_rag:
        # Solo RAG, sin historial
        prompt_completo = f"""Eres un asistente pedagógico experto de la Universidad San Sebastián, especializado en planificación educativa y alfabetización digital.

**DOCUMENTOS DISPONIBLES (ÚNICOS EXISTENTES):**
- Capítulo 2: Alfabetización Digital en Inteligencia Artificial Generativa
- Capítulo 3: Alfabetización Digital en Inteligencia Artificial Generativa (IAGen)
- Capítulo 4: Pensamiento Crítico y Alfabetización Digital
- Capítulo 5: Evaluación en Alfabetización Digital
- Capítulo 6: Competencias Digitales Docentes
- Etapa_ciclo_alfabetizacion_digital.pdf: Guía de las 6 etapas del ciclo de alfabetización digital

**IMPORTANTE:** Solo existen los capítulos 2, 3, 4, 5 y 6. NO existen capítulo 1, 7, 8 ni otros. Si te preguntan por capítulos inexistentes, DEBES indicar que no existen.

{contexto_rag}

**PREGUNTA:** {mensaje}

REGLAS CRÍTICAS DE COMUNICACIÓN:
1. BREVEDAD: Responde de forma concisa. NO agregues sugerencias adicionales a menos que se soliciten explícitamente.
2. RESPETO TERMINOLÓGICO: Usa EXACTAMENTE los mismos términos que el usuario (ej: si dice "prompts", NO cambies a "avisos"). Mantén su terminología.
3. NO REFORMULAR: NO reescribas objetivos o textos del usuario. Si detectas mejora posible, pregunta: "¿Quieres que te sugiera una versión mejorada?"
4. RESPONDER SOLO LO SOLICITADO: Si pregunta A, responde A. No agregues B, C, D sin que se pidan.
5. FORMATO NATURAL: Respeta el estilo de formulación del usuario. No impongas formatos pedagógicos forzados.
6. PREGUNTAS DE SEGUIMIENTO: Solo ofrece ayuda adicional cuando el usuario muestre incertidumbre explícita o cuando la pregunta requiera orientación clara. NO termines automáticamente con "¿Te gustaría que...?".
7. CONTEXTO PEDAGÓGICO CONTUNDENTE: Cuando evalúes objetivos de aprendizaje, explica POR QUÉ es apropiado o no basándote en principios pedagógicos sólidos.

INSTRUCCIONES DE CONTENIDO:
8. Analiza y aliméntate del contexto proporcionado de los PDFs
9. Proporciona respuestas profundas y bien fundamentadas pedagógicamente
10. **SOLO cita fuentes (Capítulo X, página Y) si el usuario EXPLÍCITAMENTE pide citas o referencias**
11. Si el usuario pregunta algo general, responde directamente SIN citar fuentes
12. Si el usuario pregunta por capítulos inexistentes, responde: "Lo siento, solo tengo acceso a los Capítulos 2, 3, 4, 5 y 6, además del documento de Etapas del Ciclo de Alfabetización Digital. ¿Te puedo ayudar con alguno de estos?"
13. Para planificaciones apóyate en Etapa_ciclo_alfabetizacion_digital.pdf y los capítulos disponibles
14. Mantén un tono profesional pero cercano y motivador
"""
    elif historial_conversacion:
        # Solo historial, sin RAG
        prompt_completo = f"""Eres un asistente pedagógico experto de la Universidad San Sebastián.

REGLAS DE COMUNICACIÓN:
- Brevedad: Responde conciso, no agregues sugerencias no solicitadas
- Respeto terminológico: Usa EXACTAMENTE los términos del usuario (ej: "prompts" = "prompts")
- No reformular: NO reescribas textos del usuario sin permiso
- Responder solo lo solicitado
- Preguntas de seguimiento: Solo ofrece ayuda adicional cuando el usuario muestre incertidumbre explícita o cuando la pregunta requiera orientación clara. NO termines automáticamente con "¿Quieres que...?"
- Contexto pedagógico contundente: Al evaluar objetivos de aprendizaje, explica POR QUÉ basándote en principios pedagógicos sólidos

{historial_conversacion}
**PREGUNTA ACTUAL:** {mensaje}

Responde considerando el contexto de nuestra conversación previa con profundidad y coherencia pedagógica."""
    else:
        # Primera pregunta sin RAG
        prompt_completo = f"""Eres un asistente pedagógico experto de la Universidad San Sebastián.

REGLAS DE COMUNICACIÓN:
- Brevedad: Responde conciso, sin sugerencias no solicitadas
- Respeto terminológico: Usa EXACTAMENTE los términos del usuario
- No reformular textos del usuario sin permiso
- Responder solo lo solicitado
- Preguntas de seguimiento: Solo cuando el usuario muestre incertidumbre explícita o la pregunta requiera orientación. NO automáticamente.
- Contexto pedagógico contundente: Al evaluar objetivos, explica POR QUÉ con fundamentos sólidos

**PREGUNTA:** {mensaje}

Responde de manera clara, profunda y pedagógicamente fundamentada."""
    
    # ========================================
    # Consultar a Gemini
    # ========================================
    respuesta_modelo = consultar_gemini(prompt_completo)
    
    # ========================================
    # Guardar mensaje en la sesión
    # ========================================
    chat = Chat.objects.create(
        session=sesion,
        user=request.user,
        mensaje_usuario=mensaje,
        respuesta_ia=respuesta_modelo
    )
    
    # Actualizar timestamp de la sesión
    sesion.save()  # Esto actualiza 'actualizado_en'
    
    return JsonResponse({
        "id": chat.id,
        "sesion_id": sesion.id,
        "mensaje_usuario": chat.mensaje_usuario,
        "respuesta_ia": chat.respuesta_ia,
        "fecha": chat.fecha.isoformat(),
        "usado_rag": bool(contexto_rag),
    }, status=201)