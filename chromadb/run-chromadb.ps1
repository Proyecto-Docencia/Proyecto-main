#!/usr/bin/env pwsh
param(
    [Parameter(Mandatory=$false)][string]$PdfsDir=".\pdfs",
    [switch]$Query,
    [string]$Q=""
)

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

if (!(Test-Path .venv)) {
    Write-Host "Creando entorno virtual .venv"
    py -3 -m venv .venv
}

Write-Host "Activando entorno virtual"
& .\.venv\Scripts\Activate.ps1

pip install -U pip
pip install -r requirements.txt

if ($Query) {
    if ([string]::IsNullOrWhiteSpace($Q)) { Write-Error "Provee -Q 'tu pregunta'"; exit 1 }
    python .\query_embeddings.py "$Q"
} else {
    if (!(Test-Path $PdfsDir)) { Write-Error "No existe el directorio de PDFs: $PdfsDir"; exit 1 }
    python .\ingest_docs.py $PdfsDir
}
