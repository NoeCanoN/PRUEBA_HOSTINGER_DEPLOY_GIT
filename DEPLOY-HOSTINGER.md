# Despliegue en Hostinger vía GitHub

Proyecto de prueba: **Laravel 13 + Vue 3 + Vuetify 4 + Pinia + Axios**, compilado con Vite dentro de Laravel y servido desde `public/`.

Plan de Hostinger: **Business/Premium** (incluye apps Node.js administradas → `npm` disponible por SSH para compilar Vite en el servidor).

---

## Flujo resumido
1. Subir el repo a GitHub.
2. En hPanel, clonar el repo por Git en el dominio.
3. Por SSH: `composer install`, `npm ci && npm run build`, configurar `.env`, `php artisan migrate`.
4. Verificar.

---

## 1. hPanel — preparar el dominio y la BD
- **hPanel → Dominios**: crea o usa tu dominio/subdominio.
- **Document root** (recomendado): apúntalo a la carpeta `public` del proyecto, p. ej.
  `/domains/tudominio/public_html/clubnutricional/public`.
  - Si **no puedes** cambiar el document root, usa el `.htaccess` de la raíz del repo (ya incluido), que reescribe todo a `public/`.
- **hPanel → Bases de datos → MySQL**: crea una BD y un usuario. Guarda host, nombre de BD, usuario y contraseña (los usarás en el `.env`).

> ⚠️ Que el document root sea `public/` es clave: evita exponer tu `.env`, `composer.json`, etc.

---

## 2. hPanel — Git deployment
1. **hPanel → Avanzado → Git → Clonar repositorio**.
2. Pega la URL del repo de GitHub y selecciona la rama `main`.
3. Directorio destino: la carpeta del proyecto (donde apunta el document root o su padre).
4. Copia la **deploy key SSH** que muestra Hostinger y añádela en
   **GitHub → Repo → Settings → Deploy keys** (acceso de lectura).
5. (Opcional) Activa el **webhook** para desplegar automáticamente en cada push.

> El Git de Hostinger **no** ejecuta `composer` ni `npm` automáticamente. Los builds se hacen por SSH (paso 3).

---

## 3. SSH — instalar, compilar y configurar
Accede por SSH (hPanel → Avanzado → Acceso SSH). En la carpeta del proyecto:

```bash
# Dependencias PHP
composer install --no-dev --optimize-autoloader

# Dependencias JS y build de Vite (genera public/build/*)
npm ci
npm run build

# Variables de entorno
cp .env.example .env
php artisan key:generate
```

Edita `.env` con los datos de Hostinger:
```ini
APP_URL=https://tudominio
APP_ENV=production
APP_DEBUG=false

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=u123456789_club
DB_USERNAME=u123456789_admin
DB_PASSWORD=tu_password
```

Después:
```bash
php artisan migrate          # crea tablas y valida la conexión MySQL
php artisan storage:link

# (Recomendado en producción) cachear config y rutas
php artisan config:cache
php artisan route:cache
```

> **Permisos:** las carpetas `storage/` y `bootstrap/cache/` deben ser escribibles (775). Si `migrate` falla por permisos, ajústalas.

> **Sesiones/cache:** este test usa `SESSION_DRIVER=file`, `CACHE_STORE=file` y `QUEUE_CONNECTION=sync` (sin BD), por lo que funciona aunque la BD tarde en configurarse. En tu app real puedes volver a `database` una vez confirmado `migrate`.

---

## 4. Verificar
- `https://tudominio/api/health` → debe devolver `{"status":"ok","service":"club-nutricional"}`.
- `https://tudominio/` → carga la tarjeta con estilos Vuetify y, al pulsar el botón, muestra **Estado: ok**.

---

## Problemas comunes
| Síntoma | Causa / solución |
|---|---|
| 404 al recargar una ruta interna | Si usas Vue Router en modo *history*, añade rewrite a `index.html`. (Este test no usa Vue Router.) |
| 500 relacionado con sesiones/BD | Confirma `SESSION_DRIVER=file` o que `migrate` se ejecutó y la BD del `.env` es correcta. |
| Estilos/JS sin cargar | Ejecuta `npm run build` en el servidor. No subas `public/build` desde local. |
| Cambios no se reflejan tras un push | Vuelve a correr `composer install` y `npm run build` por SSH tras cada despliegue. |
| `.env` o `vendor` expuestos | El document root debe ser `public/`, no la raíz del repo. |
