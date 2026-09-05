# Deploy the e‑commerce app on Vercel

Prepare the React Vite e‑commerce application so that it can be deployed on Vercel and work fully (login, cart, orders, etc.) without a separate backend server.

## User Review Required

> [!IMPORTANT]
> This plan adds a serverless API on Vercel that serves the `db.json` data using `json‑server`‑like logic. If you already have a custom backend or prefer to host the API elsewhere, let me know so I can adapt the approach.

## Open Questions

> [!WARNING]
> - Do you want the API to be exposed under the path `/api/*` (default) or a different base path?
> - Should the API be read‑only (as `json‑server` provides) or do you need write capabilities (e.g., order creation, cart updates)?
>
> Please confirm the desired API base path and whether write operations are required.

## Proposed Changes

---
### 1. Add Vercel configuration (`vercel.json`)
- Define rewrites so that any request to `/api/*` is routed to a serverless function located in `api/index.js`.
- Enable static file serving from the Vite build output (`dist`).

---
### 2. Create serverless API (`api/index.js`)
- Install `json-server` as a dependency.
- Use `jsonServer.create()` and `jsonServer.router('src/db.json')` to create a router.
- Export a handler compatible with Vercel: `module.exports = (req, res) => router(req, res);`
- Set appropriate CORS headers (`Access‑Control‑Allow‑Origin: *`).

---
### 3. Update fetch wrapper in `src/App.jsx`
- Change the base URL to use the relative `/api` path when `import.meta.env.PROD` is true:
```js
const API_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:3001');
```
- Remove the `LOCAL_API_URL` constant and simplify the custom `fetch` implementation.

---
### 4. Add production build script
- In `package.json` add a `build` script (already exists) and a `postbuild` script that copies the built `dist` folder to Vercel’s output (Vercel automatically serves `dist`). No extra steps needed.

---
### 5. Create `.env.production` for Vercel (optional)
- Add `VITE_API_URL=/api` so that the frontend points to the serverless API when built for production.

---
### 6. Update README with Vercel deployment steps
- Explain how to link the repo to Vercel, set the framework preset to **Vite**, and add the environment variable `VITE_API_URL=/api`.
- Provide commands for a local preview: `vercel dev`.

---
### 7. Ensure authentication works client‑side
- The login flow currently validates credentials against `users` in `db.json`. No token handling is required for the demo; the API will return the matching user record.
- Confirm that the login request uses `POST /users` with a filter (or a custom endpoint). If needed, add a simple `/login` handler in `api/index.js` that checks credentials and returns the user object.

---
### 8. Add a Vercel ignore file (`.vercelignore`)
- Exclude `node_modules` and any local dev files from the deployment bundle.

---
## Verification Plan

### Automated Tests
- Run `npm run lint` to ensure no lint errors after modifications.
- Run `npm run build` locally; verify that the `dist` folder is generated without errors.
- Execute `vercel dev` and open `http://localhost:3000` to confirm the frontend loads and API calls succeed (check network tab for `/api/*`).

### Manual Verification
- Deploy to Vercel via the dashboard or `vercel --prod`.
- Open the live URL and test:
  1. Register a new user.
  2. Log in with the newly created credentials.
  3. Browse products, add items to the cart, place an order.
  4. Navigate to Wishlist, Orders, Profile pages.
- Ensure no CORS or 404 errors appear in the browser console.

Once you approve the plan, I will implement the changes.
