# Revisión Completa para Deployment en Google Cloud Run

## 📋 Resumen de la Revisión

**Fecha**: 2025
**Estado**: ✅ LISTO PARA DEPLOYMENT
**Proyecto GCP**: `docencia-uss-backup-2025`
**Región**: `us-central1`

---

## 🔍 1. BACKEND - Estado y Configuración

### ✅ Modelo de Datos
- **Archivo**: `backend/src/plans_app/models.py`
- **Modelo**: `PlanificacionAsistenteIA`
- **Campos**: 18 campos (titulo, asignatura, nivel, diagnostico_estudiantes, etc.)
- **Validación**: Campos `feedback_ia` (JSONField), `capitulos_seleccionados` (JSONField)
- **Estado**: ✅ COMPLETO - Migración creada (0003_*.py)

### ✅ API Views
- **Archivo**: `backend/src/plans_app/views_asistente_ia.py`
- **Endpoints**:
  - `GET /api/v1/plans/asistente-ia/` - Listar planificaciones del usuario
  - `POST /api/v1/plans/asistente-ia/` - Crear nueva planificación
  - `GET/PUT/DELETE /api/v1/plans/asistente-ia/<id>/` - CRUD individual
  - `POST /api/v1/plans/asistente-ia/<id>/validar/` - Validación con IA
- **Estado**: ✅ COMPLETO

### ✅ URLs Configuradas
- **Archivo**: `backend/src/plans_app/urls.py`
- **Rutas**: 3 endpoints configurados correctamente
- **Estado**: ✅ COMPLETO

### ✅ Sistema RAG
- **Archivos**: 
  - `backend/src/rag_proxy/retrieval.py` - Búsqueda vectorial
  - `backend/src/rag_proxy/ingest.py` - Indexación de PDFs
  - `backend/src/chat_app/views.py` - Integración RAG en endpoint /api/chat/crear/
- **PDFs Incluidos** (6 documentos):
  1. Capitulo2.pdf
  2. Capitulo3.pdf
  3. Cápitulo4.pdf
  4. Capítulo5.pdf
  5. Capitulo6.pdf
  6. **Etapa_ciclo_alfabetizacion_digital.pdf** (NUEVO - agregado recientemente)
- **Embeddings**: sentence-transformers (all-MiniLM-L6-v2)
- **Cache**: `/app/rag_cache/embeddings.npz`
- **Estado**: ✅ COMPLETO - Nuevo PDF agregado exitosamente

### ✅ Dockerfile Backend
- **Archivo**: `backend/Dockerfile`
- **Configuración**:
  - Base: `python:3.12-slim`
  - Multi-stage build: No (single stage)
  - ARG `ENABLE_RAG`: Condicional para instalar dependencias RAG
  - Pre-download modelo: Sí, se descarga sentence-transformers en build
- **Scripts**:
  - `entrypoint.sh`: Ejecuta migraciones + gunicorn
  - `wait_for_db.sh`: Espera conexión a MySQL
- **Estado**: ✅ COMPLETO

### ✅ Requirements
- **requirements.txt**: Django, mysqlclient, gunicorn, google-genai
- **requirements-rag.txt**: pypdf, sentence-transformers, numpy
- **Estado**: ✅ COMPLETO

### ✅ Cloud Build Configuration
- **Archivo**: `backend/cloudbuild.yaml`
- **Steps**:
  1. Build image con `--build-arg ENABLE_RAG=1`
  2. Push a Artifact Registry: `us-central1-docker.pkg.dev/PROJECT_ID/backend-repo/backend-django:latest`
  3. Deploy a Cloud Run con todas las variables de entorno
- **Substitutions Críticas**:
  - `_ENABLE_RAG: '1'` ✅ ACTIVADO
  - `_CLOUDSQL_INSTANCE: 'docencia-uss-backup-2025:us-central1:docencia-db'`
  - `_DB_HOST: '/cloudsql/docencia-uss-backup-2025:us-central1:docencia-db'`
  - `_DB_NAME: 'docencia_db'`
  - `_DB_USER: 'admin123'`
  - `_GEMINI_API_KEY: 'AIzaSyBPhSEmBjSvhiHECT-XzpCzfRkcBNgK6mY'`
  - `_GEMINI_MODEL: 'gemini-2.0-flash-exp'`
- **Recursos**:
  - Memory: `2Gi`
  - CPU: `1`
  - Min Instances: `0`
  - Max Instances: `10`
  - Timeout: `600s`
- **Estado**: ✅ LISTO PARA DEPLOYMENT

---

## 🎨 2. FRONTEND - Estado y Configuración

