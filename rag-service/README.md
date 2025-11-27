# RAG Service

Servicio independiente de embeddings y búsqueda vectorial para el sistema de planificación docente USS.

## 🎯 Propósito

Separar la funcionalidad RAG del backend Django principal para:
- ✅ Despliegues rápidos del backend (~3-5 min vs 1 hora)
- ✅ Escalado independiente con GPU
- ✅ Cache persistente de embeddings
- ✅ Menor acoplamiento

## 🏗️ Arquitectura

```
Frontend → Backend Django → RAG Service (este)
                          ↓
                     Cloud SQL
```

## 🚀 Endpoints

### `GET /health`
Health check del servicio
```json
{
  "status": "healthy",
  "gpu_available": true,
  "model_loaded": true,
  "embeddings_loaded": true,
  "model_name": "Alibaba-NLP/gte-Qwen2-7B-instruct"
}
```

### `POST /search`
Búsqueda semántica en documentos
```json
// Request
{
  "query": "¿Qué es la evaluación por competencias?",
  "top_k": 5
}

// Response
{
  "results": [
    {
      "doc": "Capitulo2.pdf",
      "page": 15,
      "text": "La evaluación por competencias...",
      "score": 0.87
    }
  ],
  "total": 5,
  "query": "¿Qué es la evaluación por competencias?"
}
```

### `POST /embed`
Generar embeddings para textos
```json
// Request
{
  "texts": ["texto 1", "texto 2"]
}

// Response
{
  "embeddings": [[0.1, 0.2, ...], [0.3, 0.4, ...]],
  "dimensions": 3584,
  "model": "Alibaba-NLP/gte-Qwen2-7B-instruct"
}
```

## 📦 Despliegue

```bash
cd rag-service
gcloud builds submit --config cloudbuild.yaml .
```

## 🔧 Configuración

Variables de entorno:
- `RAG_USE_GPU`: '1' para habilitar GPU
- `RAG_MODEL_SENTENCE`: Modelo de embeddings (default: gte-Qwen2-7B-instruct)
- `RAG_TOP_K`: Número de resultados (default: 5)
- `RAG_MIN_SCORE`: Score mínimo (default: 0.45)
- `RAG_EMBED_CACHE`: Path al cache de embeddings

## 📊 Recursos

- **CPU**: 8 cores
- **RAM**: 32Gi
- **GPU**: 1x NVIDIA L4 (16GB VRAM)
- **Workers**: 1-2 (GPU no escala bien con muchos workers)

## 📚 Documentos

Los PDFs se copian durante el build en `/app/docs/`:
- Capitulo2.pdf
- Capitulo3.pdf
- Cápitulo4.pdf
- Capítulo5.pdf
- Capitulo6.pdf
- alfabetizacion_digital.pdf (si existe)
