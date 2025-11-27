#!/usr/bin/env python3
"""
Script de prueba para verificar que el modelo gte-Qwen2-7B funciona correctamente.
"""
import os
os.environ["RAG_USE_GPU"] = "0"  # Forzar CPU para pruebas locales

def test_model_loading():
    """Prueba carga del modelo."""
    print("=" * 60)
    print("TEST 1: Carga del modelo")
    print("=" * 60)
    
    try:
        from sentence_transformers import SentenceTransformer
        print("✅ sentence-transformers importado correctamente")
        
        model_name = "Alibaba-NLP/gte-Qwen2-7B-instruct"
        print(f"📦 Cargando modelo: {model_name}")
        
        model = SentenceTransformer(
            model_name,
            device="cpu",
            trust_remote_code=True
        )
        print(f"✅ Modelo cargado: {model}")
        print(f"📊 Dimensiones: {model.get_sentence_embedding_dimension()}")
        print(f"📏 Max sequence length: {model.max_seq_length}")
        
        return model
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

def test_embeddings(model):
    """Prueba generación de embeddings."""
    print("\n" + "=" * 60)
    print("TEST 2: Generación de embeddings")
    print("=" * 60)
    
    if model is None:
        print("❌ Modelo no disponible")
        return
    
    try:
        test_texts = [
            "¿Qué es la evaluación por competencias?",
            "Estrategias de enseñanza efectivas"
        ]
        
        print(f"🔄 Generando embeddings para {len(test_texts)} textos...")
        embeddings = model.encode(
            test_texts,
            normalize_embeddings=True,
            show_progress_bar=True
        )
        
        print(f"✅ Embeddings generados: {embeddings.shape}")
        print(f"📊 Norma primer embedding: {(embeddings[0] ** 2).sum() ** 0.5:.4f}")
        
        # Calcular similitud
        similarity = (embeddings[0] @ embeddings[1].T)
        print(f"🔗 Similitud entre textos: {similarity:.4f}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

def test_retrieval_module():
    """Prueba el módulo retrieval."""
    print("\n" + "=" * 60)
    print("TEST 3: Módulo retrieval")
    print("=" * 60)
    
    try:
        import retrieval
        print("✅ Módulo retrieval importado")
        
        print(f"📦 Modelo configurado: {retrieval.DEFAULT_MODEL}")
        print(f"🎮 GPU habilitada: {retrieval.USE_GPU}")
        print(f"📁 Cache path: {retrieval.EMBED_CACHE_PATH}")
        print(f"🔢 TOP_K: {retrieval.TOP_K_DEFAULT}")
        print(f"📊 MIN_SCORE: {retrieval.MIN_SCORE}")
        
        # Intentar cargar modelo
        print("\n🔄 Cargando modelo a través de retrieval...")
        model = retrieval._lazy_load_model()
        
        if model:
            print("✅ Modelo cargado correctamente")
            
            # Probar embed_texts
            print("\n🔄 Probando embed_texts...")
            test_texts = ["Texto de prueba"]
            embeddings = retrieval.embed_texts(test_texts)
            
            if embeddings is not None:
                print(f"✅ Embeddings generados: {embeddings.shape}")
            else:
                print("❌ Error generando embeddings")
        else:
            print("❌ No se pudo cargar el modelo")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

def test_ingest_module():
    """Prueba el módulo ingest."""
    print("\n" + "=" * 60)
    print("TEST 4: Módulo ingest")
    print("=" * 60)
    
    try:
        import ingest
        print("✅ Módulo ingest importado")
        
        # Probar chunking
        test_text = "Este es un párrafo de prueba.\n\nEste es otro párrafo.\n\nY este es un tercer párrafo muy largo que debería ser dividido en múltiples chunks porque excede la longitud máxima permitida por el sistema de chunking, lo cual es importante para procesar documentos grandes de manera eficiente."
        
        chunks = ingest.chunk_text(test_text, max_len=100, overlap=20)
        print(f"✅ Chunks generados: {len(chunks)}")
        for i, chunk in enumerate(chunks, 1):
            print(f"  Chunk {i}: {len(chunk)} caracteres")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🧪 Iniciando pruebas del RAG Service\n")
    
    # Test 1: Cargar modelo directamente
    model = test_model_loading()
    
    # Test 2: Generar embeddings
    if model:
        test_embeddings(model)
    
    # Test 3: Módulo retrieval
    test_retrieval_module()
    
    # Test 4: Módulo ingest
    test_ingest_module()
    
    print("\n" + "=" * 60)
    print("✅ Pruebas completadas")
    print("=" * 60)
