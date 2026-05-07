// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Disable Cloudflare Workers plugin so that TanStack Start builds for Node.js
// (produces .output/server/index.mjs instead of a Cloudflare worker-entry).
// This is required for hosting on Render, Railway, or any Node.js platform.
export default defineConfig({ cloudflare: false });