### ✅ API Client
- **Archivo**: `frontend/src/utils/api.ts`
- **Funciones Nuevas** (6):
  1. `fetchPlanificacionesIA()` - GET lista
  2. `crearPlanificacionIA(data)` - POST crear
  3. `getPlanificacionIADetalle(id)` - GET individual
  4. `updatePlanificacionIA(id, data)` - PUT actualizar
  5. `deletePlanificacionIA(id)` - DELETE eliminar
  6. `validarPlanificacionIA(id, feedback, capitulos)` - POST validar
- **Bug Corregido**: Función duplicada `validarPlanificacionIA` renombrada
- **Estado**: ✅ COMPLETO - Sin errores TypeScript

### ✅ Páginas Implementadas
1. **PlanificacionAsistenteIA.tsx**: Formulario con 18 campos + chat
2. **VerPlanificacionAsistente.tsx**: Vista previa + guardar
3. **VerificacionIA.tsx**: Validación RAG con selección de capítulos
   - **CRÍTICO**: Usa endpoint correcto `/api/chat/crear/` con `usar_rag: true`
4. **MisPlanificaciones.tsx**: Lista con tabs (tradicional/asistente-ia) + detalle
   - **Bug Corregido**: Interface `PlanItemIA` con todos los 18 campos

### ✅ Dockerfile Frontend
- **Archivo**: `frontend/Dockerfile`
- **Configuración**:
  - Stage 1: Node 20 Alpine - Build con Vite
  - Stage 2: Nginx Alpine - Serve static files
  - ARG `VITE_API_BASE_URL`: URL del backend
- **Estado**: ✅ COMPLETO

### ✅ Cloud Build Configuration
- **Archivo**: `frontend/cloudbuild.yaml`
- **Steps**:
  1. Build image con `--build-arg VITE_API_BASE_URL=https://backend-django-grduktq54q-uc.a.run.app`
  2. Push a Artifact Registry: `us-central1-docker.pkg.dev/PROJECT_ID/frontend-repo/frontend-react:latest`
  3. Deploy a Cloud Run
- **Substitutions**:
  - `_SERVICE_NAME: 'frontend-react'`
  - `_VITE_API_BASE_URL: 'https://backend-django-grduktq54q-uc.a.run.app'`
  - Memory: `512Mi`
  - CPU: `1`
  - Port: `80`
- **Estado**: ✅ LISTO PARA DEPLOYMENT

### ✅ Errores de Código
- **TypeScript Errors**: ✅ 0 errores críticos
- **ESLint Warnings**: ⚠️ 50+ warnings (no bloquean deployment)
  - Mayormente: prefer globalThis, Array index in keys, form labels
  - **Prioridad**: LOW - Refactor futuro

---

## 🗄️ 3. BASE DE DATOS

### ✅ Configuración CloudSQL
- **Instancia**: `docencia-uss-backup-2025:us-central1:docencia-db`
- **Engine**: MySQL
- **Database**: `docencia_db`
- **Usuario**: `admin123`
- **Conexión**: Unix socket `/cloudsql/docencia-uss-backup-2025:us-central1:docencia-db`
- **Estado**: ✅ CONFIGURADO en Cloud Build

### ✅ Migraciones
- **Migración Pendiente**: `0003_alter_planificacion_options_and_more.py`
- **Contenido**: Crea tabla `plans_app_planificacionasistenteaia` con 18 campos
- **Aplicación**: ✅ Automática en entrypoint.sh al iniciar Cloud Run
- **Estado**: ✅ LISTO PARA APLICAR

---

## 🤖 4. SISTEMA RAG - Validación

### ✅ Flujo de Validación
1. Usuario completa planificación → VerPlanificacionAsistente.tsx
2. Usuario selecciona capítulos (1-6) → VerificacionIA.tsx
3. Frontend envía a `/api/chat/crear/` con `usar_rag: true`
4. Backend (views.py:crear_chat):
   - LLama a `search(mensaje, top_k=3)` en retrieval.py
   - Extrae chunks relevantes de los 6 PDFs
   - Formatea contexto con fuentes (PDF + página)
   - Envía a Gemini con contexto RAG
5. Respuesta incluye feedback citando páginas específicas
6. Frontend guarda feedback en `feedback_ia` JSONField

### ✅ Archivos RAG
- **Directorio**: `backend/src/rag_proxy/docs/`
- **PDFs**: 6 documentos (incluido nuevo Etapa_ciclo_alfabetizacion_digital.pdf)
- **Verificación**: ✅ Archivo copiado exitosamente
- **Indexación**: Ocurrirá en primer startup de Cloud Run

