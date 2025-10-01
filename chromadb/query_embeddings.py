import os
import sys
from pathlib import Path
from typing import List

import chromadb
from chromadb.config import Settings

CHROMA_DIR = os.environ.get("CHROMA_DIR", str(Path(__file__).parent / "data"))
COLLECTION_NAME = os.environ.get("CHROMA_COLLECTION", "docs_embeddings")
TOP_K = int(os.environ.get("TOP_K", 5))


def query(text: str, top_k: int = TOP_K) -> List[dict]:
    client = chromadb.PersistentClient(path=CHROMA_DIR, settings=Settings(allow_reset=False))
    collection = client.get_or_create_collection(name=COLLECTION_NAME, metadata={"hnsw:space": "cosine"})

    results = collection.query(query_texts=[text], n_results=top_k)
    out = []
    for i in range(len(results.get("ids", [[]])[0])):
        out.append({
            "id": results["ids"][0][i],
            "document": results["documents"][0][i],
            "distance": results["distances"][0][i] if "distances" in results else None,
            "metadata": results["metadatas"][0][i] if "metadatas" in results else None,
        })
    return out


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python query_embeddings.py \"tu pregunta\"")
        sys.exit(1)
    query_text = " ".join(sys.argv[1:])
    results = query(query_text, top_k=TOP_K)
    for r in results:
        print(f"- ({r['distance']}) {r['metadata'].get('file_name')}: {r['document'][:120]}...")
