import json
import os
import requests
from django.http import JsonResponse, HttpRequest
from django.views.decorators.http import require_http_methods


RAG_ENDPOINT = os.environ.get("RAG_ENDPOINT", "").strip()
RAG_TOKEN = os.environ.get("RAG_TOKEN", "").strip()


@require_http_methods(["POST"])
def query_rag(request: HttpRequest):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except Exception:
        payload = {}

    question = (payload.get("question") or payload.get("mensaje_usuario") or "").strip()
    if not question:
        return JsonResponse({"error": "question required"}, status=400)

    if not RAG_ENDPOINT:
        return JsonResponse({"error": "No RAG_ENDPOINT configured"}, status=500)

    # Build URL
    if any(p in RAG_ENDPOINT for p in ("/run/", "/api/", "/predict")):
        url = RAG_ENDPOINT.rstrip("/")
    else:
        url = RAG_ENDPOINT.rstrip("/") + "/run/predict"

    headers = {"Content-Type": "application/json"}
    if RAG_TOKEN:
        headers["Authorization"] = f"Bearer {RAG_TOKEN}"

    try:
        resp = requests.post(url, json={"data": [question]}, headers=headers, timeout=30)
    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": f"RAG connection error: {e}"}, status=502)

    if resp.status_code != 200:
        # return useful body if possible
        try:
            body = resp.json()
        except Exception:
            body = resp.text
        return JsonResponse({"error": "RAG returned error", "detail": body}, status=502)

    try:
        data = resp.json()
    except Exception:
        return JsonResponse({"error": "RAG returned non-JSON response", "detail": resp.text}, status=502)

    # Expecting {"data": [answer]}
    answer = None
    if isinstance(data, dict) and "data" in data and len(data["data"]) > 0:
        answer = data["data"][0]
    else:
        answer = data

    return JsonResponse({"answer": answer}, status=200)
