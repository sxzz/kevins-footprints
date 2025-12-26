import { presetWind3, defineConfig, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [presetWind3()],
  transformers: [transformerDirectives()],
})
