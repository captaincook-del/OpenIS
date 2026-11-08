import fr from '../data/fr/ui.yaml'
import en from '../data/en/ui.yaml'

const ui = { fr, en }
import { state } from './store'

export const LANGS = ['fr', 'en']

// Traduction d'une phrase de l'interface ; {nom} est remplacé par vars.nom. Repli : français, puis la clé.
export const t = (key, vars = {}) =>
  (ui[state.lang]?.[key] ?? ui.fr[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`)

// Nom d'un groupe de domaines (les groupes sont identifiés par leur nom français)
export const tg = (g) => ui[state.lang]?.['g.' + g] ?? g

export function setLang(l) {
  if (!LANGS.includes(l)) return
  state.lang = l
  document.documentElement.lang = l
  try { localStorage.setItem('lang', l) } catch {}
}
