# Script para aplicar migraciones de Django
# Ejecutar este script cuando el contenedor de base de datos esté corriendo

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  APLICANDO MIGRACIONES - ASISTENTE IA" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "src\manage.py")) {
    Write-Host "❌ Error: No se encontró manage.py" -ForegroundColor Red
    Write-Host "   Asegúrate de ejecutar este script desde el directorio backend/" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Migraciones pendientes:" -ForegroundColor Yellow
python src\manage.py showmigrations plans_app

Write-Host ""
Write-Host "🔄 Aplicando migraciones..." -ForegroundColor Green
python src\manage.py migrate plans_app

Write-Host ""
Write-Host "✅ Proceso completado!" -ForegroundColor Green
Write-Host ""
Write-Host "Para verificar que todo está bien, puedes ejecutar:" -ForegroundColor Cyan
Write-Host "  python src\manage.py showmigrations plans_app" -ForegroundColor White