### ✅ Dependencias RAG
- **requirements-rag.txt**: pypdf>=4.2.0, sentence-transformers>=2.7.0, numpy>=1.26.0
- **Instalación**: Condicional en Dockerfile (if ENABLE_RAG=1)
- **Cloud Build**: ✅ `_ENABLE_RAG: '1'` configurado
- **Estado**: ✅ HABILITADO

---

## 🚀 5. COMANDOS DE DEPLOYMENT

### 📦 Backend Deployment

```bash
# 1. Navegar al directorio backend
cd "c:\dev\ia docencia\GITHUB\version rial\Proyecto-main\Proyecto-main\backend"

# 2. Autenticar con Google Cloud
gcloud auth login
gcloud config set project docencia-uss-backup-2025

# 3. Submit build a Cloud Build (usa cloudbuild.yaml)
gcloud builds submit --config cloudbuild.yaml .

# Esto ejecutará:
# - Build con ENABLE_RAG=1
# - Push a us-central1-docker.pkg.dev/docencia-uss-backup-2025/backend-repo/backend-django:latest
# - Deploy a Cloud Run con todas las env vars
```

### 🎨 Frontend Deployment

```bash
# 1. Navegar al directorio frontend
cd "c:\dev\ia docencia\GITHUB\version rial\Proyecto-main\Proyecto-main\frontend"

# 2. Submit build a Cloud Build
gcloud builds submit --config cloudbuild.yaml .

# Esto ejecutará:
# - Build con VITE_API_BASE_URL=https://backend-django-grduktq54q-uc.a.run.app
# - Push a us-central1-docker.pkg.dev/docencia-uss-backup-2025/frontend-repo/frontend-react:latest
# - Deploy a Cloud Run
```

### 🔍 Verificación Post-Deployment

```bash
# 1. Verificar servicios en Cloud Run
gcloud run services list --region=us-central1

# 2. Ver logs del backend
gcloud run services logs read backend-django --region=us-central1 --limit=50

# 3. Ver logs del frontend
gcloud run services logs read frontend-react --region=us-central1 --limit=50

# 4. Verificar migraciones aplicadas (desde Cloud Shell o local con proxy)
gcloud run services proxy backend-django --region=us-central1 --port=8080
# En otra terminal:
curl http://localhost:8080/api/v1/plans/asistente-ia/ -H "Authorization: Bearer <token>"
```

---

## ✅ 6. CHECKLIST PRE-DEPLOYMENT

### Backend
- [x] Modelo `PlanificacionAsistenteIA` completo con 18 campos
- [x] 6 API endpoints implementados y testeados
- [x] Migración 0003 creada (se aplicará en startup)
- [x] Sistema RAG configurado con 6 PDFs
- [x] Nuevo PDF Etapa_ciclo_alfabetizacion_digital.pdf agregado
- [x] `cloudbuild.yaml` con `ENABLE_RAG=1`
- [x] Variables de entorno configuradas (DB, Gemini, CORS)
- [x] CloudSQL instance configurada
- [x] Dockerfile optimizado con pre-download de modelo

### Frontend
- [x] 6 nuevas funciones en `api.ts`
- [x] Interface `PlanItemIA` con 18 campos
- [x] VerificacionIA.tsx usando `/api/chat/crear/` con `usar_rag: true`
- [x] MisPlanificaciones.tsx con tabs y detalle
- [x] Sin errores TypeScript críticos
- [x] `cloudbuild.yaml` con `VITE_API_BASE_URL` correcto
- [x] Nginx configurado para SPA

### RAG
- [x] 6 PDFs en `backend/src/rag_proxy/docs/`
- [x] retrieval.py con search() y format_context()
- [x] crear_chat() en views.py con parámetro `usar_rag`
- [x] requirements-rag.txt completo
- [x] ENABLE_RAG=1 en Cloud Build

### Database
- [x] CloudSQL MySQL configurado
- [x] Usuario admin123 con permisos
- [x] Database docencia_db creada
- [x] Conexión Unix socket configurada
- [x] Migraciones se aplicarán automáticamente

---

## 🎯 7. ORDEN DE DEPLOYMENT RECOMENDADO

### Paso 1: Backend (CRÍTICO PRIMERO)
```bash
cd backend
gcloud builds submit --config cloudbuild.yaml .
```
**Duración estimada**: 8-12 minutos
- Build incluye descarga de modelo sentence-transformers (~500MB)
- Migraciones se aplican en primer startup
- Servicio backend debe estar funcionando antes del frontend

### Paso 2: Verificar Backend
```bash
# Obtener URL del servicio
gcloud run services describe backend-django --region=us-central1 --format="value(status.url)"

# Testear endpoint
curl https://backend-django-grduktq54q-uc.a.run.app/api/v1/plans/asistente-ia/
```
**Respuesta esperada**: `{"detail":"Authentication credentials were not provided."}` (correcto, significa que el endpoint funciona)

