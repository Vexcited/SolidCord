import type { Plugin, ResolvedConfig } from "vite";
import { defineConfig } from "vite";
import fs from "node:fs/promises";
import path from "node:path";

import solid from "vite-plugin-solid";
import windi from "vite-plugin-windicss";

// <https://github.com/neutralinojs/neutralinojs/issues/909>.
const neutralino = (): Plugin => {
  let config: ResolvedConfig;

  return {
    name: "neutralino",

    configResolved (resolvedConfig) {
      config = resolvedConfig;
    },

    async transformIndexHtml (html) {
      if (config.mode === "development") {
        const auth_info_file = await fs.readFile(path.join(__dirname, ".tmp", "auth_info.json"), {
          encoding: "utf-8"
        });

        const auth_info = JSON.parse(auth_info_file);
        const port = auth_info.port;

        return html.replace(
          "<script src=\"neutralino.js\"></script>",
          `<script src="http://localhost:${port}/neutralino.js"></script>`
        );
      }

      return html;
    }
  };
};

export default defineConfig({
  plugins: [
    solid(),
    windi(),
    neutralino()
  ],

  server: {
    port: 3000
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },

  build: {
    target: "esnext"
  }
});
