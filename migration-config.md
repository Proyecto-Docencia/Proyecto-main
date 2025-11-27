# Configuración para nuevo proyecto: docencia-uss-backup-2025

## Variables de entorno para Cloud Run
CORS_ALLOWED_ORIGINS=https://frontend-react-docencia-uss-backup-2025.run.app
CORS_ALLOW_ALL_ORIGINS=1
CSRF_TRUSTED_ORIGINS=https://*.run.app
DB_ENGINE=mysql
DB_HOST=/cloudsql/docencia-uss-backup-2025:us-central1:docencia-db
DB_NAME=docencia_db
DB_PASSWORD=NuevaPassword123#
DB_PORT=3306
DB_USER=docencia_user
DJANGO_DEBUG=0
DJANGO_SECRET_KEY=nueva-secret-key-super-segura-para-produccion-2025
ENABLE_RAG=1
GEMINI_API_KEY=[NUEVA_API_KEY]
GEMINI_MODEL=gemini-2.0-flash-exp
SKIP_DB_WAIT=0

## Comandos para ejecutar después de habilitar facturación:

# 1. Habilitar servicios
gcloud services enable cloudbuild.googleapis.com run.googleapis.com sqladmin.googleapis.com artifactregistry.googleapis.com

# 2. Crear instancia Cloud SQL
gcloud sql instances create docencia-db \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=NuevaPassword123#

# 3. Crear base de datos
gcloud sql databases create docencia_db --instance=docencia-db

# 4. Crear usuario
gcloud sql users create docencia_user \
  --instance=docencia-db \
  --password=NuevaPassword123#

# 5. Crear repositorio Artifact Registry
gcloud artifacts repositories create backend-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Backend Django repository"

# 6. Configurar Docker
gcloud auth configure-docker us-central1-docker.pkg.dev