### Paso 3: Frontend
```bash
cd ../frontend
gcloud builds submit --config cloudbuild.yaml .
```
**Duración estimada**: 5-8 minutos
- Build de Vite + copia de archivos estáticos

### Paso 4: Verificar Frontend
```bash
# Obtener URL del servicio
gcloud run services describe frontend-react --region=us-central1 --format="value(status.url)"

# Abrir en navegador
start https://frontend-react-<hash>-uc.a.run.app
```

### Paso 5: Test Completo del Flujo
1. Abrir frontend en navegador
2. Login con usuario existente
3. Ir a "Planificación Asistente IA"
4. Completar formulario (18 campos)
5. "Ver Planificación" → Guardar
6. Ir a "Verificación IA" → Seleccionar capítulos → Validar
7. Verificar que feedback cite páginas específicas de PDFs
8. Ir a "Mis Planificaciones" → Ver planificación guardada

---

## 🔧 8. TROUBLESHOOTING

### Error: "Access denied for user 'admin123'"
- **Causa**: Credenciales incorrectas o usuario sin permisos
- **Solución**: Verificar `_DB_PASSWORD` en cloudbuild.yaml

### Error: "Module 'pypdf' not found"
- **Causa**: RAG no habilitado en build
- **Solución**: Verificar `_ENABLE_RAG: '1'` en cloudbuild.yaml

### Error: Frontend no carga backend
- **Causa**: VITE_API_BASE_URL incorrecto
- **Solución**: Actualizar `_VITE_API_BASE_URL` en frontend/cloudbuild.yaml con URL real del backend

### Error: "Migration 0003 fails"
- **Causa**: Tabla ya existe o conflicto de schema
- **Solución**: Conectar a CloudSQL y verificar: `SHOW TABLES LIKE 'plans_app_planificacion%';`

### Warning: RAG no devuelve contexto
- **Causa**: Embeddings no generados
- **Solución**: Esperar primer startup (puede tomar 2-3 minutos), verificar logs:
  ```bash
  gcloud run services logs read backend-django --region=us-central1 | grep "ingest\|embed"
  ```

---

## 📊 9. RECURSOS Y COSTOS ESTIMADOS

### Backend Cloud Run
- **Memory**: 2Gi
- **CPU**: 1
- **Min Instances**: 0 (escala a 0 cuando no hay tráfico)
- **Max Instances**: 10
- **Costo estimado**: ~$10-20/mes (depende del tráfico)

### Frontend Cloud Run
- **Memory**: 512Mi
- **CPU**: 1
- **Min Instances**: 0
- **Max Instances**: 5
- **Costo estimado**: ~$5-10/mes

### CloudSQL MySQL
- **Tier**: db-n1-standard-1 o similar
- **Costo estimado**: ~$30-50/mes

### Artifact Registry
- **Storage**: ~1-2 GB (imágenes Docker)
- **Costo estimado**: ~$0.10-0.20/mes

### Cloud Build
- **Free tier**: 120 build-minutes/day
- **Costo estimado**: $0 (dentro de free tier para ~4-6 builds/día)

**TOTAL ESTIMADO**: ~$45-80/mes

---

## 🎉 10. CONFIRMACIÓN FINAL

### ✅ Sistema Listo para Deployment
- **Backend**: Código completo, migración lista, RAG habilitado
- **Frontend**: Sin errores críticos, API integrada
- **Database**: CloudSQL configurado, migraciones automáticas
- **RAG**: 6 PDFs incluidos, nuevo documento agregado
- **Cloud Build**: Archivos cloudbuild.yaml configurados con todas las variables

### 🚀 Próximo Paso
**Ejecutar comandos de deployment en orden**:
1. Backend (`gcloud builds submit` en /backend)
2. Verificar backend funcionando
3. Frontend (`gcloud builds submit` en /frontend)
4. Test completo del flujo RAG

### 📝 Notas Adicionales
- Los ESLint warnings (50+) no bloquean el deployment, son mejoras de estilo para el futuro
- El sistema RAG indexará los PDFs en el primer startup (2-3 minutos)
- Las migraciones se aplicarán automáticamente al iniciar el backend
- Los secretos (API keys, passwords) están en cloudbuild.yaml como substitutions
- **IMPORTANTE**: Después del deployment, verificar que la validación con IA cite páginas específicas de los PDFs

---

## 📞 Contacto y Soporte
- **Proyecto**: Docencia USS
- **GCP Project ID**: docencia-uss-backup-2025
- **Región**: us-central1 (Iowa)
- **Repositorio**: Proyecto-main
