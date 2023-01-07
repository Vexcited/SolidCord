import type { Plugin, ResolvedConfig } from "vite";
import { defineConfig } from "vite";
import path from "node:path";

import solid from "vite-plugin-solid";
import windi from "vite-plugin-windicss";

// <https://github.com/neutralinojs/neutralinojs/issues/909>.
const neutralino_dev = (): Plugin => {
  let config: ResolvedConfig;
  const virtualModuleId = "virtual:neutralino-dev";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "neutralino-dev",

    configResolved (resolvedConfig) {
      config = resolvedConfig;
    },

    resolveId (id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load (id) {
      if (id === resolvedVirtualModuleId) {
        let code: string;

        if (config.mode === "development") {
          code = `
            const authInfo = await import("${path.join(__dirname, ".tmp", "auth_info.json")}");
            const neutralinoJsFileUrl = \`http://localhost:\${authInfo.port}/neutralino.js\`;
          `;
        }
        else {
          code = `
            const neutralinoJsFileUrl = "/neutralino.js";
          `;
        }

        return code + `
          const neutralinoScript = document.createElement("script");
          neutralinoScript.setAttribute("src", neutralinoJsFileUrl);
          document.body.appendChild(neutralinoScript);
        `;
      }
    }
  };
};

export default defineConfig({
  plugins: [
    solid(),
    windi(),

    // Will only apply development code on development mode.
    neutralino_dev()
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
