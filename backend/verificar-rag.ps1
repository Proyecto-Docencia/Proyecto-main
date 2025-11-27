# Script para verificar el sistema RAG

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  VERIFICACIÓN DEL SISTEMA RAG" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "src\manage.py")) {
    Write-Host "❌ Error: No se encontró manage.py" -ForegroundColor Red
    Write-Host "   Asegúrate de ejecutar este script desde el directorio backend/" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔍 Verificando archivos de embeddings..." -ForegroundColor Yellow
if (Test-Path "rag_cache\embeddings.npz") {
    $fileSize = (Get-Item "rag_cache\embeddings.npz").Length / 1MB
    Write-Host "   ✅ Archivo encontrado: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  No se encontró archivo de embeddings" -ForegroundColor Yellow
    Write-Host "   Necesitas ejecutar: python src\manage.py ingest_pdfs" -ForegroundColor White
}

Write-Host ""
Write-Host "📚 Verificando PDFs disponibles..." -ForegroundColor Yellow
$pdfCount = (Get-ChildItem "src\rag_proxy\docs\*.pdf" -ErrorAction SilentlyContinue).Count
Write-Host "   PDFs encontrados: $pdfCount" -ForegroundColor $(if ($pdfCount -gt 0) { "Green" } else { "Red" })

Write-Host ""
Write-Host "🧪 Test de búsqueda RAG..." -ForegroundColor Yellow
$testScript = @"
import sys
sys.path.insert(0, 'src')
from rag_proxy.retrieval import search, ensure_ready

try:
    ensure_ready()
    results = search('aspectos éticos IA educación', top_k=3)
    if results:
        print(f'✅ RAG funcionando: {len(results)} resultados encontrados')
        for i, r in enumerate(results[:2], 1):
            print(f'   {i}. Score: {r["score"]:.3f} | {r["doc"]} p.{r["page"]}')
    else:
        print('⚠️  RAG funcionando pero sin resultados (necesita indexar PDFs)')
except Exception as e:
    print(f'❌ Error: {e}')
"@

python -c $testScript

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  COMANDOS ÚTILES" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Indexar PDFs (primera vez o después de agregar nuevos):" -ForegroundColor White
Write-Host "  python src\manage.py ingest_pdfs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Verificar configuración RAG:" -ForegroundColor White
Write-Host "  python -c `"import os; print('Modelo:', os.getenv('RAG_MODEL_SENTENCE', 'all-MiniLM-L6-v2'))`"" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ver logs del servidor:" -ForegroundColor White
Write-Host "  docker-compose logs -f backend" -ForegroundColor Cyan
