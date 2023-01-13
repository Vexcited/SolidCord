import type { Plugin, ResolvedConfig } from "vite";
import { defineConfig } from "vite";

import { execSync } from "node:child_process";
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
        const port = auth_info.port as number;
        const token = auth_info.accessToken as string;

        const scriptToFind = "<script src=\"/neutralino.js\"></script>";
        const curl_executable = process.platform === "win32" ? "curl.exe" : "curl";

        const neutralinoScriptContent = execSync(`${curl_executable} http://localhost:${port}/neutralino.js`, { stdio: "pipe" })
          .toString()
          .replace(
            "NL_TOKEN=''",
            `NL_TOKEN='${token}'`
          );

        const shouldKeepNeutralinoScript = !neutralinoScriptContent.includes("var Neutralino");

        return html.replace(
          scriptToFind,
          `
            <script>${neutralinoScriptContent}</script>
            ${shouldKeepNeutralinoScript ? scriptToFind : ""}
          `.trim()
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
