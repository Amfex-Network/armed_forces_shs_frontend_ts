import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The app always calls /api on its own origin. Locally Vite forwards those
// calls to the backend (VITE_API_URL); in production vercel.json does.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_API_URL || "http://localhost:8080";
  const proxy = { "/api": { target, changeOrigin: false } };
  return {
    plugins: [react(), tailwindcss()],
    server: { proxy },
    preview: { proxy },
    build: { sourcemap: false },
  };
});
