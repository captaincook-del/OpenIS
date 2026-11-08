import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import yaml from '@modyfi/vite-plugin-yaml'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [
      vue(), UnoCSS(), yaml(),
      {
        name: 'verifie-adresses',
        buildStart() {
          if (mode !== 'production') return
          // Affiche (sans les valeurs) quelles variables le build a reçues : utile pour déboguer Netlify
          const ctx = process.env.CONTEXT || 'local'
          for (const k of ['VITE_CONTACT_EMAIL', 'VITE_CLAIMS_EMAIL', 'VITE_REPO_URL']) {
            if (env[k]) console.log(`[env] ${k} : définie (contexte ${ctx})`)
            else this.warn(`${k} absente (contexte ${ctx}) : la valeur fictive de pages.yaml sera publiée.`)
          }
        },
      },
    ],
  }
})
