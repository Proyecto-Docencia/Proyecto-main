# 🚀 ACCESO RÁPIDO - Plataforma de Asistencia Docente con IA

## 🌐 URLs de Producción

### 🎨 Frontend (Aplicación Web)
```
https://frontend-react-a6zccy3fma-uc.a.run.app
```
**Clic aquí para acceder**: [Abrir Aplicación](https://frontend-react-a6zccy3fma-uc.a.run.app)

### 🔧 Backend (API REST)
```
https://backend-django-a6zccy3fma-uc.a.run.app
```

---

## 👤 Credenciales de Acceso

### Usuario de Prueba
```
Email:    test@docente.uss.cl
Password: Test123456
```

---

## ✅ Sistema 100% Operativo

- ✅ Frontend desplegado en Google Cloud Run
- ✅ Backend desplegado en Google Cloud Run
- ✅ Base de datos MySQL en Cloud SQL
- ✅ IA Gemini 2.0 integrada y funcionando
- ✅ Autenticación cross-origin configurada
- ✅ HTTPS habilitado automáticamente
- ✅ Scale-to-zero para optimización de costos

---

## 📱 Funcionalidades Disponibles

1. **🔐 Autenticación**
   - Registro de nuevos usuarios
   - Login/Logout
   - Gestión de perfil

2. **🤖 Chat con IA (Gemini 2.0)**
   - Asistente virtual para docentes
   - Respuestas personalizadas
   - Contexto académico USS

3. **📚 Gestión de Materiales**
   - Acceso a PDFs educativos
   - Videos y podcasts
   - Material de cada capítulo

4. **📝 Planificaciones**
   - Crear planificaciones de clases
   - Ver mis planificaciones
   - Asistente IA para planificación

---

## 🎯 Primer Uso

1. **Abre el navegador** en: https://frontend-react-a6zccy3fma-uc.a.run.app
2. **Haz clic en "Iniciar Sesión"**
3. **Ingresa las credenciales**:
   - Email: `test@docente.uss.cl`
   - Contraseña: `Test123456`
4. **¡Listo!** Ya puedes usar todas las funcionalidades

---

## 🔧 Comandos de Administración

### Ver logs del sistema
```powershell
# Logs del frontend
gcloud logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=frontend-react"

# Logs del backend
gcloud logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=backend-django"
```

### Redesplegar servicios
```powershell
# Backend
cd backend
gcloud builds submit --config cloudbuild.yaml

# Frontend
cd frontend
gcloud builds submit --config cloudbuild.yaml
```

---

## 📊 Estado del Sistema

| Componente | Estado | URL |
|------------|--------|-----|
| Frontend | ✅ Operativo | https://frontend-react-a6zccy3fma-uc.a.run.app |
| Backend | ✅ Operativo | https://backend-django-a6zccy3fma-uc.a.run.app |
| Base de Datos | ✅ Operativo | MySQL Cloud SQL (admin123) |
| IA Gemini | ✅ Operativo | Modelo: gemini-2.0-flash-exp |

---

## 💰 Costos Estimados

**~$12-20 USD/mes** con uso moderado
- Scale-to-zero cuando no hay tráfico
- Solo pagas por uso real
- Free tier de Cloud Build incluido

---

## 📚 Documentación Completa

- `VERIFICACION_COMPLETA_SISTEMA.md` - Estado detallado
- `DESPLIEGUE_FRONTEND.md` - Guía de despliegue frontend
- `GEMINI_RESUELTO.md` - Configuración de IA
- `RESUMEN_CONFIGURACION.md` - Configuración general

---

## 🆘 Soporte

Si encuentras algún problema:

1. Revisa los logs con los comandos anteriores
2. Verifica el estado de los servicios en: https://console.cloud.google.com/run
3. Consulta la documentación técnica completa

---

**Última actualización**: 17 de octubre, 2025 - 19:35
**Versión**: 1.0.0 - Producción
**Estado**: ✅ OPERATIVO

---

## 🎉 ¡Tu aplicación está lista para usar!

**👉 Accede ahora**: [https://frontend-react-a6zccy3fma-uc.a.run.app](https://frontend-react-a6zccy3fma-uc.a.run.app)
