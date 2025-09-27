<#
PowerShell helper to deploy IA_DOCENTE folder to a Hugging Face Space repo.
Usage: run this script from the repository root or anywhere. It will prompt
for the Space repo (format `username/space_name`) and clone it, copy files,
commit and push. When asked for a password use your Hugging Face access token.
#>

Param()

function Ensure-Git {
    try {
        git --version > $null 2>&1
    } catch {
        Write-Error "git is not installed or not in PATH. Install git and retry."
        exit 1
    }
}

Ensure-Git

$space = Read-Host "Ingrese el repo del Space (usuario/space), ej: moi-123/iA_DOCENTE"
if (-not $space) {
    Write-Host "Repo no proporcionado. Abortando."
    exit 1
}

$cloneUrl = "https://huggingface.co/spaces/$space"
$tempDir = Join-Path $env:TEMP ("hf_space_" + [guid]::NewGuid().ToString())

Write-Host "Clonando $cloneUrl en $tempDir"
$clone = git clone $cloneUrl $tempDir
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error clonando. Si el repo no existe crea el Space primero en Hugging Face o usa hf CLI:"
    Write-Host "  hugggingface-cli repo create $space --type=space"
    exit 1
}

# Copiar los archivos de IA_DOCENTE al repo clonado
$source = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Definition) ''
# Si el script se corre desde otro folder, buscar IA_DOCENTE relative al cwd
if (-not (Test-Path (Join-Path $source 'IA_DOCENTE\app.py'))) {
    $cwdIA = Join-Path (Get-Location) 'IA_DOCENTE'
    if (Test-Path $cwdIA) { $source = $cwdIA } else { $source = Join-Path (Get-Location) 'IA_DOCENTE' }
}

Write-Host "Copiando archivos desde $source a $tempDir"
Copy-Item -Path (Join-Path $source '*') -Destination $tempDir -Recurse -Force -ErrorAction Stop

Push-Location $tempDir
try {
    git add .
    git commit -m "Add IA_DOCENTE Gradio app" -q
} catch {
    Write-Host "git commit: posiblemente no hay cambios o falta configuración de usuario git." 
}

Write-Host "Haciendo push al repo del Space. Cuando se solicite la contraseña, usa tu token de acceso de Hugging Face."
$push = git push
if ($LASTEXITCODE -ne 0) { Write-Error "git push falló. Verifica permisos/credenciales." }

Pop-Location

Write-Host "Despliegue completado. Si quieres, elimina el directorio temporal: $tempDir"
