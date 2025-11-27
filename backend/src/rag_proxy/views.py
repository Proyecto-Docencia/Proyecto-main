import json
import os
import time
import httpx
from typing import Tuple, List, Dict, Any
from django.http import JsonResponse, HttpRequest
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt

from chat_app.ai_service import consultar_gemini

# Configuración del RAG Service externo
ENABLE_RAG = os.environ.get("ENABLE_RAG", "0") == "1"
RAG_SERVICE_URL = os.environ.get("RAG_SERVICE_URL", "https://rag-service-265462853523.us-central1.run.app")
RAG_TIMEOUT = int(os.environ.get("RAG_TIMEOUT", "30"))  # segundos


def buscar_contexto_rag(query: str, top_k: int = 5) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Función interna para buscar contexto en el RAG Service externo.
    
    Args:
        query: Pregunta o consulta del usuario
        top_k: Número de resultados a retornar (default: 5)
        
    Returns:
        Tuple con (contexto_formateado: str, fuentes: List[Dict])
        
    Raises:
        httpx.TimeoutException: Si el RAG Service no responde a tiempo
        httpx.HTTPError: Si hay error HTTP en la llamada
        Exception: Otros errores inesperados
    """
    with httpx.Client(timeout=RAG_TIMEOUT) as client:
        response = client.post(
            f"{RAG_SERVICE_URL}/search",
            json={"query": query, "top_k": top_k}
        )
        response.raise_for_status()
        rag_data = response.json()
        results = rag_data.get("results", [])
    
    # Formatear contexto desde resultados
    contexto = ""
    if results:
        contexto = "\n\n".join([
            f"[Documento: {r['doc']}, Página: {r['page']}, Score: {r['score']:.3f}]\n{r['text']}"
            for r in results
        ])
    
    return contexto, results


@csrf_exempt
@require_http_methods(["POST"])
def query_rag(request: HttpRequest):
    if not ENABLE_RAG:
        return JsonResponse({"error": "RAG desactivado", "enabled": False}, status=503)

    t0 = time.time()
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except Exception:
        payload = {}

    mensaje = (payload.get("mensaje_usuario") or payload.get("question") or "").strip()
    if not mensaje:
        return JsonResponse({"error": "mensaje_usuario requerido"}, status=400)

    top_k = payload.get("top_k", 5)
    
    # Llamar al RAG Service externo usando función centralizada
    try:
        contexto, results = buscar_contexto_rag(mensaje, top_k)
    except httpx.TimeoutException:
        return JsonResponse(
            {"error": "RAG Service timeout", "enabled": True},
            status=504
        )
    except httpx.HTTPError as e:
        return JsonResponse(
            {"error": f"RAG Service error: {str(e)}", "enabled": True},
            status=503
        )
    except Exception as e:
        return JsonResponse(
            {"error": f"Error inesperado: {str(e)}", "enabled": True},
            status=500
        )

    # Construcción de prompt para Gemini con reglas estrictas para mayor certeza
    if contexto:
        prompt = (
            "Eres un asistente pedagógico EXPERTO de la Universidad San Sebastián.\n\n"
            "REGLAS ESTRICTAS:\n"
            "1. Responde SOLO con información del contexto proporcionado\n"
            "2. Si el contexto no responde la pregunta, di: 'No encuentro esta información en los documentos disponibles (Capítulos 2-6)'\n"
            "3. SIEMPRE cita: 'Según Capítulo X, página Y...'\n"
            "4. Respuesta máxima: 120 palabras + lista de fuentes\n"
            "5. NO inventes datos fuera del contexto\n\n"
            f"CONTEXTO DE DOCUMENTOS EDUCATIVOS:\n{contexto}\n\n"
            f"PREGUNTA DEL DOCENTE: {mensaje}\n\n"
            "RESPUESTA (estructura: respuesta directa + fuentes citadas):"
        )
    else:
        prompt = (
            f"No encontré información relevante en los documentos educativos disponibles (Capítulos 2-6) "
            f"para responder: '{mensaje}'. ¿Podrías reformular tu pregunta o ser más específico sobre el tema que necesitas?"
        )

    respuesta = consultar_gemini(prompt)

    fuentes = [
        {
            "doc": r["doc"],
            "page": r["page"],
            "score": round(r["score"], 4),
            "preview": (r["text"][:160] + "…") if len(r["text"]) > 160 else r["text"],
        }
        for r in results
    ]

    return JsonResponse(
        {
            "respuesta_ia": respuesta,
            "fuentes": fuentes,
            "fallback_sin_contexto": not bool(results),
            "latencia_ms": int((time.time() - t0) * 1000),
            "enabled": True,
        },
        status=200,
    )
