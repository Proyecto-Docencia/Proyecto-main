import os
import requests
import gradio as gr

DEFAULT_ENDPOINT = os.environ.get("RAG_ENDPOINT", "https://yo-123.hf.space")


def query_rag(endpoint, question):
    endpoint = endpoint.strip() or DEFAULT_ENDPOINT
    if not question or not question.strip():
        return "Por favor escribe una pregunta."
    # Common Spaces prediction endpoint
    url = endpoint.rstrip('/') + "/run/predict"
    try:
        resp = requests.post(url, json={"data": [question]}, timeout=60)
        resp.raise_for_status()
        data = resp.json()
        # Spaces usually return {"data": [...]} where index 0 is the returned text
        if isinstance(data, dict) and "data" in data and len(data["data"]) > 0:
            return data["data"][0]
        return str(data)
    except Exception as e:
        return f"Error al llamar al servicio RAG: {e}"


with gr.Blocks(title="IA Docente - RAG Proxy") as demo:
    gr.Markdown("# IA Docente\nInterfaz simple que encola consultas hacia tu servicio RAG (DeepSeek + ChromaDB) alojado en Hugging Face Spaces.\n\nConfigura la URL del Space o usa la variable de entorno `RAG_ENDPOINT`.")

    with gr.Row():
        endpoint_input = gr.Textbox(value=DEFAULT_ENDPOINT, label="RAG endpoint (URL pública del Space)")
    question = gr.Textbox(lines=4, placeholder="Escribe tu pregunta aquí...", label="Pregunta")
    output = gr.Textbox(label="Respuesta")

    run_btn = gr.Button("Consultar")
    run_btn.click(fn=query_rag, inputs=[endpoint_input, question], outputs=output)

    gr.Markdown("---\nNotas:\n- Asegúrate de que tu Space público acepte peticiones desde este cliente.\n- El endpoint por defecto apunta a `https://yo-123.hf.space/run/predict`.\n- Si tu Space usa otra ruta, especifica la URL completa arriba.")


if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=int(os.environ.get("PORT", 7860)))
