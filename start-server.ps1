#!/usr/bin/env pwsh
# Arranque rápido de la pila Docker (frontend + backend + db + new_api)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "Directorio actual: $(Get-Location)"
Write-Host "Levantando servicios con Docker Compose (build + up -d)..."

docker compose up -d --build

if ($LASTEXITCODE -ne 0) {
	Write-Error "Fallo al construir/levantar servicios. Revisa Docker Desktop y vuelve a intentar."
	exit 1
}

Write-Host "Servicios levantados:"
docker compose ps

Write-Host "Abre http://localhost:8080 en tu navegador."