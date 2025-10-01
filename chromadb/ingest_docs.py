import os
import sys
from pathlib import Path

import chromadb
from chromadb.config import Settings
from pypdf import PdfReader
from tqdm import tqdm

# --- Config ---
CHROMA_DIR = os.environ.get("CHROMA_DIR", str(Path(__file__).parent / "data"))
COLLECTION_NAME = os.environ.get("CHROMA_COLLECTION", "docs_embeddings")
CHUNK_SIZE = int(os.environ.get("CHUNK_SIZE", 800))
CHUNK_OVERLAP = int(os.environ.get("CHUNK_OVERLAP", 120))


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP):
    text = " ".join(text.split())
    chunks = []
    start = 0
    n = len(text)
    while start < n:
        end = min(start + chunk_size, n)
        chunks.append(text[start:end])
        start = end - overlap if end - overlap > start else end
    return chunks


def extract_text_from_pdf(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    text = []
    for page in reader.pages:
        try:
            text.append(page.extract_text() or "")
        except Exception:
            pass
    return "\n".join(text)


def main(input_dir: str):
    input_path = Path(input_dir)
    if not input_path.exists():
        print(f"Directorio no existe: {input_dir}")
        sys.exit(1)

    os.makedirs(CHROMA_DIR, exist_ok=True)

    client = chromadb.PersistentClient(path=CHROMA_DIR, settings=Settings(allow_reset=False))
    collection = client.get_or_create_collection(name=COLLECTION_NAME, metadata={"hnsw:space": "cosine"})

    pdf_files = list(input_path.glob("**/*.pdf"))
    if not pdf_files:
        print("No se encontraron PDFs en el directorio.")
        return

    doc_id_counter = 0

    for pdf in tqdm(pdf_files, desc="Procesando PDFs"):
        try:
            full_text = extract_text_from_pdf(pdf)
            if not full_text.strip():
                continue
            chunks = chunk_text(full_text)
            if not chunks:
                continue

            ids = []
            documents = []
            metadatas = []
            for i, chunk in enumerate(chunks):
                doc_id_counter += 1
                ids.append(f"doc_{doc_id_counter}")
                documents.append(chunk)
                metadatas.append({
                    "source": str(pdf),
                    "chunk": i,
                    "file_name": pdf.name,
                })

            collection.add(ids=ids, documents=documents, metadatas=metadatas)
        except Exception as e:
            print(f"Error procesando {pdf}: {e}")

    print(f"Ingesta completada. Colección: {COLLECTION_NAME} en {CHROMA_DIR}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python ingest_docs.py <directorio_pdfs>")
        sys.exit(1)
    main(sys.argv[1])
