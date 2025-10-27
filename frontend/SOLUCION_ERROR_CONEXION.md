# 🔧 Solución: Error de Conexión al Backend

## ❌ Error Actual:
```
POST http://localhost:8081/api/v1/auth/login/ net::ERR_CONNECTION_REFUSED
```

## ✅ URL Correcta del Backend:
```
https://backend-django-a6zccy3fma-uc.a.run.app
```

---

## 📋 PASOS PARA SOLUCIONAR:

### **Paso 1: Detener el Servidor de Desarrollo**
```powershell
# En la terminal donde corre npm run dev, presiona:
Ctrl + C
```

### **Paso 2: Limpiar Caché de Node/Vite**
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
```

### **Paso 3: Reiniciar el Servidor**
```powershell
npm run dev
```

### **Paso 4: Limpiar Caché del Navegador**
1. Abre Chrome/Edge DevTools: `F12`
2. Click derecho en el botón de recargar
3. Selecciona: **"Vaciar caché y volver a cargar de manera forzada"**

O simplemente:
- Presiona: `Ctrl + Shift + Delete`
- Marca: "Imágenes y archivos almacenados en caché"
- Click en "Borrar datos"

### **Paso 5: Verificar en Consola del Navegador**
Abre DevTools (F12) → Console → Ejecuta:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL);
// Debería mostrar: https://backend-django-a6zccy3fma-uc.a.run.app
```

---

## 🔍 VERIFICACIÓN:

### ✅ Archivos Verificados:
- [x] `frontend/.env` → Contiene la URL correcta
- [x] `frontend/.env.production` → Contiene la URL correcta  
- [x] `frontend/Dockerfile` → ARG con URL correcta
- [x] `frontend/docker-compose.yml` → Build args correctos

### ✅ Backend Verificado:
- [x] URL: https://backend-django-a6zccy3fma-uc.a.run.app
- [x] Estado: ✅ Corriendo
- [x] Base de Datos: ✅ Conectada (MySQL admin123)
- [x] CORS: ✅ Habilitado
- [x] Endpoint /dbcheck: ✅ Respondiendo

---

## 🎯 CAUSA RAÍZ:

El problema es que **Vite cachea las variables de entorno en tiempo de compilación**. 

Cuando modificaste el archivo `.env`:
1. ✅ El archivo se actualizó correctamente
2. ❌ Vite/navegador seguía usando la versión cacheada antigua
3. ❌ El JavaScript compilado tenía la URL vieja hardcodeada

---

## 🚀 ALTERNATIVA: Usar Docker Compose

Si el problema persiste, usa Docker:

```powershell
cd frontend
docker-compose down
docker-compose up --build
```

El frontend estará disponible en: http://localhost:8001

---

## 📞 APOYO ADICIONAL:

Si después de estos pasos sigue sin funcionar, verifica:

1. **¿Qué URL aparece en la consola del navegador?**
   ```javascript
   console.log(import.meta.env.VITE_API_BASE_URL);
   ```

2. **¿Qué puerto está usando el frontend?**
   - Desarrollo: http://localhost:5179
   - Docker: http://localhost:8001

3. **¿El backend responde?**
   ```powershell
   Invoke-WebRequest -Uri "https://backend-django-a6zccy3fma-uc.a.run.app/dbcheck"
   ```

---

## ✅ ESTADO ACTUAL:

- ✅ Backend: Desplegado y funcionando
- ✅ Configuración: Archivos .env actualizados
- ⏳ Frontend: Esperando limpieza de caché
