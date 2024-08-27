import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import unocss from "unocss/vite";

// @ts-expect-error process is a bun global
const host = process.env.TAURI_DEV_HOST;
// @ts-expect-error node is a bun type
import path from "node:path";
// @ts-expect-error __dirname is a bun global
const root = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [unocss(), solid()],

  resolve: {
    alias: {
      "@": root
    }
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421
      }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"]
    }
  }
}));
