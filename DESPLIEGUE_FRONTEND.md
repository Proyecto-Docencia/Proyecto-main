# 🚀 Despliegue del Frontend a Google Cloud Run

## 📦 Configuración de Repositorios

### Artifact Registry - Repositorios Separados ✅

| Repositorio | Tipo | Ubicación | Uso |
|------------|------|-----------|-----|
| **my-django-repo** | Docker | us-central1 | Backend Django |
| **frontend-repo** | Docker | us-central1 | Frontend React ✅ |

**Ventajas de repositorios separados**:
- ✅ Mejor seguridad y aislamiento
- ✅ Gestión independiente de versiones
- ✅ Permisos granulares por equipo
- ✅ Más fácil de mantener y escalar

---

## 🏗️ Arquitectura del Frontend

```
Frontend (React + Vite + TypeScript)
  ↓
Dockerfile (Multi-stage build)
  ↓
Cloud Build (cloudbuild.yaml)
  ↓
Artifact Registry (frontend-repo)
  ↓
Cloud Run (frontend-react)
  ↓
URL pública (*.run.app)
```

---

## 📝 Archivos de Configuración

### 1. `frontend/Dockerfile`
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
ARG VITE_API_BASE_URL=https://backend-django-a6zccy3fma-uc.a.run.app
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 2: Serve con Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Características**:
- ✅ Multi-stage build (reduce tamaño de imagen)
- ✅ Node 20 Alpine (ligero)
- ✅ Nginx Alpine para servir archivos estáticos
- ✅ Variable de entorno VITE_API_BASE_URL configurable

### 2. `frontend/cloudbuild.yaml`
```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '--build-arg'
      - 'VITE_API_BASE_URL=${_VITE_API_BASE_URL}'
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/frontend-repo/${_SERVICE_NAME}:latest'
      - '.'
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/frontend-repo/${_SERVICE_NAME}:latest']
  
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: 'gcloud'
    args:
      - 'run'
      - 'deploy'
      - '${_SERVICE_NAME}'
      - '--image'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/frontend-repo/${_SERVICE_NAME}:latest'
      - '--region'
      - '${_REGION}'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--port'
      - '80'
      - '--memory'
      - '512Mi'
      - '--cpu'
      - '1'
      - '--min-instances'
      - '0'
      - '--max-instances'
      - '5'

substitutions:
  _SERVICE_NAME: 'frontend-react'
  _REGION: 'us-central1'
  _VITE_API_BASE_URL: 'https://backend-django-a6zccy3fma-uc.a.run.app'
```

### 3. `frontend/nginx.conf`
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Características**:
- ✅ Soporte para React Router (SPA)
- ✅ Fallback a index.html para rutas dinámicas

---

## 🔧 Requisitos Previos

### 1. APIs Habilitadas ✅
```bash
- Cloud Run API
- Cloud Build API
- Artifact Registry API
```

### 2. Permisos IAM ✅
```bash
- Cloud Build Service Account debe tener:
  - roles/run.admin
  - roles/artifactregistry.writer
  - roles/iam.serviceAccountUser
```

### 3. Repositorio en Artifact Registry ✅
```bash
Nombre: frontend-repo
Formato: Docker
Ubicación: us-central1
Estado: ✅ Creado
```

---

## 🚀 Proceso de Despliegue

### Comando de despliegue:
```powershell
cd "c:\dev\ia docencia\GITHUB\version rial\Proyecto-main\Proyecto-main\frontend"
gcloud builds submit --config cloudbuild.yaml
```

### Pasos del Cloud Build:
1. **Step #0**: Construir imagen Docker con Vite build
2. **Step #1**: Subir imagen a `frontend-repo`
3. **Step #2**: Desplegar a Cloud Run como `frontend-react`

### Tiempo estimado: 3-5 minutos

---

## 📊 Configuración de Cloud Run

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| **Service Name** | frontend-react | Nombre del servicio |
| **Region** | us-central1 | Misma región que backend |
| **Memory** | 512Mi | Suficiente para Nginx |
| **CPU** | 1 | 1 vCPU |
| **Min Instances** | 0 | Scale to zero (ahorro) |
| **Max Instances** | 5 | Máximo escalado |
| **Port** | 80 | Puerto de Nginx |
| **Authentication** | Allow unauthenticated | Acceso público |
| **Timeout** | 300s | 5 minutos |

---

## 🌐 URLs Finales (después del despliegue)

### Backend
```
https://backend-django-a6zccy3fma-uc.a.run.app
```

### Frontend (estimado)
```
https://frontend-react-[hash]-uc.a.run.app
```

---

## 🔍 Verificación Post-Despliegue

### 1. Verificar servicio desplegado
```powershell
gcloud run services describe frontend-react --region=us-central1
```

### 2. Obtener URL del frontend
```powershell
gcloud run services describe frontend-react --region=us-central1 --format="value(status.url)"
```

### 3. Verificar logs
```powershell
gcloud logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=frontend-react" --project=gen-lang-client-0776831973
```

### 4. Probar desde navegador
```
1. Abrir URL del frontend
2. Verificar que carga correctamente
3. Hacer login con test@docente.uss.cl
4. Probar navegación
5. Verificar chatbot con IA
```

---

## ⚙️ Variables de Entorno del Frontend

| Variable | Valor | Dónde se configura |
|----------|-------|-------------------|
| **VITE_API_BASE_URL** | https://backend-django-a6zccy3fma-uc.a.run.app | Build time (Dockerfile ARG) |

**Nota**: Las variables de Vite se embeben en el build, no son runtime.

---

## 🔒 Seguridad

### CORS en el Backend ✅
```python
# backend/src/config/settings.py
CORS_ALLOW_ALL_ORIGINS = True  # O configurar específicamente
CORS_ALLOW_CREDENTIALS = True
SESSION_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SECURE = True
```

### Cookies Cross-Origin ✅
```python
SESSION_COOKIE_SECURE = True      # HTTPS only
SESSION_COOKIE_SAMESITE = 'None'  # Cross-origin allowed
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'
```

---

## 💰 Costos Estimados

### Frontend en Cloud Run (estimación mensual)
- **Invocaciones**: ~100,000/mes
- **CPU**: 512 vCPU-seconds
- **Memoria**: 256 GiB-seconds
- **Red**: 1 GB egress
- **Costo estimado**: **~$1-3 USD/mes** 💰

**Ventajas**:
- Scale to zero (sin tráfico = sin costo)
- Solo pagas por uso real
- Incluye CDN y HTTPS gratis

---

## 🎯 Próximos Pasos

1. ✅ Repositorio `frontend-repo` creado
2. ✅ `cloudbuild.yaml` configurado
3. ⏳ Ejecutar despliegue
4. ⏳ Obtener URL pública
5. ⏳ Actualizar CORS si es necesario
6. ⏳ Probar aplicación completa

---

## 📚 Recursos

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Artifact Registry](https://cloud.google.com/artifact-registry/docs)
- [Cloud Build](https://cloud.google.com/build/docs)
- [Vite Build](https://vitejs.dev/guide/build.html)

---

**Fecha de configuración**: 17 de octubre, 2025
**Estado**: ✅ Listo para desplegar
