# Uruguay Innova

Presentacion interactiva construida con React y Vite. Incluye un fondo Grainient persistente, navegacion entre placas, animacion BlurText y collages de imagenes.

## Desarrollo local

```bash
npm install
npm run dev
```

## Verificacion

```bash
npm run lint
npm run build
```

## Netlify

El proyecto incluye `netlify.toml` con esta configuracion:

- Build command: `npm run build`
- Publish directory: `dist`

En Netlify, conecta el repositorio de GitHub y usa la rama principal. Netlify ejecutara el build automaticamente en cada push.
