import { defineConfig } from "unocss";

import presetUno from "@unocss/preset-uno";
import { presetScrollbar } from "unocss-preset-scrollbar";

import transformerVariantGroup from "@unocss/transformer-variant-group";

export default defineConfig({
  presets: [
    presetUno(),
    presetScrollbar()
  ],

  transformers: [
    transformerVariantGroup()
  ],

  theme: {
    fontFamily: {
      sans: ["Rubik", "sans-serif"]
    }
  }
});
