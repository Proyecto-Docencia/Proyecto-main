ChromaDB (embeddings locales)

Estructura:
- ingest_docs.py: procesa PDFs a chunks y genera embeddings en un almacén persistente (chroma)
- query_embeddings.py: consulta por similitud y devuelve contexto relevante
- requirements.txt: dependencias para un venv aislado
- run-chromadb.ps1: helper en Windows para crear venv, instalar deps e ingerir/consultar
 - api.py: microservicio FastAPI para ingestión/consulta vía HTTP
 - Dockerfile: contenedor del microservicio

Uso rápido (Windows PowerShell):
1) cd ./chromadb
2) .\run-chromadb.ps1 -PdfsDir .\pdfs        # ingesta de PDFs
3) .\run-chromadb.ps1 -Query -Q "tu pregunta"  # consulta

API en Docker Compose:
- Servicio: chroma_api
- Puerto host: 8083 → contenedor: 8001
- Endpoints: 
	- POST /api/ingest/pdf (multipart file)
	- POST /api/query { text, top_k }

Variables de entorno opcionales:
- CHROMA_DIR: ruta del almacén (default: ./chromadb/data)
- CHROMA_COLLECTION: nombre de colección (default: docs_embeddings)
- CHUNK_SIZE / CHUNK_OVERLAP: tamaño y solapamiento de chunks
- TOP_K: resultados a recuperar en query (default: 5)

Notas:
- Este módulo es independiente del backend Django. No expone API HTTP (por ahora).
- La carpeta data/ y .venv/ están ignoradas en git por seguridad/tamaño.
