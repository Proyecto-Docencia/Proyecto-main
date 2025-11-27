"""
Script para evaluar la calidad del sistema RAG
Analiza métricas clave de rendimiento y precisión
"""
import os
import sys
import json

# Agregar el directorio src al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from rag_proxy.retrieval import search, _CHUNKS, _MATRIX, ensure_ready
import numpy as np


def analyze_rag_system():
    """Analiza la calidad del sistema RAG"""
    
    print("=" * 80)
    print("ANÁLISIS DE CALIDAD DEL SISTEMA RAG")
    print("=" * 80)
    
    # 1. Cargar datos
    ensure_ready()
    
    # 2. Estadísticas básicas
    print("\n📊 ESTADÍSTICAS BÁSICAS:")
    print(f"   • Total de chunks indexados: {len(_CHUNKS) if _CHUNKS else 0}")
    
    if _CHUNKS:
        docs = set(chunk.doc for chunk in _CHUNKS)
        print(f"   • Documentos únicos: {len(docs)}")
        print(f"   • Documentos: {', '.join(sorted(docs))}")
        
        # Distribución por documento
        doc_counts = {}
        for chunk in _CHUNKS:
            doc_counts[chunk.doc] = doc_counts.get(chunk.doc, 0) + 1
        
        print(f"\n   📄 Distribución de chunks por documento:")
        for doc, count in sorted(doc_counts.items(), key=lambda x: -x[1]):
            print(f"      - {doc}: {count} chunks")
        
        # Longitud promedio de chunks
        avg_len = np.mean([len(chunk.text) for chunk in _CHUNKS])
        min_len = min(len(chunk.text) for chunk in _CHUNKS)
        max_len = max(len(chunk.text) for chunk in _CHUNKS)
        print(f"\n   📏 Tamaño de chunks:")
        print(f"      - Promedio: {avg_len:.0f} caracteres")
        print(f"      - Mínimo: {min_len} caracteres")
        print(f"      - Máximo: {max_len} caracteres")
    
    # 3. Calidad del modelo de embeddings
    if _MATRIX is not None:
        print(f"\n🧠 MODELO DE EMBEDDINGS:")
        print(f"   • Dimensionalidad: {_MATRIX.shape[1]}")
        print(f"   • Modelo usado: {os.environ.get('RAG_MODEL_SENTENCE', 'all-MiniLM-L6-v2')}")
        print(f"   • Tamaño de matriz: {_MATRIX.shape}")
        
        # Densidad de vectores (norma promedio)
        norms = np.linalg.norm(_MATRIX, axis=1)
        print(f"   • Norma promedio de vectores: {np.mean(norms):.4f}")
        print(f"   • Desviación estándar: {np.std(norms):.4f}")
    
    # 4. Configuración actual
    print(f"\n⚙️ CONFIGURACIÓN:")
    print(f"   • RAG_TOP_K: {os.environ.get('RAG_TOP_K', '5')}")
    print(f"   • RAG_MIN_SCORE: {os.environ.get('RAG_MIN_SCORE', '0.25')}")
    print(f"   • ENABLE_RAG: {os.environ.get('ENABLE_RAG', '0')}")
    print(f"   • RAG_BACKEND: {os.environ.get('RAG_BACKEND', 'local')}")
    
    # 5. Pruebas de calidad
    print(f"\n🔍 PRUEBAS DE RECUPERACIÓN:")
    
    test_queries = [
        "¿Qué es la alfabetización digital?",
        "¿Cuáles son las etapas del ciclo de alfabetización?",
        "¿Qué metodologías se recomiendan para la enseñanza?",
        "¿Cómo se evalúa el aprendizaje?",
        "¿Qué son los objetivos de aprendizaje?",
    ]
    
    for i, query in enumerate(test_queries, 1):
        results = search(query, top_k=3)
        print(f"\n   Query {i}: '{query}'")
        if results:
            print(f"   ✓ Resultados encontrados: {len(results)}")
            print(f"   • Mejor score: {results[0]['score']:.4f}")
            print(f"   • Score promedio: {np.mean([r['score'] for r in results]):.4f}")
            print(f"   • Documento: {results[0]['doc']}, Página {results[0]['page']}")
            print(f"   • Preview: {results[0]['text'][:150]}...")
        else:
            print(f"   ✗ Sin resultados (posible problema de umbral o cobertura)")
    
    # 6. Análisis de similaridad interna
    if _MATRIX is not None and len(_MATRIX) > 1:
        print(f"\n📈 ANÁLISIS DE DIVERSIDAD:")
        # Calcular similaridad promedio entre chunks
        similarity_matrix = _MATRIX @ _MATRIX.T
        # Excluir diagonal (similaridad consigo mismo)
        mask = ~np.eye(similarity_matrix.shape[0], dtype=bool)
        avg_similarity = np.mean(similarity_matrix[mask])
        max_similarity = np.max(similarity_matrix[mask])
        
        print(f"   • Similaridad promedio entre chunks: {avg_similarity:.4f}")
        print(f"   • Similaridad máxima entre chunks: {max_similarity:.4f}")
        
        if avg_similarity > 0.7:
            print(f"   ⚠️ ADVERTENCIA: Alta similaridad promedio (>0.7) indica contenido redundante")
        elif avg_similarity < 0.3:
            print(f"   ✓ Buena diversidad de contenido")
    
    # 7. Recomendaciones
    print(f"\n💡 RECOMENDACIONES:")
    
    issues = []
    recommendations = []
    
    if not _CHUNKS or len(_CHUNKS) == 0:
        issues.append("⛔ CRÍTICO: No hay chunks indexados")
        recommendations.append("   → Ejecutar: python src/manage.py ingest_pdfs --dir=backend/src/rag_proxy/docs")
    
    if _CHUNKS and len(_CHUNKS) < 100:
        issues.append("⚠️ Pocos chunks indexados (<100)")
        recommendations.append("   → Agregar más documentos o reducir tamaño de chunks")
    
    if _CHUNKS and avg_len < 200:
        issues.append("⚠️ Chunks muy pequeños (<200 caracteres)")
        recommendations.append("   → Aumentar max_len en chunk_text() a 800-1000")
    
    if _CHUNKS and avg_len > 1000:
        issues.append("⚠️ Chunks muy grandes (>1000 caracteres)")
        recommendations.append("   → Reducir max_len en chunk_text() a 600-800")
    
    min_score = float(os.environ.get('RAG_MIN_SCORE', '0.25'))
    if min_score > 0.4:
        issues.append("⚠️ Umbral MIN_SCORE muy alto (>0.4)")
        recommendations.append("   → Reducir RAG_MIN_SCORE a 0.25-0.30")
    
    if min_score < 0.15:
        issues.append("⚠️ Umbral MIN_SCORE muy bajo (<0.15)")
        recommendations.append("   → Aumentar RAG_MIN_SCORE a 0.20-0.25 para evitar falsos positivos")
    
    modelo = os.environ.get('RAG_MODEL_SENTENCE', 'all-MiniLM-L6-v2')
    if modelo == 'all-MiniLM-L6-v2':
        issues.append("ℹ️ Usando modelo básico all-MiniLM-L6-v2")
        recommendations.append("   → Para mejor calidad, considerar: paraphrase-multilingual-MiniLM-L12-v2")
    
    if issues:
        print("\n   Problemas detectados:")
        for issue in issues:
            print(f"   {issue}")
    
    if recommendations:
        print("\n   Acciones sugeridas:")
        for rec in recommendations:
            print(rec)
    
    if not issues:
        print("   ✅ Sistema RAG configurado correctamente")
    
    # 8. Calificación general
    print(f"\n🎯 CALIFICACIÓN GENERAL DEL RAG:")
    
    score = 0
    max_score = 100
    
    # Criterios de evaluación
    if _CHUNKS and len(_CHUNKS) >= 100:
        score += 20
        print("   ✓ Cobertura de contenido: 20/20")
    elif _CHUNKS and len(_CHUNKS) >= 50:
        score += 15
        print("   ⚠️ Cobertura de contenido: 15/20 (mejorable)")
    else:
        score += 5
        print("   ✗ Cobertura de contenido: 5/20 (insuficiente)")
    
    if _CHUNKS and 400 <= avg_len <= 800:
        score += 20
        print("   ✓ Tamaño de chunks: 20/20")
    elif _CHUNKS:
        score += 10
        print("   ⚠️ Tamaño de chunks: 10/20")
    
    if _MATRIX is not None and _MATRIX.shape[1] >= 384:
        score += 20
        print("   ✓ Calidad de embeddings: 20/20")
    elif _MATRIX is not None:
        score += 10
        print("   ⚠️ Calidad de embeddings: 10/20")
    
    if 0.2 <= min_score <= 0.35:
        score += 15
        print("   ✓ Umbral de similaridad: 15/15")
    else:
        score += 8
        print("   ⚠️ Umbral de similaridad: 8/15")
    
    # Evaluar resultados de pruebas
    test_results = [search(q, top_k=3) for q in test_queries]
    success_rate = sum(1 for r in test_results if r) / len(test_results)
    
    if success_rate >= 0.8:
        score += 25
        print(f"   ✓ Tasa de recuperación: 25/25 ({success_rate*100:.0f}%)")
    elif success_rate >= 0.6:
        score += 15
        print(f"   ⚠️ Tasa de recuperación: 15/25 ({success_rate*100:.0f}%)")
    else:
        score += 5
        print(f"   ✗ Tasa de recuperación: 5/25 ({success_rate*100:.0f}%)")
    
    print(f"\n   {'='*40}")
    print(f"   PUNTUACIÓN FINAL: {score}/{max_score}")
    
    if score >= 85:
        grade = "EXCELENTE 🌟"
    elif score >= 70:
        grade = "BUENO ✓"
    elif score >= 50:
        grade = "REGULAR ⚠️"
    else:
        grade = "NECESITA MEJORAS ✗"
    
    print(f"   CALIFICACIÓN: {grade}")
    print(f"   {'='*40}")
    
    print("\n" + "=" * 80)


if __name__ == "__main__":
    try:
        analyze_rag_system()
    except Exception as e:
        print(f"\n❌ Error durante el análisis: {e}")
        import traceback
        traceback.print_exc()
