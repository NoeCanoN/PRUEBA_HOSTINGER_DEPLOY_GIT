# Club Nutricional — Test de despliegue Hostinger

Proyecto **mínimo** para validar el flujo de despliegue de un stack completo
**Laravel 13 + Vue 3 + Vuetify 4 + Pinia + Axios** en Hostinger vía GitHub.

> 📖 La guía paso a paso está en [`DEPLOY-HOSTINGER.md`](./DEPLOY-HOSTINGER.md).

## Qué incluye
- **Laravel 13** (PHP 8.3) con un endpoint de prueba: `GET /api/health`.
- **Vue 3 + Vuetify 4 + Pinia + Axios** compilados con **Vite** y servidos desde `public/`.
- Una vista (`/`) que monta la app Vue y, al pulsar un botón, llama a `/api/health`
  con Axios a través de un store de Pinia.
- `.htaccess` en la raíz (fallback para shared hosting) y `.env.example`.

## Requisitos
- PHP >= 8.2 (probado con 8.3)
- Composer
- Node.js 18+ y npm

## Ejecutar en local
```bash
composer install
npm install
npm run build          # compila Vite -> public/build
cp .env.example .env
php artisan key:generate
php artisan serve      # http://localhost:8000
```

Verifica:
- `http://localhost:8000/api/health` → `{"status":"ok","service":"club-nutricional"}`
- `http://localhost:8000/` → tarjeta de Vuetify que muestra "Estado: ok".

> Nota: este proyecto de prueba usa `SESSION_DRIVER=file`, `CACHE_STORE=file` y
> `QUEUE_CONNECTION=sync` (sin dependencia de BD), para que el test funcione
> aunque la base de datos no esté configurada todavía.

## Desplegar en Hostinger
Sigue [`DEPLOY-HOSTINGER.md`](./DEPLOY-HOSTINGER.md). Resumen:
1. Subir el repo a GitHub.
2. En hPanel, clonar por Git (document root apuntando a `public/`).
3. Por SSH: `composer install`, `npm ci && npm run build`, configurar `.env`,
   `php artisan migrate`.
4. Verificar `/api/health` y la home.
