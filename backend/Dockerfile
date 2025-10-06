# Imagen para backend Django
FROM python:3.11-slim

ARG ENABLE_RAG=0
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    ENABLE_RAG=${ENABLE_RAG}

WORKDIR /app

# Dependencias de sistema (mysqlclient)
RUN apt-get update && apt-get install -y \
        build-essential default-libmysqlclient-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Instalar sólo dependencias core
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Instalar dependencias RAG sólo si se habilita en build
COPY requirements-rag.txt ./
RUN if [ "$ENABLE_RAG" = "1" ]; then \
      echo "[BUILD] Instalando dependencias RAG" && \
      pip install --no-cache-dir -r requirements-rag.txt ; \
    else \
      echo "[BUILD] RAG deshabilitado (no se instalan dependencias pesadas)" ; \
    fi

COPY src ./src
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

WORKDIR /app/src
EXPOSE 8000
ENTRYPOINT ["/entrypoint.sh"]
