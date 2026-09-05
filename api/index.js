// Vercel serverless function that serves the JSON data using json-server
// This provides a lightweight mock API for the e‑commerce front‑end.
// The file is placed in the `api` directory, so Vercel will expose it at `/api`.

const jsonServer = require('json-server');
const path = require('path');

// Path to the db.json file that contains mock data
const dbFile = path.join(__dirname, '..', 'src', 'db.json');

const router = jsonServer.router(dbFile);
const middlewares = jsonServer.defaults({ static: false });

module.exports = (req, res) => {
  // Enable CORS for the frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  // json-server expects the request to be a Node.js http.IncomingMessage, but Vercel provides a compatible object.
  // Pass the request through the middlewares and router.
  middlewares(req, res, () => {
    router(req, res);
  });
};
