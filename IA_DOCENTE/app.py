import os
import requests
import gradio as gr

"""
Gradio app that forwards queries to a configurable RAG endpoint.

Configuration (set in the Space 'Secrets' or environment):
- RAG_ENDPOINT: full URL or host of the RAG service (if no path is provided, `/run/predict` will be appended)
- RAG_TOKEN: optional bearer token for the RAG service

The RAG endpoint is expected to accept POST JSON {"data": ["<question>"]} and
return JSON {"data": ["<answer>"]}. The function returns the first element.
"""

RAG_ENDPOINT = os.environ.get("RAG_ENDPOINT", "").strip()
RAG_TOKEN = os.environ.get("RAG_TOKEN", "").strip()


def call_rag_service(question: str):
    if not question or not question.strip():
        return "Por favor escribe una pregunta."

    # Resolve RAG endpoint: allow users to paste the web URL (huggingface.co/spaces/...) and
    # attempt to convert it to the runtime host (*.hf.space). If resolution fails, return a
    # helpful message.
    resolved = resolve_rag_endpoint(RAG_ENDPOINT)
    if not resolved:
        # Fallback demo mode: respond locally so /run/predict returns JSON and the Space
        # can be tested without an external RAG service configured.
        demo_answer = f"[DEMO RAG] Respuesta simulada para: {question}"
        print(f"IA_DOCENTE: RAG_ENDPOINT no resuelto, devolviendo demo answer. RAG_ENDPOINT='{RAG_ENDPOINT}'")
        return demo_answer

    # Build URL: if the endpoint already contains a path, use it; otherwise append /run/predict
    # Build final URL
    if any(p in resolved for p in ("/run/", "/api/", "/predict")):
        url = resolved.rstrip('/')
    else:
        url = resolved.rstrip('/') + "/run/predict"

    headers = {"Content-Type": "application/json"}
    if RAG_TOKEN:
        headers["Authorization"] = f"Bearer {RAG_TOKEN}"

    try:
        resp = requests.post(url, json={"data": [question]}, headers=headers, timeout=60)
    except requests.exceptions.RequestException as e:
        return f"Error de conexión al RAG: {e} (url: {url})"

    if resp.status_code != 200:
        # try to show useful body info
        try:
            body = resp.json()
        except Exception:
            body = resp.text
        return f"RAG error {resp.status_code}: {body} (url: {url})"

    try:
        data = resp.json()
    except Exception as e:
        return f"Respuesta inválida del RAG (no JSON): {e} - {resp.text}"

    if isinstance(data, dict) and "data" in data and len(data["data"]) > 0:
        return data["data"][0]

    return str(data)


def resolve_rag_endpoint(endpoint: str) -> str | None:
    """Resolve an endpoint value to a usable URL.

    - If endpoint is empty -> return None
    - If endpoint already looks like an API host (contains hf.space or a path), return it
    - If endpoint contains huggingface.co/spaces/<user>/<space>, try to derive possible
      *.hf.space hosts and probe them (POST {"data":["ping"]}) to find one that responds.
    Returns the resolved base URL (without added /run/predict) or None if none found.
    """
    if not endpoint:
        return None

    # If it's already an hf.space host or contains a predictable path, use it directly
    if ".hf.space" in endpoint:
        return endpoint.rstrip('/')

    # If user provided an api-like URL with /run/predict, strip path and return base
    if "/run/predict" in endpoint or "/api/" in endpoint or "/predict" in endpoint:
        return endpoint.split('/run/predict')[0].rstrip('/')

    # If the endpoint is the huggingface.co Spaces web URL, try to derive a host
    if "huggingface.co/spaces" in endpoint:
        try:
            parts = endpoint.rstrip('/').split('/')
            # Expect form .../spaces/<user>/<space>
            idx = parts.index('spaces')
            user = parts[idx+1]
            space = parts[idx+2]
        except Exception:
            return None

        user_l = user.lower()
        space_l = space.lower().replace('_', '-')
        candidates = [f"{user_l}-{space_l}", f"{space_l}-{user_l}"]

        # Probe each candidate to see if the host responds to /run/predict
        probe_payload = {"data": ["ping"]}
        for c in candidates:
            host = f"https://{c}.hf.space"
            try:
                r = requests.post(host + "/run/predict", json=probe_payload, timeout=5)
                if r.status_code == 200:
                    return host
            except Exception:
                continue

    # Otherwise, we don't know how to resolve it
    return None


interface = gr.Interface(
    fn=call_rag_service,
    inputs=gr.Textbox(lines=3, placeholder="Escribe tu pregunta aquí...", label="Pregunta"),
    outputs=gr.Textbox(label="Respuesta"),
    title="IA Docente",
    description="Envía consultas a tu RAG configurado en `RAG_ENDPOINT`. Define `RAG_TOKEN` si tu servicio requiere autenticación.",
    allow_flagging='never'
)


if __name__ == "__main__":
    interface.launch(server_name="0.0.0.0", server_port=int(os.environ.get("PORT", 7860)))

