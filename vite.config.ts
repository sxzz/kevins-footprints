import UnoCSS from 'unocss/vite'
import Yaml from 'unplugin-yaml/vite'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid(), UnoCSS(), Yaml()],
})
