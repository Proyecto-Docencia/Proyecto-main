import json
import io
from django.http import JsonResponse, HttpResponseNotAllowed, HttpResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from .models import Planificacion, FeedbackValidacion

ERR_AUTH = {'error': 'Authentication required'}
ERR_JSON = {'error': 'Invalid JSON'}
ERR_TITULO = {'error': 'Titulo is required'}


def _plan_to_dict(plan: Planificacion):
    """Convierte una planificación a diccionario para JSON"""
    return {
        'id': plan.id,
        'titulo': plan.titulo,
        'descripcion': plan.descripcion,
        'estado': plan.estado,
        'asignatura': plan.asignatura,
        'nivel_educativo': plan.nivel_educativo,
        'curso': plan.curso,
        'unidad_tematica': plan.unidad_tematica,
        'duracion_horas': plan.duracion_horas,
        'objetivo_general': plan.objetivo_general,
        'objetivos_especificos': plan.objetivos_especificos,
        'competencias_disciplinares': plan.competencias_disciplinares,
        'competencias_genericas': plan.competencias_genericas,
        'metodologia': plan.metodologia,
        'estrategias_ensenanza': plan.estrategias_ensenanza,
        'recursos_materiales': plan.recursos_materiales,
        'instrumentos_evaluacion': plan.instrumentos_evaluacion,
        'criterios_evaluacion': plan.criterios_evaluacion,
        'contenido_tematico': plan.contenido_tematico,
        'actividades_aprendizaje': plan.actividades_aprendizaje,
        'feedback_ia': plan.feedback_ia,
        'sugerencias_mejora': plan.sugerencias_mejora,
        'validacion_final': plan.validacion_final,
        'version': plan.version,
        'creado_en': plan.creado_en.isoformat(),
        'actualizado_en': plan.actualizado_en.isoformat(),
    }


def _feedback_to_dict(feedback: FeedbackValidacion):
    """Convierte un feedback a diccionario para JSON"""
    return {
        'id': feedback.id,
        'feedback_texto': feedback.feedback_texto,
        'puntuacion': feedback.puntuacion,
        'aspectos_positivos': feedback.aspectos_positivos,
        'aspectos_mejorar': feedback.aspectos_mejorar,
        'sugerencias': feedback.sugerencias,
        'alineamiento_capitulos': feedback.alineamiento_capitulos,
        'creado_en': feedback.creado_en.isoformat(),
    }


