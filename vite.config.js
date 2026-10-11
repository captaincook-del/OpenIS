import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import yaml from '@modyfi/vite-plugin-yaml'

export default defineConfig({ plugins: [vue(), UnoCSS(), yaml()] })
