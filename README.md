# WC26 IST Hub

Premium World Cup 2026 match hub built for Indian fans, with day-wise IST fixtures, live/cached API data, favorites, reminders, calendar/share tools, mobile navigation, and football-themed interactions.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment

Create `.env` from `.env.example`:

```bash
VITE_WC_API_BASE_URL=https://worldcup26.ir
VITE_WC_API_TOKEN=
```

`VITE_WC_API_TOKEN` is optional. Public endpoints are called without a token, and authenticated requests use `Authorization: Bearer` when a token is present.
