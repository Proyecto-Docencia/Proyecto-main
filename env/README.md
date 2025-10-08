# Carpeta env

Coloca aquí:

- Archivo `.env` (no se versiona) basado en `.env.example`.
- Archivo `credentials.json` de Google Cloud (no se versiona) u otros JSON de credenciales.

Esta carpeta se monta read-only en el contenedor backend en `/app/env`.

En producción, preferir inyectar variables de entorno en lugar de copiar directamente archivos sensibles si la plataforma lo permite.
