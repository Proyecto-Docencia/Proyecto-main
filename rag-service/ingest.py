"""Ingest utilities para procesar PDFs y generar embeddings.

Proporciona funciones para: leer PDFs, chunkear y generar embeddings,
guardando un cache en `EMBED_CACHE_PATH`.
"""
from __future__ import annotations
import os
from typing import List, Dict, Any
from pathlib import Path

try:
    import numpy as np  # type: ignore
except ImportError:  # pragma: no cover
    np = None  # type: ignore

try:
    from pypdf import PdfReader  # type: ignore
except ImportError:  # pragma: no cover
    PdfReader = None  # type: ignore

from retrieval import embed_texts, EMBED_CACHE_PATH, ChunkMeta


def chunk_text(text: str, max_len: int = 500, overlap: int = 100):
    """Divide texto en chunks con overlap.
    
    Optimizado para mejor precisión:
    - max_len=500: Chunks más pequeños = mayor precisión semántica
    - overlap=100: Mantiene contexto entre chunks
    """
    text = text.replace('\r', '')
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    chunks: List[str] = []
    for para in paragraphs:
        if len(para) <= max_len:
            chunks.append(para)
        else:
            start = 0
            while start < len(para):
                end = start + max_len
                part = para[start:end]
                chunks.append(part)
                if end >= len(para):
                    break
                start = end - overlap
    return chunks


def ingest_documents(docs: List[Dict[str, Any]]):  # pragma: no cover
    """Ingesta documentos y genera embeddings.
    
    Args:
        docs: Lista de {'doc': nombre, 'page': página, 'text': contenido}
        
    Returns:
        Número de documentos procesados
    """
    if np is None:
        raise RuntimeError("numpy no disponible para ingest")
    
    print(f"[Ingest] 📊 Generando embeddings para {len(docs)} chunks...")
    embeddings = embed_texts([d['text'] for d in docs])
    
    if embeddings is None:
        raise RuntimeError("Error generando embeddings")
    
    meta_serializable = []
    for idx, d in enumerate(docs):
        meta_serializable.append({
            'doc': d['doc'],
            'page': d['page'],
            'text': d['text'],
            'vector_index': idx,
        })
    
    os.makedirs(os.path.dirname(EMBED_CACHE_PATH), exist_ok=True)
    np.savez_compressed(EMBED_CACHE_PATH, embeddings=embeddings, meta=meta_serializable)
    print(f"[Ingest] ✅ Cache guardado en {EMBED_CACHE_PATH}")
    return len(docs)


def ingest_pdfs(docs_dir: str, cache_path: str = None):  # pragma: no cover
    """Procesa todos los PDFs de un directorio y genera embeddings.
    
    Args:
        docs_dir: Directorio con archivos PDF
        cache_path: Ruta del archivo de cache (opcional)
    """
    if PdfReader is None:
        raise RuntimeError("pypdf no instalado")
    
    if cache_path:
        global EMBED_CACHE_PATH
        EMBED_CACHE_PATH = cache_path
    
    docs_path = Path(docs_dir)
    if not docs_path.exists():
        raise FileNotFoundError(f"Directorio no encontrado: {docs_dir}")
    
    pdf_files = list(docs_path.glob("*.pdf"))
    if not pdf_files:
        raise FileNotFoundError(f"No se encontraron archivos PDF en {docs_dir}")
    
    print(f"[Ingest] 📚 Encontrados {len(pdf_files)} archivos PDF")
    
    all_chunks = []
    for pdf_path in sorted(pdf_files):
        try:
            print(f"[Ingest] 📄 Procesando {pdf_path.name}...")
            reader = PdfReader(str(pdf_path))
            
            for page_num, page in enumerate(reader.pages, start=1):
                text = page.extract_text() or ""
                if not text.strip():
                    continue
                
                chunks = chunk_text(text)
                for chunk in chunks:
                    if len(chunk.strip()) < 50:  # Filtrar chunks muy cortos
                        continue
                    all_chunks.append({
                        'doc': pdf_path.stem,  # Nombre sin extensión
                        'page': page_num,
                        'text': chunk.strip()
                    })
            
            print(f"[Ingest]   ✓ {len([c for c in all_chunks if c['doc'] == pdf_path.stem])} chunks de {len(reader.pages)} páginas")
        
        except Exception as e:
            print(f"[Ingest]   ✗ Error procesando {pdf_path.name}: {e}")
            continue
    
    if not all_chunks:
        raise RuntimeError("No se generaron chunks válidos de los PDFs")
    
    print(f"[Ingest] 📊 Total de chunks generados: {len(all_chunks)}")
    return ingest_documents(all_chunks)
