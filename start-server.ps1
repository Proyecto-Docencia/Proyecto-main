#!/usr/bin/env pwsh
Set-Location "C:\Users\isido\OneDrive\Escritorio\Proyecto Software\Proyecto-main\project"
Write-Host "Directorio actual: $(Get-Location)"
Write-Host "Iniciando servidor Vite..."
npx vite --port 4000 --host 0.0.0.0