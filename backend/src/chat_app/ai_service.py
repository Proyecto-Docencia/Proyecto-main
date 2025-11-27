# chat_app/ai_service.py
import os

try:
    from google import genai
    from google.genai import types
    GOOGLE_AVAILABLE = True
except ImportError:
    GOOGLE_AVAILABLE = False
    genai = None
    types = None

API_KEY = os.environ.get("GEMINI_API_KEY")
# La API key se toma de la variable de entorno GEMINI_API_KEY
# Si no existe, evitamos inicializar el cliente para no fallar en tests o dev sin clave.
client = genai.Client() if (os.environ.get("GEMINI_API_KEY") and GOOGLE_AVAILABLE) else None

GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
# Thinking budget para modelos que lo soporten
THINKING_BUDGET = int(os.environ.get("GEMINI_THINKING_BUDGET", "0"))
THINKING_REQUIRED_MODELS = {"gemini-2.5-pro", "models/gemini-2.5-pro", "gemini-2.0-flash-thinking-exp-01-21", "models/gemini-2.0-flash-thinking-exp-01-21"}

def consultar_gemini(prompt_usuario: str) -> str:
    """
    Llama al modelo Gemini con un prompt estructurado.
    """
    print(f"--- DEBUG: Recibido en backend: '{prompt_usuario[:100]}...' ---") # LOG DE DEBUG

    if not prompt_usuario.strip():
        return "Por favor ingresa un mensaje."
    if client is None:
        return "La IA (Gemini) no está configurada. Define GEMINI_API_KEY para habilitarla."

    # Prompt estructurado para guiar al modelo
    prompt_estructurado = f"""
    Eres un asistente virtual para docentes de la Universidad San Sebastián.
    Tu rol es ser amable, servicial y responder preguntas sobre material educativo, planificaciones de clases y temas académicos.
    
    REGLAS CRÍTICAS DE COMUNICACIÓN:
    1. BREVEDAD: Responde de forma concisa y directa. NO agregues sugerencias adicionales a menos que se soliciten explícitamente.
    2. RESPETO TERMINOLÓGICO: Usa EXACTAMENTE los mismos términos técnicos que el usuario (ej: si dice "prompts", NO cambies a "avisos" o "prontas" o "indicaciones"). Respeta la terminología incluso si está entre comillas.
    3. NO REFORMULAR: NO reescribas objetivos, textos o formulaciones del usuario sin permiso explícito. Si detectas una mejora posible, pregunta primero: "¿Quieres que te sugiera una versión mejorada?"
    4. RESPONDER LO SOLICITADO: Si el usuario pregunta A, responde A. No agregues B, C, D a menos que se pida.
    5. PREGUNTAS DE SEGUIMIENTO: Solo ofrece ayuda adicional cuando el usuario muestre incertidumbre explícita (ej: "no estoy seguro", "¿qué opinas?") o cuando la pregunta sea abierta y claramente requiera orientación. NO termines cada respuesta con "¿Te gustaría que...?" automáticamente.
    6. FORMATO NATURAL: No uses frases forzadas como "Al finalizar la actividad, los estudiantes serán capaces de..." a menos que el usuario ya las use. Respeta el estilo del usuario.
    7. CONTEXTO PEDAGÓGICO: Cuando evalúes o respondas sobre objetivos de aprendizaje, proporciona contexto educativo sólido explicando POR QUÉ es apropiado o no, basándote en principios pedagógicos (criterios observables, enfoque en el estudiante, alineación con taxonomía de Bloom, etc.).

    Pregunta del docente: "{prompt_usuario}"
    
    Respuesta:
    """

    try:
        # Ajusta el presupuesto de thinking según el modelo seleccionado
        budget = THINKING_BUDGET
        if budget <= 0 and GEMINI_MODEL in THINKING_REQUIRED_MODELS:
            budget = 0  # gemini-2.5-flash no requiere thinking budget

        cfg = None
        if types and budget > 0:
            cfg = types.GenerateContentConfig(
                temperature=0.2,  # Más preciso y enfocado para respuestas pedagógicas
                top_p=0.85,       # Reduce aún más la variabilidad
                thinking_config=types.ThinkingConfig(thinking_budget=budget)
            )
        elif types:
            # Sin thinking pero con temperature baja
            cfg = types.GenerateContentConfig(
                temperature=0.2,
                top_p=0.85
            )

        kwargs = {"model": GEMINI_MODEL, "contents": [prompt_estructurado]}
        if cfg is not None:
            kwargs["config"] = cfg

        # Llamada correcta: client.models.generate_content
        resp = client.models.generate_content(**kwargs)
        
        text = getattr(resp, "text", "") or ""
        print(f"--- DEBUG: Respuesta generada por IA: '{text[:200]}...' ---") # LOG DE DEBUG
        return text.strip() or "La IA no devolvió contenido."
    except Exception as e:
        print(f"--- ERROR en Gemini: {e} ---") # LOG DE ERROR
        return f"Error al contactar con la IA: {e}"


def consultar_gemini_json(prompt_directo: str, temperature: float = 0.1) -> str:
    """
    Llama al modelo Gemini con un prompt directo para obtener respuestas JSON estructuradas.
    Usa temperatura muy baja para mayor precisión y consistencia en el formato.
    
    Args:
        prompt_directo: El prompt completo sin modificar
        temperature: Temperatura para la generación (default: 0.1 para mayor precisión)
    
    Returns:
        Respuesta del modelo en formato string
    """
    print(f"--- DEBUG JSON: Llamando Gemini con temperatura {temperature} ---")
    
    if not prompt_directo.strip():
        return '{"error": "Prompt vacío"}'
    if client is None:
        return '{"error": "IA no configurada"}'

    try:
        cfg = None
        if types:
            cfg = types.GenerateContentConfig(
                temperature=temperature,  # Temperatura muy baja para formato consistente
                top_p=0.95,              # Ligeramente más alto para evitar repeticiones
                response_mime_type="application/json"  # Forzar respuesta JSON
            )

        kwargs = {"model": GEMINI_MODEL, "contents": [prompt_directo]}
        if cfg is not None:
            kwargs["config"] = cfg

        resp = client.models.generate_content(**kwargs)
        
        text = getattr(resp, "text", "") or ""
        print(f"--- DEBUG JSON: Respuesta recibida ({len(text)} chars) ---")
        return text.strip() or '{"error": "Sin respuesta"}'
        
    except Exception as e:
        print(f"--- ERROR en Gemini JSON: {e} ---")
        return f'{{"error": "Error al contactar IA: {str(e)}"}}'