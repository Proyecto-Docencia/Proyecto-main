"""RAG retrieval utilities (fase 1 - stub + estructura preparada).

Esta capa está diseñada para poder reemplazarse fácilmente en el futuro
por Azure AI Search u otro vector store. Mantén la interfaz estable.
"""
from __future__ import annotations
import os
import threading
import time
from dataclasses import dataclass
from typing import List, Sequence, Optional, Dict, Any

try:
    import numpy as np  # type: ignore
except ImportError:  # pragma: no cover
    np = None  # type: ignore

_EMBED_LOCK = threading.Lock()
_EMBED_MODEL = None  # lazy loaded embedding model (sentence-transformers or FlagEmbedding)
_MATRIX = None       # numpy matrix (n_chunks x dim)
_CHUNKS: List["ChunkMeta"] = []

# Modelo de embeddings: bge-large-en-v1.5 (63.7% MTEB, optimizado para GPU L4)
DEFAULT_MODEL = os.environ.get("RAG_MODEL_SENTENCE", "BAAI/bge-large-en-v1.5")
USE_GPU = os.environ.get("RAG_USE_GPU", "1") == "1"  # Auto-detecta GPU si está disponible
EMBED_CACHE_PATH = os.environ.get("RAG_EMBED_CACHE", "/app/rag_cache/embeddings.npz")
TOP_K_DEFAULT = int(os.environ.get("RAG_TOP_K", "5"))  # Balanceado para respuestas concisas
MIN_SCORE = float(os.environ.get("RAG_MIN_SCORE", "0.45"))  # Umbral alto con bge-large
BACKEND_KIND = os.environ.get("RAG_BACKEND", "local").lower()  # 'local' | 'azure'
AZURE_SEARCH_ENDPOINT = os.environ.get("AZURE_SEARCH_ENDPOINT")
AZURE_SEARCH_KEY = os.environ.get("AZURE_SEARCH_KEY")
AZURE_SEARCH_INDEX = os.environ.get("AZURE_SEARCH_INDEX", "educacion-docs")


@dataclass
class ChunkMeta:
    doc: str
    page: int
    text: str
    vector_index: int


