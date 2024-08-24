import { defineConfig, presetUno, transformerVariantGroup } from "unocss";

export default defineConfig({
  presets: [
    presetUno()
  ],

  transformers: [
    transformerVariantGroup()
  ],

  theme: {
    fontFamily: {
      sans: "Satoshi-Variable"
    }
  }
});
