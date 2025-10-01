---
title: "IA_DOCENTE"
emoji: "🤖"
colorFrom: "indigo"
colorTo: "blue"
sdk: gradio
sdk_version: "3.0"
app_file: app.py
pinned: false
---

IA_DOCENTE - Deploy para Hugging Face Spaces

Este repositorio contiene una app Gradio mínima (`app.py`) que actúa como cliente/proxy hacia un servicio RAG alojado en Hugging Face Spaces (por ejemplo, DeepSeek-1.5B + ChromaDB).

Archivos incluidos:
- `app.py`: aplicación Gradio que envía consultas a un endpoint RAG.
- `requirements.txt`: dependencias necesarias para el Space.

Preparar y subir a Hugging Face Spaces (pasos resumidos):

1) Instala HF CLI (opcional pero recomendado):
   pip install -U "huggingface_hub[cli]"

2) Clona tu Space (o créalo desde la web). Ejemplo (usa tu token como contraseña cuando se solicite):
   git clone https://huggingface.co/spaces/<tu-usuario>/iA_DOCENTE

   # Alternativa para descargar con la CLI:
   hf download <tu-usuario>/iA_DOCENTE --repo-type=space

3) Copia los archivos de `IA_DOCENTE/` al repositorio clonado del Space, o usa los scripts incluidos:

   - PowerShell (Windows): ejecuta `IA_DOCENTE\\deploy_to_hf.ps1` y sigue las instrucciones.
   - Bash (Linux/macOS): `./IA_DOCENTE/deploy_to_hf.sh <usuario/space>`

4) En el directorio del Space (si copias manualmente):
   git add app.py requirements.txt README.md
   git commit -m "Add IA Docente Gradio app"
   git push

   Cuando se pida usuario/contraseña, usa tu token de acceso personal (con permisos de write) como contraseña. Genera uno en: https://huggingface.co/settings/tokens

Configuración y uso
- Por defecto la app enviará peticiones a `https://yo-123.hf.space/run/predict`. Cambia la URL en la caja "RAG endpoint" si tu Space expone otra ruta.
- También puedes definir la variable de entorno `RAG_ENDPOINT` en el entorno local antes del deploy si quieres otro valor por defecto.

Notas técnicas
 
 Exposed endpoints
 -----------------
 
 - The Gradio app exposes a prediction endpoint at `/run/predict` which accepts POST JSON of the shape `{"data": ["<question>"]}` and returns JSON `{"data": ["<answer>"]}`.
 
 Quick local test
 ----------------
 
 1. Install requirements: `pip install -r requirements.txt`
 2. Run the app: `python app.py` (it will start on port 7860 by default)
 3. Test the predict endpoint: `python test_predict.py` (or POST directly to `http://localhost:7860/run/predict`)

Si quieres, puedo:
