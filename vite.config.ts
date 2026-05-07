// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

// Disable Cloudflare Workers plugin and add Nitro for Node.js server deployment.
// Nitro produces .output/server/index.mjs — a standalone HTTP server for Render/Railway/Docker.
export default defineConfig({
  cloudflare: false,
  plugins: [nitro()],
  vite: {
    build: {
      // Disable source maps in production to prevent code inspection
      sourcemap: false,
    },
  },
});
