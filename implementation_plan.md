# Make the e‑commerce app deployment‑ready

**Goal**: Prepare the React Vite e‑commerce application for production deployment, including building the frontend, running the JSON‑Server backend, and providing Docker support for easy hosting.

## User Review Required

> [!IMPORTANT]
> The deployment approach adds a new Docker‑Compose setup and a `concurrently` script. If you already have a preferred hosting environment (e.g., Vercel, Netlify, Azure), let me know so I can tailor the setup.

## Open Questions

> [!WARNING]
> - Do you want the backend API served on the same domain (e.g., via a reverse proxy) or on a separate service?  
> - Should the Docker image use an Nginx static server for the built Vite assets, or would you prefer serving via `vite preview`?

## Proposed Changes

---
### 1. Add production scripts to `package.json`

- Install `concurrently` as a dev dependency.
- Add a `start:prod` script that runs both the Vite preview server and the JSON‑Server API together.

---
### 2. Create a Dockerfile for the frontend

- Uses a multi‑stage build:
  1. **builder** stage: `node:20-alpine` installs deps and runs `npm run build`.
  2. **runtime** stage: `nginx:alpine` copies the built files to `/usr/share/nginx/html`.
- Exposes port **80**.

---
### 3. Add a Dockerfile for the API (optional – can be run directly with json‑server)

- Simple `node:20-alpine` image that copies `src/db.json` and runs `json-server` on port **3001**.

---
### 4. Add `docker-compose.yml`

- Defines two services:
  - `frontend` built from the Dockerfile above, exposing port **80**.
  - `api` runs the JSON‑Server image, exposing port **3001**.
- Uses a shared network so the frontend can call the backend via the service name `api`.
- Sets environment variable `VITE_API_URL=http://api:3001` for the Vite build.

---
### 5. Update Vite environment handling

- In `src/App.jsx` (or a dedicated `src/config.js`), replace hard‑coded `http://localhost:3001` with `import.meta.env.VITE_API_URL`.
- Ensure the fallback uses the environment variable defined at build time.

---
### 6. Add a production‑ready `.env.production`

```
VITE_API_URL=http://api:3001
```

---
### 7. Update README with deployment instructions

- How to build locally: `npm run build`.
- How to run with Docker: `docker compose up --build`.
- How to start without Docker (for quick prod test): `npm run start:prod`.

---
## Verification Plan

### Automated Tests
- Run `npm run lint` to ensure no lint errors after changes.
- Execute `npm run build` and confirm it completes without errors.
- Run `docker compose up --build` and check that both services start and the frontend can fetch data from the API (curl `http://localhost/api/products`).

### Manual Verification
- Open `http://localhost` in a browser and verify the UI loads, navigation works, and API‑driven features (product list, cart, orders) function correctly.
- Test the login/registration flows to ensure the fetch calls succeed.

Once you approve the plan, I will implement the changes.