@csrf_exempt
@require_http_methods(["GET"])
def mis_planificaciones(request):
    """Obtiene todas las planificaciones del usuario"""
    if not request.user.is_authenticated:
        return JsonResponse(ERR_AUTH, status=401)
    
    plans = Planificacion.objects.filter(owner=request.user)
    return JsonResponse({'results': [_plan_to_dict(p) for p in plans]}, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def crear_planificacion(request):
    """Crea una nueva planificación desde el formulario"""
    if not request.user.is_authenticated:
        return JsonResponse(ERR_AUTH, status=401)
    
    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse(ERR_JSON, status=400)

    titulo = (payload.get('titulo') or '').strip()
    if not titulo:
        return JsonResponse(ERR_TITULO, status=400)

    plan = Planificacion.objects.create(
        owner=request.user,
        titulo=titulo,
        descripcion=payload.get('descripcion', ''),
        asignatura=payload.get('asignatura', ''),
        nivel_educativo=payload.get('nivel_educativo', ''),
        curso=payload.get('curso', ''),
        unidad_tematica=payload.get('unidad_tematica', ''),
        duracion_horas=payload.get('duracion_horas'),
        objetivo_general=payload.get('objetivo_general', ''),
        objetivos_especificos=payload.get('objetivos_especificos', []),
        competencias_disciplinares=payload.get('competencias_disciplinares', []),
        competencias_genericas=payload.get('competencias_genericas', []),
        metodologia=payload.get('metodologia', ''),
        estrategias_ensenanza=payload.get('estrategias_ensenanza', []),
        recursos_materiales=payload.get('recursos_materiales', []),
        instrumentos_evaluacion=payload.get('instrumentos_evaluacion', []),
        criterios_evaluacion=payload.get('criterios_evaluacion', ''),
        contenido_tematico=payload.get('contenido_tematico', {}),
        actividades_aprendizaje=payload.get('actividades_aprendizaje', []),
        estado='borrador'
    )
    
    return JsonResponse(_plan_to_dict(plan), status=201)


@csrf_exempt
@require_http_methods(["POST"])
def validar_planificacion_ia(request, plan_id: int):
    """Valida una planificación con IA y proporciona feedback"""
    if not request.user.is_authenticated:
        return JsonResponse(ERR_AUTH, status=401)
    
    plan = get_object_or_404(Planificacion, id=plan_id, owner=request.user)
    
    # Construir contexto para la IA
    contexto_planificacion = f"""
    PLANIFICACIÓN A VALIDAR:
    Título: {plan.titulo}
    Asignatura: {plan.asignatura}
    Nivel: {plan.nivel_educativo} - {plan.curso}
    Unidad Temática: {plan.unidad_tematica}
    Duración: {plan.duracion_horas} horas
    
    OBJETIVO GENERAL:
    {plan.objetivo_general}
    
    OBJETIVOS ESPECÍFICOS:
    {' - '.join(plan.objetivos_especificos)}
    
    COMPETENCIAS DISCIPLINARES:
    {' - '.join(plan.competencias_disciplinares)}
    
    COMPETENCIAS GENÉRICAS:
    {' - '.join(plan.competencias_genericas)}
    
    METODOLOGÍA:
    {plan.metodologia}
    
    CRITERIOS DE EVALUACIÓN:
    {plan.criterios_evaluacion}
    """
    
    # Consultar conocimiento RAG sobre alfabetización digital y capítulos (opcional)
    try:
        from rag_proxy.views import buscar_contexto_rag
        from chat_app.ai_service import consultar_gemini_json
        
        # Buscar contexto relevante en los documentos educativos
        query_rag = f"""
        alfabetización digital planificación educativa {plan.asignatura} 
        competencias {' '.join(plan.competencias_disciplinares[:2])} 
        metodología evaluación {plan.nivel_educativo}
        """
        
        chunks_rag, _ = buscar_contexto_rag(query_rag.strip(), top_k=10)
        
        # Formatear contexto RAG
        contexto_rag = ""
        if chunks_rag:
            contexto_rag = f"""
CONTEXTO DE LOS CAPÍTULOS DE ALFABETIZACIÓN DIGITAL (fuente: documentos oficiales USS):
{chunks_rag}

Estos capítulos contienen las metodologías, competencias y mejores prácticas que deben guiar tu evaluación.
"""
        
        prompt_validacion = f"""
Eres un experto evaluador pedagógico de la Universidad San Sebastián, especializado en alfabetización digital e integración de IA Generativa en educación superior.

{contexto_rag}

{contexto_planificacion}

REGLAS DE COMUNICACIÓN:
- RESPETO TERMINOLÓGICO: Usa EXACTAMENTE los mismos términos que aparecen en la planificación (si dice "prompts", usa "prompts"; si dice "IAGen", usa "IAGen")
- NO REFORMULAR: No reescribas los objetivos o textos de la planificación. Evalúa lo que está escrito, no lo que podría ser
- BREVEDAD EN ANÁLISIS: Sé específico y directo. Evita generalidades o floritura pedagógica innecesaria
- CITAS PERTINENTES: Solo cita capítulos cuando haya relación REAL con la planificación, no fuerces citas

INSTRUCCIONES DE EVALUACIÓN:
Analiza profundamente esta planificación considerando:

1. **ALINEAMIENTO CON CAPÍTULOS**: Identifica qué capítulos de alfabetización digital (2-6) se relacionan con esta planificación y CITA ESPECÍFICAMENTE las páginas y secciones relevantes. Explica cómo los conceptos de esas páginas se vinculan con los objetivos, metodología y competencias propuestas.

2. **COHERENCIA PEDAGÓGICA**: Evalúa si los objetivos, metodología, competencias y evaluación están alineados entre sí y con el contexto del curso.

3. **INTEGRACIÓN DE IAGEN**: Analiza cómo la planificación incorpora (o podría incorporar) herramientas de IA Generativa de forma ética y efectiva. Cita metodologías específicas de los capítulos.

4. **COMPETENCIAS DIGITALES**: Verifica que las competencias digitales estén bien definidas y sean alcanzables en el tiempo propuesto.

5. **EVALUACIÓN**: Analiza si los criterios de evaluación son claros, medibles y coherentes con los objetivos.

FORMATO DE RESPUESTA:
Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin markdown, sin explicaciones antes o después.
El JSON debe tener exactamente esta estructura:

{{
    "puntuacion": <número entre 1-10 con un decimal, ej: 7.5>,
    "aspectos_positivos": [
        "**Aspecto 1**: Descripción específica del elemento positivo concreto de la planificación. Si hay relación con capítulos, citar: 'Según Capítulo 3, p. 45...'",
        "**Aspecto 2**: Evidencia concreta de lo que funciona bien en esta planificación específica",
        "**Aspecto 3**: Fortaleza real identificada con ejemplo específico de la planificación"
    ],
    "aspectos_mejorar": [
        "**Mejora 1**: Descripción clara y específica del aspecto a mejorar. Si aplica, citar capítulo: 'Fortalecer X según Cap. 4, p. 78...'",
        "**Mejora 2**: Área de mejora concreta con ejemplo práctico"
    ],
    "sugerencias": [
        "**Sugerencia 1**: Acción específica y aplicable. Si hay metodología en capítulos, citar: 'Implementar [técnica X] descrita en Cap. [Y], p. [Z]. Ejemplo para {plan.asignatura}: ...'",
        "**Sugerencia 2**: Recomendación práctica concreta para esta planificación específica",
        "**Sugerencia 3**: Propuesta directa aplicable al contexto de {plan.nivel_educativo}"
    ],
    "alineamiento_capitulos": {{
        "capitulo_2": "**Ciclo de Experiencias (Cap. 2):** Análisis específico solo SI la planificación menciona o refleja etapas del ciclo. Citar páginas relevantes. Si NO aplica, decir 'No aplica - la planificación no aborda ciclo de experiencias'.",
        "capitulo_3": "**Alfabetización Digital en IAGen (Cap. 3):** Análisis solo SI hay mención de IA o herramientas digitales. Citar páginas específicas. Si NO hay integración de IA, decir 'No identificado - considerar integrar según Cap. 3, p. X'.",
        "capitulo_4": "**Pensamiento Crítico (Cap. 4):** Análisis solo SI las actividades/evaluación desarrollan pensamiento crítico. Citar páginas relevantes. Si NO, decir 'No explícito - podría fortalecerse con técnicas de Cap. 4'.",
        "capitulo_5": "**Trabajo Autónomo (Cap. 5):** Análisis solo SI hay momentos de trabajo independiente. Citar páginas. Si NO, decir 'No identificado'.",
        "capitulo_6": "**Trabajo Colaborativo (Cap. 6):** Análisis solo SI hay actividades grupales. Citar páginas. Si NO, decir 'No presente'."
    }},
    "feedback_general": "### Resumen\\n\\n**Fortaleza Principal:** [La fortaleza MÁS relevante de esta planificación específica]\\n\\n**Observaciones Clave:**\\n- [Punto 1 específico de la planificación]\\n- [Punto 2 si es relevante]\\n\\n**Recomendación Principal:** [UNA acción específica y concreta para mejorar esta planificación]\\n\\n---\\n\\n**Referencias:** [Solo si se citaron capítulos en el análisis]",
    "referencias_bibliograficas": [
        "Capítulo X, página Y: [Concepto clave citado]"
    ]
}}

REGLAS CRÍTICAS:
- NO agregues texto antes o después del JSON
- NO uses markdown (```json) alrededor del JSON
- USA markdown (**, ###, -) DENTRO de los strings del JSON para formato
- Cita con formato "Capítulo X, página Y" o "Cap. X, p. Y" solo cuando sea PERTINENTE
- NO fuerces citas si no hay relación real con la planificación
- Si encuentras contenido vacío o placeholder (como "1234"), califícalo bajo (1-3) y señálalo explícitamente
- Usa los TÉRMINOS EXACTOS de la planificación (no cambies "prompts" por "avisos", etc.)
- NO reescribas los objetivos del docente
- Sé ESPECÍFICO: menciona "{plan.asignatura}", "{plan.nivel_educativo}", elementos concretos de la planificación
- En sugerencias, da acciones CONCRETAS y APLICABLES, no teoría general
- El feedback_general debe ser CONCISO (máximo 150 palabras)
- Solo incluye referencias bibliográficas de capítulos REALMENTE citados en el análisis
"""
        
        # Obtener respuesta de la IA con formato JSON forzado
        respuesta_ia = consultar_gemini_json(prompt_validacion, temperature=0.05)
        
        # Limpiar respuesta para extraer JSON
        try:
            # Buscar JSON en la respuesta (puede venir con markdown)
            import re
            json_match = re.search(r'\{[\s\S]*\}', respuesta_ia)
            if json_match:
                json_str = json_match.group(0)
                feedback_data = json.loads(json_str)
            else:
                raise json.JSONDecodeError("No JSON found", respuesta_ia, 0)
                
            # Validar estructura mínima
            if not isinstance(feedback_data.get('puntuacion'), (int, float)):
                feedback_data['puntuacion'] = 7.0
            if not isinstance(feedback_data.get('aspectos_positivos'), list):
                feedback_data['aspectos_positivos'] = []
            if not isinstance(feedback_data.get('aspectos_mejorar'), list):
                feedback_data['aspectos_mejorar'] = []
            if not isinstance(feedback_data.get('sugerencias'), list):
                feedback_data['sugerencias'] = []
            if not isinstance(feedback_data.get('alineamiento_capitulos'), dict):
                feedback_data['alineamiento_capitulos'] = {}
                
        except (json.JSONDecodeError, AttributeError) as e:
            print(f"[VALIDACION] Error parseando JSON: {e}")
            # Si no es JSON válido, extraer información del texto
            feedback_data = {
                "puntuacion": 5.0,
                "aspectos_positivos": ["Estructura pedagógica presente"],
                "aspectos_mejorar": ["Desarrollar contenido específico de la planificación"],
                "sugerencias": ["Completar todas las secciones con contenido detallado"],
                "alineamiento_capitulos": {
                    "general": "No se pudo analizar el alineamiento sin contenido específico"
                },
                "feedback_general": respuesta_ia
            }
        
        # Crear registro de feedback
        feedback = FeedbackValidacion.objects.create(
            planificacion=plan,
            feedback_texto=feedback_data.get('feedback_general', respuesta_ia),
            puntuacion=feedback_data.get('puntuacion', 7.0),
            aspectos_positivos=feedback_data.get('aspectos_positivos', []),
            aspectos_mejorar=feedback_data.get('aspectos_mejorar', []),
            sugerencias=feedback_data.get('sugerencias', []),
            alineamiento_capitulos=feedback_data.get('alineamiento_capitulos', {})
        )
        
        # Actualizar estado de la planificación
        plan.estado = 'en_validacion'
        plan.save()
        
        return JsonResponse({
            'feedback': _feedback_to_dict(feedback),
            'planificacion': _plan_to_dict(plan)
        }, status=200)
        
    except Exception as e:
        return JsonResponse({'error': f'Error en validación: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def generar_pdf_planificacion(request, plan_id: int):
    """Genera y descarga la planificación como PDF"""
    if not request.user.is_authenticated:
        return JsonResponse(ERR_AUTH, status=401)
    
    plan = get_object_or_404(Planificacion, id=plan_id, owner=request.user)
    
    try:
        # Importar reportlab para generar PDF
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter, A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib import colors
        from reportlab.lib.units import inch
        
        # Crear buffer de memoria para el PDF
        buffer = io.BytesIO()
        
        # Crear documento PDF
        doc = SimpleDocTemplate(buffer, pagesize=A4, 
                              rightMargin=72, leftMargin=72,
                              topMargin=72, bottomMargin=18)
        
        # Definir estilos
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            spaceAfter=30,
            alignment=1,  # Centro
            textColor=colors.HexColor('#2563eb')
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=12,
            spaceAfter=12,
            textColor=colors.HexColor('#1f2937')
        )
        
        normal_style = styles['Normal']
        normal_style.fontSize = 10
        normal_style.spaceAfter = 12
        
        # Construir contenido del PDF
        story = []
        
        # Título principal
        story.append(Paragraph(f"PLANIFICACIÓN ACADÉMICA", title_style))
        story.append(Paragraph(f"{plan.titulo}", title_style))
        story.append(Spacer(1, 20))
        
        # Información general
        info_data = [
            ['ASIGNATURA:', plan.asignatura],
            ['NIVEL EDUCATIVO:', plan.nivel_educativo],
            ['CURSO:', plan.curso],
            ['UNIDAD TEMÁTICA:', plan.unidad_tematica],
            ['DURACIÓN:', f"{plan.duracion_horas} horas" if plan.duracion_horas else "No especificado"],
        ]
        
        info_table = Table(info_data, colWidths=[2*inch, 4*inch])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db')),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        story.append(info_table)
        story.append(Spacer(1, 20))
        
        # Objetivo general
        if plan.objetivo_general:
            story.append(Paragraph("OBJETIVO GENERAL", heading_style))
            story.append(Paragraph(plan.objetivo_general, normal_style))
            story.append(Spacer(1, 12))
        
        # Objetivos específicos
        if plan.objetivos_especificos:
            story.append(Paragraph("OBJETIVOS ESPECÍFICOS", heading_style))
            for obj in plan.objetivos_especificos:
                story.append(Paragraph(f"• {obj}", normal_style))
            story.append(Spacer(1, 12))
        
        # Competencias
        if plan.competencias_disciplinares:
            story.append(Paragraph("COMPETENCIAS DISCIPLINARES", heading_style))
            for comp in plan.competencias_disciplinares:
                story.append(Paragraph(f"• {comp}", normal_style))
            story.append(Spacer(1, 12))
        
        if plan.competencias_genericas:
            story.append(Paragraph("COMPETENCIAS GENÉRICAS", heading_style))
            for comp in plan.competencias_genericas:
                story.append(Paragraph(f"• {comp}", normal_style))
            story.append(Spacer(1, 12))
        
        # Metodología
        if plan.metodologia:
            story.append(Paragraph("METODOLOGÍA", heading_style))
            story.append(Paragraph(plan.metodologia, normal_style))
            story.append(Spacer(1, 12))
        
        # Criterios de evaluación
        if plan.criterios_evaluacion:
            story.append(Paragraph("CRITERIOS DE EVALUACIÓN", heading_style))
            story.append(Paragraph(plan.criterios_evaluacion, normal_style))
        
        # Construir PDF
        doc.build(story)
        
        # Preparar respuesta HTTP
        buffer.seek(0)
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="planificacion_{plan.titulo.replace(" ", "_")}.pdf"'
        response.write(buffer.getvalue())
        buffer.close()
        
        # Marcar como finalizada
        plan.validacion_final = True
        plan.estado = 'finalizada'
        plan.save()
        
        return response
        
    except ImportError:
        return JsonResponse({'error': 'Biblioteca PDF no disponible. Instalar reportlab.'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'Error generando PDF: {str(e)}'}, status=500)


@csrf_exempt
@require_http_methods(["GET", "PATCH", "DELETE"])
def planificacion_detalle(request, plan_id: int):
    if not request.user.is_authenticated:
        return JsonResponse(ERR_AUTH, status=401)
    plan = get_object_or_404(Planificacion, id=plan_id, owner=request.user)

    if request.method == 'GET':
        return JsonResponse(_plan_to_dict(plan))

    if request.method == 'PATCH':
        return _patch_plan(request, plan)

    if request.method == 'DELETE':
        plan.delete()
        return JsonResponse({'message': 'Deleted'})

    return HttpResponseNotAllowed(["GET", "PATCH", "DELETE"])


def _patch_plan(request, plan: Planificacion):
    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse(ERR_JSON, status=400)
    
    # Campos básicos
    if 'titulo' in payload:
        t = (payload.get('titulo') or '').strip()
        if not t:
            return JsonResponse(ERR_TITULO, status=400)
        plan.titulo = t
    if 'descripcion' in payload:
        plan.descripcion = payload.get('descripcion') or ''
    if 'estado' in payload:
        plan.estado = payload.get('estado', 'borrador')
    
    # Campos del formulario
    if 'asignatura' in payload:
        plan.asignatura = payload.get('asignatura') or ''
    if 'nivel_educativo' in payload:
        plan.nivel_educativo = payload.get('nivel_educativo') or ''
    if 'curso' in payload:
        plan.curso = payload.get('curso') or ''
    if 'unidad_tematica' in payload:
        plan.unidad_tematica = payload.get('unidad_tematica') or ''
    if 'duracion_horas' in payload:
        plan.duracion_horas = payload.get('duracion_horas')
    if 'objetivo_general' in payload:
        plan.objetivo_general = payload.get('objetivo_general') or ''
    if 'objetivos_especificos' in payload:
        plan.objetivos_especificos = payload.get('objetivos_especificos') or []
    if 'competencias_disciplinares' in payload:
        plan.competencias_disciplinares = payload.get('competencias_disciplinares') or []
    if 'competencias_genericas' in payload:
        plan.competencias_genericas = payload.get('competencias_genericas') or []
    if 'metodologia' in payload:
        plan.metodologia = payload.get('metodologia') or ''
    if 'estrategias_ensenanza' in payload:
        plan.estrategias_ensenanza = payload.get('estrategias_ensenanza') or []
    if 'recursos_materiales' in payload:
        plan.recursos_materiales = payload.get('recursos_materiales') or []
    if 'instrumentos_evaluacion' in payload:
        plan.instrumentos_evaluacion = payload.get('instrumentos_evaluacion') or []
    if 'criterios_evaluacion' in payload:
        plan.criterios_evaluacion = payload.get('criterios_evaluacion') or ''
    if 'contenido_tematico' in payload:
        plan.contenido_tematico = payload.get('contenido_tematico') or {}
    if 'actividades_aprendizaje' in payload:
        plan.actividades_aprendizaje = payload.get('actividades_aprendizaje') or []
    if 'sugerencias_mejora' in payload:
        plan.sugerencias_mejora = payload.get('sugerencias_mejora') or ''
    
    # Incrementar versión si hay cambios significativos
    if any(key in payload for key in ['objetivo_general', 'objetivos_especificos', 'competencias_disciplinares', 'metodologia']):
        plan.version += 1
    
    plan.save()
    return JsonResponse(_plan_to_dict(plan))
