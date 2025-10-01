FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# System deps (optional, for pypdf performance)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    poppler-utils \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip && pip install -r /app/requirements.txt

COPY . /app

ENV CHROMA_DIR=/app/data \
    CHROMA_COLLECTION=docs_embeddings \
    TOP_K=5

EXPOSE 8001

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8001"]
