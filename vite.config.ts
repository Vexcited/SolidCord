import { defineConfig } from "vite";
import path from "node:path";

import solid from "vite-plugin-solid";
import pages from "vite-plugin-pages";

// const mobile =
//   process.env.TAURI_PLATFORM === "android" ||
//   process.env.TAURI_PLATFORM === "ios";

export default defineConfig({
  plugins: [solid(), pages()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,

  // Tauri expects a fixed port, fail if that port is not available.
  server: {
    port: 1420,
    strictPort: true
  },

  // To make use of `TAURI_DEBUG` and other env variables.
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },

  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux.
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    // Don't minify for debug builds.
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // Produce sourcemaps for debug builds.
    sourcemap: !!process.env.TAURI_DEBUG
  }
});
