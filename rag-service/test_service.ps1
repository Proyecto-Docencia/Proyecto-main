# Script para probar el RAG Service desplegado en Cloud Run

$SERVICE_URL = "https://rag-service-265462853523.us-central1.run.app"

Write-Host "🧪 PROBANDO RAG SERVICE" -ForegroundColor Cyan
Write-Host "URL: $SERVICE_URL" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health Check
Write-Host "1️⃣  Test Health Check..." -ForegroundColor Green
try {
    $health = Invoke-RestMethod -Uri "$SERVICE_URL/health" -Method Get
    Write-Host "   ✅ Status: $($health.status)" -ForegroundColor Green
    Write-Host "   🎮 GPU Available: $($health.gpu_available)" -ForegroundColor $(if($health.gpu_available){"Green"}else{"Red"})
    Write-Host "   🤖 Model Loaded: $($health.model_loaded)" -ForegroundColor $(if($health.model_loaded){"Green"}else{"Red"})
    Write-Host "   📦 Embeddings Loaded: $($health.embeddings_loaded)" -ForegroundColor $(if($health.embeddings_loaded){"Green"}else{"Red"})
    Write-Host "   📝 Model: $($health.model_name)" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "   ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 2: Search
Write-Host "2️⃣  Test Search (búsqueda semántica)..." -ForegroundColor Green
try {
    $searchBody = @{
        query = "¿Qué dice sobre la evaluación por competencias?"
        top_k = 3
    } | ConvertTo-Json

    $searchResult = Invoke-RestMethod -Uri "$SERVICE_URL/search" -Method Post -Body $searchBody -ContentType "application/json"
    
    Write-Host "   ✅ Total resultados: $($searchResult.total)" -ForegroundColor Green
    Write-Host "   📄 Resultados:" -ForegroundColor Cyan
    
    foreach ($result in $searchResult.results) {
        Write-Host "      - Doc: $($result.doc) | Página: $($result.page) | Score: $([math]::Round($result.score, 3))" -ForegroundColor White
        Write-Host "        Preview: $($result.text.Substring(0, [Math]::Min(100, $result.text.Length)))..." -ForegroundColor Gray
        Write-Host ""
    }
} catch {
    Write-Host "   ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 3: Embed
Write-Host "3️⃣  Test Embed (generar embeddings)..." -ForegroundColor Green
try {
    $embedBody = @{
        texts = @("Texto de prueba para embeddings")
    } | ConvertTo-Json

    $embedResult = Invoke-RestMethod -Uri "$SERVICE_URL/embed" -Method Post -Body $embedBody -ContentType "application/json"
    
    Write-Host "   ✅ Embeddings generados" -ForegroundColor Green
    Write-Host "   📊 Dimensiones: $($embedResult.dimensions)" -ForegroundColor Cyan
    Write-Host "   🤖 Modelo: $($embedResult.model)" -ForegroundColor Cyan
    Write-Host "   📈 Primer embedding (primeros 5 valores): $($embedResult.embeddings[0][0..4] -join ', ')..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "   ❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "✅ PRUEBAS COMPLETADAS" -ForegroundColor Green