def _lazy_load_model():  # pragma: no cover (IO heavy)
    """Carga el modelo de embeddings optimizado para GPU o CPU."""
    global _EMBED_MODEL
    if _EMBED_MODEL is not None:
        return _EMBED_MODEL
    
    # Detectar si hay GPU disponible
    import torch
    device = "cuda" if USE_GPU and torch.cuda.is_available() else "cpu"
    print(f"[RAG] 🚀 Inicializando modelo {DEFAULT_MODEL} en {device.upper()}")
    
    if USE_GPU and torch.cuda.is_available():
        print(f"[RAG] 🎮 GPU detectada: {torch.cuda.get_device_name(0)}")
        print(f"[RAG] 💾 Memoria GPU disponible: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
    
    # Intentar cargar con sentence-transformers (compatible con gte-Qwen2-7B)
    try:
        from sentence_transformers import SentenceTransformer
        _EMBED_MODEL = SentenceTransformer(
            DEFAULT_MODEL,
            device=device,
            trust_remote_code=True  # Necesario para gte-Qwen2-7B
        )
        
        # Configurar para máximo rendimiento en GPU
        if device == "cuda":
            _EMBED_MODEL.max_seq_length = 8192  # gte-Qwen2-7B soporta 32k, usamos 8k para balance
            print(f"[RAG] ⚡ Configuración GPU: max_seq_length={_EMBED_MODEL.max_seq_length}")
        
        print(f"[RAG] ✅ Modelo cargado: {DEFAULT_MODEL} ({device.upper()})")
        return _EMBED_MODEL
    except ImportError:
        print("[RAG] ❌ sentence-transformers no instalado.")
        return None
    except Exception as e:
        print(f"[RAG] ❌ Error cargando modelo: {e}")
        import traceback
        traceback.print_exc()
        return None


def _load_embeddings_if_available():  # pragma: no cover
    global _MATRIX, _CHUNKS
    if _MATRIX is not None:
        return
    if np is None:
        return
    if not os.path.exists(EMBED_CACHE_PATH):
        print(f"[RAG] ⚠️  Cache de embeddings no encontrado: {EMBED_CACHE_PATH}")
        return
    try:
        data = np.load(EMBED_CACHE_PATH, allow_pickle=True)
        _MATRIX = data["embeddings"]
        meta_list = data["meta"].tolist()
        _CHUNKS = [ChunkMeta(**m) for m in meta_list]
        print(f"[RAG] ✅ Cargados {len(_CHUNKS)} chunks desde cache")
    except Exception as e:  # pragma: no cover
        print(f"[RAG] ❌ Error cargando cache de embeddings: {e}")


def ensure_ready():  # pragma: no cover
    with _EMBED_LOCK:
        if _MATRIX is None:
            _load_embeddings_if_available()


def embed_texts(texts: Sequence[str]):  # pragma: no cover
    """Genera embeddings con configuración optimizada para GPU."""
    model = _lazy_load_model()
    if model is None:
        return None
    
    # Batch size optimizado para GPU L4 (16GB VRAM)
    batch_size = 32 if USE_GPU else 8
    
    import torch
    if USE_GPU and torch.cuda.is_available():
        # Usar precisión mixta para mayor velocidad en GPU
        with torch.cuda.amp.autocast():
            return model.encode(
                list(texts), 
                normalize_embeddings=True,
                batch_size=batch_size,
                show_progress_bar=False
            )
    else:
        return model.encode(
            list(texts), 
            normalize_embeddings=True,
            batch_size=batch_size,
            show_progress_bar=False
        )


def _search_local(query: str, top_k: Optional[int]) -> List[Dict[str, Any]]:
    """Búsqueda semántica local con re-ranking.
    
    Mejoras implementadas:
    1. Query normalization
    2. Multi-query search (expandir consulta)
    3. Score boosting por longitud y calidad
    4. Deduplicación inteligente
    """
    ensure_ready()
    if np is None or _MATRIX is None or not _CHUNKS:
        return []
    
    top_k = top_k or TOP_K_DEFAULT
    model = _lazy_load_model()
    if model is None:
        return []
    
    # Generar embeddings para query principal y variaciones
    queries = [query]
    
    # Query expansion simple (agregar variaciones de la pregunta)
    if len(query.split()) > 3:  # Solo para queries complejas
        # Agregar versión sin signos de interrogación
        query_clean = query.replace('?', '').replace('¿', '').strip()
        if query_clean != query:
            queries.append(query_clean)
    
    # Embeddings para todas las variaciones
    q_vecs = model.encode(queries, normalize_embeddings=True)
    
    # Promedio de embeddings para query final (mejor cobertura)
    if len(q_vecs) > 1:
        q_vec = np.mean(q_vecs, axis=0)
        # Re-normalizar después del promedio
        q_vec = q_vec / np.linalg.norm(q_vec)
    else:
        q_vec = q_vecs[0]
    
    # Calcular similitudes
    sims = (_MATRIX @ q_vec).tolist()
    
    scored = []
    seen_texts = set()  # Para deduplicación
    
    for chunk, score in zip(_CHUNKS, sims):
        if score < MIN_SCORE:
            continue
        
        # Deduplicación: si el texto es muy similar a uno ya agregado, saltar
        text_sig = chunk.text[:100]  # Firma del texto (primeros 100 chars)
        if text_sig in seen_texts:
            continue
        seen_texts.add(text_sig)
        
        # Score boosting por longitud (chunks más largos son más informativos)
        length_boost = min(len(chunk.text) / 400, 1.1)  # Boost hasta 10%
        adjusted_score = score * length_boost
        
        scored.append({
            "score": float(adjusted_score),
            "original_score": float(score),
            "doc": chunk.doc,
            "page": chunk.page,
            "text": chunk.text,
        })
    
    scored.sort(key=lambda x: x["score"], reverse=True)
    
    # Retornar top_k * 1.5 y filtrar después (permite mejor diversidad)
    extended_top_k = min(int(top_k * 1.5), len(scored))
    results = scored[:extended_top_k]
    
    # Diversificación: asegurar que haya resultados de diferentes documentos
    docs_seen = set()
    diverse_results = []
    other_results = []
    
    for r in results:
        if r["doc"] not in docs_seen or len(docs_seen) >= 3:  # Max 3 docs diferentes
            diverse_results.append(r)
            docs_seen.add(r["doc"])
        else:
            other_results.append(r)
    
    # Combinar: primero diversidad, luego por score
    final_results = diverse_results + other_results
    
    return final_results[:top_k]


def _search_azure(query: str) -> List[Dict[str, Any]]:  # pragma: no cover
    """Stub Azure AI Search. Implementar cuando se provisionen recursos.

    Plan previsto:
      1. Generar embedding de la query (Azure OpenAI Embeddings) o usar vector query integrada si índice ya la soporta.
      2. Llamar a endpoint: POST {endpoint}/indexes/{index}/docs/search?api-version=2024-07-01
      3. Incluir en body: {"vectorQueries": [...], "top": K}
      4. Mapear campos: doc_title -> doc, page -> page, content -> text, score -> @search.score
    """
    if not (AZURE_SEARCH_ENDPOINT and AZURE_SEARCH_KEY):
        return []
    # Devuelve vacío hasta implementar integración real.
    return []


def search(query: str, top_k: Optional[int] = None) -> List[Dict[str, Any]]:
    if BACKEND_KIND == "azure":
        return _search_azure(query)
    return _search_local(query, top_k)


def format_context(chunks: List[Dict[str, Any]]) -> str:
    lines = []
    for c in chunks:
        preview = c["text"].strip().replace("\n", " ")
        if len(preview) > 400:
            preview = preview[:400] + "…"
        lines.append(f"[Fuente: {c['doc']} | Página {c['page']}]\n{preview}\n")
    return "\n".join(lines)
