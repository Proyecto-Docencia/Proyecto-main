"""
RAG Service - Servicio de embeddings y búsqueda vectorial
FastAPI app optimizada para GPU (NVIDIA L4)
"""
import os
import logging
from typing import List, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import retrieval  # Nuestro módulo de embeddings

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Lifespan para cargar modelo al inicio
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Carga el modelo de embeddings al iniciar el servicio."""
    logger.info("🚀 Iniciando RAG Service...")
    
    # Pre-cargar modelo y embeddings
    try:
        retrieval.ensure_ready()
        logger.info("✅ Modelo y embeddings cargados correctamente")
    except Exception as e:
        logger.error(f"❌ Error cargando modelo: {e}")
    
    yield
    
    logger.info("🛑 Apagando RAG Service...")

# Crear app FastAPI
app = FastAPI(
    title="RAG Service",
    description="Servicio de embeddings y búsqueda vectorial para documentos educativos",
    version="1.0.0",
    lifespan=lifespan
)

# CORS para permitir llamadas desde Backend Django
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción: restringir a backend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============= MODELOS PYDANTIC =============

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000, description="Consulta del usuario")
    top_k: Optional[int] = Field(5, ge=1, le=20, description="Número de resultados a retornar")

class SearchResult(BaseModel):
    doc: str = Field(..., description="Nombre del documento")
    page: int = Field(..., description="Número de página")
    text: str = Field(..., description="Fragmento de texto relevante")
    score: float = Field(..., ge=0, le=1, description="Score de similitud")

class SearchResponse(BaseModel):
    results: List[SearchResult] = Field(default_factory=list)
    total: int = Field(..., description="Número total de resultados")
    query: str = Field(..., description="Query original")

class EmbedRequest(BaseModel):
    texts: List[str] = Field(..., min_items=1, max_items=100, description="Textos a embedear")

class EmbedResponse(BaseModel):
    embeddings: List[List[float]] = Field(..., description="Vectores de embeddings")
    dimensions: int = Field(..., description="Dimensiones del vector")
    model: str = Field(..., description="Modelo utilizado")

class HealthResponse(BaseModel):
    status: str
    gpu_available: bool
    model_loaded: bool
    embeddings_loaded: bool
    model_name: str

# ============= ENDPOINTS =============

@app.get("/", response_model=dict)
async def root():
    """Endpoint raíz con información del servicio."""
    return {
        "service": "RAG Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "search": "/search",
            "embed": "/embed"
        }
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check para verificar estado del servicio."""
    try:
        import torch
        gpu_available = torch.cuda.is_available()
        gpu_name = torch.cuda.get_device_name(0) if gpu_available else "N/A"
    except:
        gpu_available = False
        gpu_name = "N/A"
    
    # Verificar si el modelo está cargado
    model_loaded = retrieval._EMBED_MODEL is not None
    embeddings_loaded = retrieval._MATRIX is not None
    
    return HealthResponse(
        status="healthy" if model_loaded else "degraded",
        gpu_available=gpu_available,
        model_loaded=model_loaded,
        embeddings_loaded=embeddings_loaded,
        model_name=retrieval.DEFAULT_MODEL
    )

@app.post("/search", response_model=SearchResponse)
async def search_documents(request: SearchRequest):
    """
    Busca documentos relevantes usando búsqueda vectorial.
    
    Args:
        request: Query y parámetros de búsqueda
        
    Returns:
        Resultados ordenados por relevancia
    """
    try:
        logger.info(f"🔍 Búsqueda: '{request.query[:100]}...' (top_k={request.top_k})")
        
        # Realizar búsqueda
        results = retrieval.search(request.query, top_k=request.top_k)
        
        # Convertir a formato de respuesta
        search_results = [
            SearchResult(
                doc=r["doc"],
                page=r["page"],
                text=r["text"],
                score=r["score"]
            )
            for r in results
        ]
        
        logger.info(f"✅ Encontrados {len(search_results)} resultados")
        
        return SearchResponse(
            results=search_results,
            total=len(search_results),
            query=request.query
        )
        
    except Exception as e:
        logger.error(f"❌ Error en búsqueda: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error en búsqueda: {str(e)}")

@app.post("/embed", response_model=EmbedResponse)
async def generate_embeddings(request: EmbedRequest):
    """
    Genera embeddings para una lista de textos.
    
    Args:
        request: Lista de textos a procesar
        
    Returns:
        Vectores de embeddings normalizados
    """
    try:
        logger.info(f"📊 Generando embeddings para {len(request.texts)} textos")
        
        # Generar embeddings
        embeddings = retrieval.embed_texts(request.texts)
        
        if embeddings is None:
            raise HTTPException(status_code=500, detail="Modelo no disponible")
        
        # Convertir a lista de Python
        embeddings_list = embeddings.tolist()
        dimensions = len(embeddings_list[0]) if embeddings_list else 0
        
        logger.info(f"✅ Embeddings generados: {len(embeddings_list)} x {dimensions}D")
        
        return EmbedResponse(
            embeddings=embeddings_list,
            dimensions=dimensions,
            model=retrieval.DEFAULT_MODEL
        )
        
    except Exception as e:
        logger.error(f"❌ Error generando embeddings: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error generando embeddings: {str(e)}")

# ============= MAIN =============

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.environ.get("PORT", 8080))
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        log_level="info",
        access_log=True
    )
