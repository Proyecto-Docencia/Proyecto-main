# Imagen para backend Django
FROM python:3.11-slim

ARG INSTALL_RAG_DEPS=0
ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1 \
  PORT=8080

WORKDIR /app

# Dependencias de sistema (mysqlclient)
RUN apt-get update && apt-get install -y \
    build-essential default-libmysqlclient-dev pkg-config \
    wget curl git \
  && rm -rf /var/lib/apt/lists/*

# Instalar sólo dependencias core
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Instalar dependencias RAG sólo si se habilita en build (NO recomendado, usar RAG Service externo)
COPY requirements-rag.txt ./
RUN if [ "$INSTALL_RAG_DEPS" = "1" ]; then \
      echo "[BUILD] Instalando dependencias RAG (NO RECOMENDADO - usar RAG Service externo)" && \
      pip install --no-cache-dir -r requirements-rag.txt && \
      echo "[BUILD] Pre-descargando modelo de embeddings gte-Qwen2-7B..." && \
      python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('Alibaba-NLP/gte-Qwen2-7B-instruct', trust_remote_code=True)" ; \
    else \
      echo "[BUILD] ✅ RAG deshabilitado - Backend consumirá RAG Service externo por HTTP" ; \
    fi

COPY src ./src
COPY public ./public
COPY entrypoint.sh /entrypoint.sh
COPY wait_for_db.sh /app/wait_for_db.sh
RUN sed -i 's/\r$//' /entrypoint.sh /app/wait_for_db.sh \
  && chmod +x /entrypoint.sh /app/wait_for_db.sh || true

WORKDIR /app/src
EXPOSE $PORT
ENTRYPOINT ["/entrypoint.sh"]
