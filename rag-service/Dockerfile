# Imagen base Python optimizada para GPU
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080 \
    RAG_USE_GPU=1

WORKDIR /app

# Dependencias de sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    wget curl git \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias Python
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Pre-descargar modelo bge-large-en-v1.5 para evitar cold starts (63.7% MTEB)
RUN echo "[BUILD] Pre-descargando modelo bge-large-en-v1.5 (3.5GB, 63.7% MTEB)..." && \
    python -c "from sentence_transformers import SentenceTransformer; \
               SentenceTransformer('BAAI/bge-large-en-v1.5', trust_remote_code=True)" && \
    echo "[BUILD] ✅ Modelo descargado exitosamente"

# Copiar código de la aplicación
COPY main.py ./
COPY retrieval.py ./
COPY ingest.py ./
COPY entrypoint.sh /entrypoint.sh

# Copiar PDFs (6 documentos)
COPY docs/ ./docs/

# Crear directorio para cache de embeddings
RUN mkdir -p /app/rag_cache

# Permisos de ejecución
RUN chmod +x /entrypoint.sh

EXPOSE $PORT

ENTRYPOINT ["/entrypoint.sh"]
