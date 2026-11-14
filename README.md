# JV Autoescuela — Hurlingham (Web App & Turnero para Cloudflare Workers)

Aplicación web oficial de **JV Autoescuela** (Av. Gobernador Vergara 3855, Hurlingham, Provincia de Buenos Aires), diseñada con identidad propia en **Rojo Gol (`#D41920`)**, grafito asfalto y blanco limpio, inspirada en la claridad comercial de Driver's School.

## Funcionalidades incluidas

- **Catálogo integral de categorías:** Auto Caja Manual (en el icónico **VW Gol rojo ploteado** con doble pedalera), Auto Caja Automática, Motos en todas las cilindradas (A1.1–A1.4 / A2) y Vehículos de Gran Porte (Camiones y Colectivos C, D y E).
- **Posicionamiento N° 1 en Hurlingham:** Bloque comparativo directo que resalta habilitación oficial PBA (`DISPO-2024-5`), instructores matriculados, VTV y seguro de enseñanza al día frente a opciones gratuitas o improvisadas.
- **Compra Online (Carrito + Packs):** Carrito persistente con selección de transferencia (10% OFF) o cuotas, conectado al endpoint `/api/checkout` (listo para Mercado Pago Checkout Pro).
- **Turnero Online + Google Calendar:** Consulta disponibilidad real en `/api/availability` (Lun–Vie 8 a 18 hs, Sáb 9 a 13 hs, Dom cerrado), genera pre-reserva en `/api/bookings`, link directo para agendar en **Google Calendar** y resumen pre-armado para **WhatsApp (`11-6817-2577`)**.
- **Pautas del examen práctico y Simulador Teórico PBA:** 8 preguntas oficiales interactivas con explicación inmediata.

## Cómo usar el logo real de JV Autoescuela

Por defecto, la app utiliza `public/images/logo-jv.svg`. Para colocar tu archivo original del logo (`.png`, `.webp` o `.svg`):

1. Reemplazá `public/images/logo-jv.svg` (o guardá `public/images/logo-jv.png` y actualizá la etiqueta `<img src="/images/logo-jv.png">` en `index.html`).

## Comandos principales

```bash
# Instalar dependencias
npm install

# Desarrollo frontend rápido (Vite)
npm run dev

# Build de producción
npm run build

# Probar localmente con el runtime real de Cloudflare Workers + API
npm run worker:dev

# Subir a Cloudflare Workers
npx wrangler login
npm run deploy
```

## Próximas integraciones (Google Calendar + Mercado Pago + D1)

En `wrangler.jsonc` y `src/worker.js` ya están documentados los bindings y secrets recomendados:

```bash
npx wrangler secret put GOOGLE_CALENDAR_ID
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
npx wrangler secret put GOOGLE_PRIVATE_KEY
npx wrangler secret put MP_ACCESS_TOKEN
```
