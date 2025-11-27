#!/bin/sh
set -e

echo "[RAG Service] 🚀 Iniciando servicio de embeddings..."

# Verificar disponibilidad de GPU
if command -v nvidia-smi &> /dev/null; then
    echo "[RAG Service] 🎮 GPU detectada:"
    nvidia-smi --query-gpu=name,memory.total --format=csv,noheader || true
else
    echo "[RAG Service] ⚠️  nvidia-smi no disponible (ejecutando en CPU)"
fi

# Verificar si hay embeddings pre-generados
EMBED_CACHE_PATH="${RAG_EMBED_CACHE:-/app/rag_cache/embeddings.npz}"

if [ ! -f "$EMBED_CACHE_PATH" ]; then
    echo "[RAG Service] 📚 Cache de embeddings no encontrado, ejecutando ingesta..."
    python -c "
from ingest import ingest_pdfs
import os

docs_dir = 'docs'
cache_path = os.environ.get('RAG_EMBED_CACHE', '/app/rag_cache/embeddings.npz')

try:
    count = ingest_pdfs(docs_dir, cache_path)
    print(f'[RAG Service] ✅ Ingesta completada: {count} chunks')
except Exception as e:
    print(f'[RAG Service] ⚠️  Error en ingesta: {e}')
    import traceback
    traceback.print_exc()
    print('[RAG Service] Continuando sin embeddings pre-cargados...')
" || echo "[RAG Service] ⚠️  Ingesta falló, continuando..."
else
    echo "[RAG Service] ✅ Cache de embeddings encontrado en $EMBED_CACHE_PATH"
fi

# Lanzar servidor FastAPI con Uvicorn
echo "[RAG Service] 🌐 Lanzando servidor en puerto ${PORT:-8080}..."

exec uvicorn main:app \
    --host 0.0.0.0 \
    --port ${PORT:-8080} \
    --workers ${WORKERS:-1} \
    --timeout-keep-alive ${TIMEOUT_KEEP_ALIVE:-75} \
    --log-level info
