# Frontend - Conexión al Backend

## ✅ Configuración completada

El frontend ya está configurado para conectarse al backend en Cloud Run:
**URL del backend:** `https://backend-django-79197934609.us-central1.run.app`

## 📁 Archivos modificados

1. **`.env`** - Variables de entorno para desarrollo local
2. **`.env.production`** - Variables de entorno para producción
3. **`.env.example`** - Ejemplo de configuración (documentación)
4. **`Dockerfile`** - Actualizado para recibir la URL del backend como ARG
5. **`docker-compose.yml`** - Configurado con la URL del backend

## 🚀 Uso

### Desarrollo local (sin Docker)
```bash
npm install
npm run dev
```
El frontend se ejecutará en `http://localhost:5179` y se conectará automáticamente al backend en Cloud Run.

### Desarrollo local (con Docker Compose)
```bash
docker-compose up --build
```
El frontend se ejecutará en `http://localhost:8001` y se conectará al backend en Cloud Run.

### Producción
```bash
npm run build
npm run preview
```

## 🔧 Cambiar URL del backend

Para conectar a un backend diferente (ej: desarrollo local):

1. Edita el archivo `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

2. Reinicia el servidor de desarrollo.

## 🌐 Deploy a Cloud Run

Cuando despliegues el frontend a Cloud Run, usa:
```bash
gcloud run deploy frontend-react \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars VITE_API_BASE_URL=https://backend-django-79197934609.us-central1.run.app
```

O construye la imagen con el ARG:
```bash
docker build --build-arg VITE_API_BASE_URL=https://backend-django-79197934609.us-central1.run.app -t frontend .
```

## 📝 Nota importante

- Los archivos `.env` y `.env.production` contienen la URL del backend
- Estos archivos NO se suben a Git (están en `.gitignore`)
- Si trabajas en equipo, copia `.env.example` a `.env` y ajusta según necesites
