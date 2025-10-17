# Guia para Reorganizar Repositorios

## Situacion Actual (PROBLEMA)
```
Proyecto-main/
├── .git/              ← Repo principal (Proyecto-main)
├── backend/           ← Sin .git propio
└── frontend/          ← Sin .git propio
```

## Situacion Deseada
```
Proyecto-main/
├── .git/              ← Repo que apunta a backend.git (raiz)
├── backend/           ← Submodulo de backend.git
└── frontend/          ← Submodulo de frontend.git
```

---

## PASOS PARA REORGANIZAR

### PASO 1: Inicializar backend como repositorio independiente

```powershell
# Ir a backend
cd "c:\dev\ia docencia\GITHUB\version rial\Proyecto-main\Proyecto-main\backend"

# Inicializar git
git init

# Agregar remote
git remote add origin https://github.com/Proyecto-Docencia/backend.git

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: Backend Django optimizado para Cloud Run"

# Subir a master
git branch -M master
git push -f origin master
```

### PASO 2: Inicializar frontend como repositorio independiente

```powershell
# Ir a frontend
cd "c:\dev\ia docencia\GITHUB\version rial\Proyecto-main\Proyecto-main\frontend"

# Inicializar git
git init

# Agregar remote
git remote add origin https://github.com/Proyecto-Docencia/frontend.git

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: Frontend React conectado a backend Cloud Run"

# Subir a master
git branch -M master
git push -f origin master
```

### PASO 3: Configurar raiz para usar backend.git

```powershell
# Ir a la raiz
cd "c:\dev\ia docencia\GITHUB\version rial\Proyecto-main\Proyecto-main"

# Cambiar el remote
git remote set-url origin https://github.com/Proyecto-Docencia/backend.git

# O si prefieres un repo diferente para la raiz, usa:
# git remote set-url origin https://github.com/Proyecto-Docencia/Proyecto-main.git
```

### PASO 4: Agregar .gitignore en la raiz para ignorar backend y frontend

```powershell
# Crear .gitignore en la raiz
cd "c:\dev\ia docencia\GITHUB\version rial\Proyecto-main\Proyecto-main"

# Agregar esto al .gitignore:
backend/
frontend/
```

---

## OPCION ALTERNATIVA: Usar Git Submodules (RECOMENDADO)

### PASO 1: Remover backend y frontend del tracking

```powershell
cd "c:\dev\ia docencia\GITHUB\version rial\Proyecto-main\Proyecto-main"

# Remover del tracking pero NO eliminar archivos
git rm -r --cached backend
git rm -r --cached frontend

# Commit
git commit -m "Remove backend and frontend from tracking"
```

### PASO 2: Agregar como submodulos

```powershell
# Agregar backend como submodulo
git submodule add https://github.com/Proyecto-Docencia/backend.git backend

# Agregar frontend como submodulo
git submodule add https://github.com/Proyecto-Docencia/frontend.git frontend

# Commit
git commit -m "Add backend and frontend as submodules"
```

### PASO 3: Push
```powershell
git push origin main
```

---

## ¿Cual opcion usar?

### Opcion A: Repositorios Separados (Mas simple)
✅ Cada carpeta es independiente
✅ Facil de entender
❌ Tienes que hacer git push en cada carpeta por separado

### Opcion B: Submodulos (Mas profesional)
✅ Un solo repositorio padre
✅ Mantiene referencias a versiones especificas
❌ Mas complejo de usar

---

## RECOMENDACION

Si tu amigo y tu trabajan juntos, usa **OPCION B (Submodulos)**.
Si trabajan por separado, usa **OPCION A (Repositorios Separados)**.

---

**Ejecuta los comandos segun la opcion que elijas**
