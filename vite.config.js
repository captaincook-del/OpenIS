import { readdirSync } from 'node:fs'
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
      {
        name: 'robots-sitemap',
        // robots.txt et sitemap.txt générés au build : une fiche ajoutée dans data/fr/solutions/ y entre seule.
        // URL : celle du site sur Netlify (variable URL fournie au build), sinon SITE_URL, sinon l'adresse Netlify par défaut.
        generateBundle() {
          const site = (process.env.URL || process.env.SITE_URL || 'https://openis.netlify.app').replace(/\/$/, '')
          const pages = ['', 'catalogue', 'budget', 'solutions', 'a-propos', 'contact', 'mentions-legales']
          const fiches = readdirSync('src/data/fr/solutions').filter((f) => f.endsWith('.yaml')).map((f) => 'solutions/' + f.slice(0, -5)).sort()
          const urls = [...pages, ...fiches].map((p) => (p ? `${site}/#/${p}` : `${site}/`))
          this.emitFile({ type: 'asset', fileName: 'sitemap.txt', source: urls.join('\n') + '\n' })
          this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.txt\n` })
        },
      },
    ],
  }
})
