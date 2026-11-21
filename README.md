# Nesting AI frontend
React + TypeScript + Vite, CSS and Lucide icons. Four hash-routed screens, responsive layout, local image preview, single/batch selection and simulated progress. Device setup is a modal. Export previews are sample assets; no real output files are generated. No backend, authentication, Kie.ai requests or Illustrator automation is included. The hero and sample images are cropped from the provided visual reference.

## Run
`npm install` then `npm run dev`.

## Cloudflare Pages
Framework: Vite; build command: `npm run build`; output directory: `dist`; Node 22. No secrets are necessary for the UI. Future API calls should use a Worker and private server-side credentials. Batch UI limit is provisionally 20. Hash routes: #home, #create, #processing, #export.
