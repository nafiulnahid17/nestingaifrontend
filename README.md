# Nesting AI frontend
React + TypeScript + Vite, CSS and Lucide icons. Four hash-routed screens, responsive layout, local image preview, single/batch selection and simulated progress. Device setup is a modal. Export previews are sample assets; no real output files are generated. No backend, authentication, Kie.ai requests or Illustrator automation is included. The hero and sample images are cropped from the provided visual reference.

## Run
`npm install` then `npm run dev`.

## Cloudflare Pages
Framework: Vite; build command: `npm run build`; output directory: `dist`; Node 22. No secrets are necessary for the UI. Future API calls should use a Worker and private server-side credentials. Batch UI limit is provisionally 20. Hash routes: #home, #create, #processing, #export.

## Limited Artwork Engine test connection

The Creator now checks `/api/artwork/readiness` and sends real test jobs through `worker/index.js`. This Worker keeps `ENGINE_AUTH_TOKEN` on the server; the tester enters a separate private `TEST_ACCESS_TOKEN` in the Creator. The same token must be configured on the Artwork Engine. The job status reflects actual engine stages, and Front/Back original masters are downloadable after success. Vectorization and Illustrator export are not connected.

For local testing, start Artwork Engine at `http://127.0.0.1:8000` with `ARTWORK_TEST_MODE=true`, a Kie API key, a persistent SQLite path, a persistent asset directory, a strong `ENGINE_AUTH_TOKEN`, and a separate strong `TEST_ACCESS_TOKEN`. In this frontend's `.dev.vars` set `ARTWORK_ENGINE_URL=http://127.0.0.1:8000`, `ENGINE_AUTH_TOKEN` and `TEST_ACCESS_TOKEN`. Run `npm run build` then `npx wrangler dev`, open the Creator, enter the test access code and submit one reference. The engine defaults to at most two paid test jobs. Never set these values as `VITE_` client variables. Hosted testing additionally needs an HTTPS engine URL and durable database/asset storage; the current SQLite/local-asset implementation is intended for a persistent single instance, not Vercel serverless.
