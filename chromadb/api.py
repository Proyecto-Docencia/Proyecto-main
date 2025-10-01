import os
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import chromadb
from chromadb.config import Settings
from pydantic import BaseModel

from ingest_docs import extract_text_from_pdf, chunk_text, CHUNK_SIZE, CHUNK_OVERLAP

CHROMA_DIR = os.environ.get("CHROMA_DIR", str(Path(__file__).parent / "data"))
COLLECTION_NAME = os.environ.get("CHROMA_COLLECTION", "docs_embeddings")
TOP_K = int(os.environ.get("TOP_K", 5))

app = FastAPI(title="ChromaDB Embeddings API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = chromadb.PersistentClient(path=CHROMA_DIR, settings=Settings(allow_reset=False))
collection = client.get_or_create_collection(name=COLLECTION_NAME, metadata={"hnsw:space": "cosine"})


class QueryRequest(BaseModel):
    text: str
    top_k: Optional[int] = None


@app.post("/api/ingest/pdf")
async def ingest_pdf(file: UploadFile = File(...)):
    content = await file.read()
    tmp = Path("/tmp") / file.filename
    tmp.write_bytes(content)

    full_text = extract_text_from_pdf(tmp)
    chunks = chunk_text(full_text, CHUNK_SIZE, CHUNK_OVERLAP)

    ids = []
    documents = []
    metadatas = []
    for i, chunk in enumerate(chunks):
        ids.append(f"{file.filename}_{i}")
        documents.append(chunk)
        metadatas.append({"source": file.filename, "chunk": i})

    if ids:
        collection.add(ids=ids, documents=documents, metadatas=metadatas)

    try:
        tmp.unlink(missing_ok=True)
    except Exception:
        pass

    return {"ok": True, "added": len(ids)}


@app.post("/api/query")
async def query(req: QueryRequest):
    k = req.top_k or TOP_K
    results = collection.query(query_texts=[req.text], n_results=k)
    out = []
    count = len(results.get("ids", [[]])[0]) if results.get("ids") else 0
    for i in range(count):
        out.append({
            "id": results["ids"][0][i],
            "document": results["documents"][0][i],
            "distance": results.get("distances", [[None]])[0][i],
            "metadata": results.get("metadatas", [[None]])[0][i],
        })
    return {"results": out}


@app.get("/health")
async def health():
    return {"status": "ok", "collection": COLLECTION_NAME}
