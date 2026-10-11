import site from './data/site.yaml'
import roadmap from './data/roadmap.yaml'
import pricing from './data/pricing.yaml'
import pages from './data/pages.yaml'

// Un fichier par domaine : le préfixe numérique (01-, 02-…) fixe l'ordre des onglets.
const files = import.meta.glob('./data/domains/*.yaml', { eager: true, import: 'default' })
export const tabs = Object.entries(files).sort(([a], [b]) => a.localeCompare(b)).map(([, d]) => ({ ...d, group: roadmap.domains.find((r) => r.id === d.id)?.group ?? 'Autres' }))

export const { levels, sizes } = site
export { pricing, pages }

// Adresses de contact : injectées à la construction par les variables VITE_* (netlify.toml, interface Netlify
// ou fichier .env.local). Sans variable, on garde la valeur de pages.yaml.
pages.contact.email = import.meta.env.VITE_CONTACT_EMAIL || pages.contact.email
pages.contact.claims_email = import.meta.env.VITE_CLAIMS_EMAIL || pages.contact.claims_email || pages.contact.email

// Adresse du dépôt Git (logo GitHub) : VITE_REPO_URL, sinon valeur de pages.yaml ; vide = logo masqué
export const repoUrl = import.meta.env.VITE_REPO_URL || pages.links?.repo || ''

// Source de vérité : la présence d'un fichier dans domains/. roadmap.yaml ne sert qu'à nommer,
// regrouper et lister les domaines prévus ; un fichier absent de la feuille de route va dans « Autres ».
const byId = new Map(tabs.map((t) => [t.id, t]))
const have = new Set(byId.keys())
const known = new Set(roadmap.domains.map((d) => d.id))
// planned = pas de fichier ; partial = fichier avec `status: partial` ; done = fichier terminé
const stateOf = (t) => (!t ? 'planned' : t.status === 'partial' ? 'partial' : 'done')
const all = [
  ...roadmap.domains.map((d) => ({ ...d, status: stateOf(byId.get(d.id)) })),
  ...tabs.filter((t) => !known.has(t.id)).map((t) => ({ id: t.id, name: t.name, group: 'Autres', status: stateOf(t) })),
]
const nDone = all.filter((d) => d.status === 'done').length
export const coverage = {
  done: nDone,
  created: all.filter((d) => d.status !== 'planned').length,
  total: all.length,
  pct: Math.round((nDone / all.length) * 100),
  // Le bandeau « en construction » disparaît quand tous les domaines sont créés ET terminés
  complete: nDone === all.length,
  groups: Object.entries(all.reduce((g, d) => ((g[d.group] ||= []).push(d), g), {})),
}

// Contrôles en développement : une donnée mal formée s'affiche vide ou disparaît sans erreur visible
if (import.meta.env.DEV) {
  const w = (m) => console.warn('[catalogue] ' + m)
  for (const t of tabs) {
    if (!known.has(t.id)) w(`domaine « ${t.id} » absent de roadmap.yaml : classé dans « Autres »`)
    for (const k of sizes.map((s) => s.id)) if (!t.sizing?.[k]) w(`${t.id} : phrase sizing.${k} manquante`)
    for (const it of t.items ?? []) {
      if (it.v?.length !== levels.length) w(`${t.id} / ${it.name} : ${it.v?.length ?? 0} valeurs dans v, ${levels.length} attendues`)
      for (const s of it.sizes ?? []) if (!sizes.some((z) => z.id === s)) w(`${t.id} / ${it.name} : taille « ${s} » inconnue`)
    }
  }
  for (const d of roadmap.domains) if (d.status === 'done' && !have.has(d.id)) w(`roadmap : « ${d.id} » marqué done mais sans fichier domains/`)
}

// ---- Solutions : liens et badges ----
import reg from './data/solutions.yaml'

export const { families, labels: labelDefs } = reg
export const solutions = reg.solutions.map((s) => ({ labels: [], license: null, ...s }))

export const familyOf = (sol) =>
  families.find((f) => sol.license && f.prefixes.some((p) => sol.license.startsWith(p))) ??
  families.find((f) => f.id === 'unknown')

const index = new Map(solutions.flatMap((s) => s.names.map((n) => [n, s])))
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const re = new RegExp(
  `(?<![\\p{L}\\d])(${[...index.keys()].sort((a, b) => b.length - a.length).map(esc).join('|')})(?![\\p{L}\\d])`,
  'gu',
)

// Découpe un texte en morceaux, les noms de solutions connues portent leur fiche `s`.
export function annotate(text = '') {
  const parts = [], sols = []
  let last = 0
  for (const m of text.matchAll(re)) {
    if (m.index > last) parts.push({ t: text.slice(last, m.index) })
    const s = index.get(m[1])
    parts.push({ t: m[1], s })
    if (!sols.includes(s)) sols.push(s)
    last = m.index + m[1].length
  }
  if (last < text.length) parts.push({ t: text.slice(last) })
  return { parts, sols }
}

// ---- Fiches de solution : une page dédiée seulement si src/data/solutions/<id>.yaml existe ----
const detailFiles = import.meta.glob('./data/solutions/*.yaml', { eager: true, import: 'default' })
export const details = Object.fromEntries(Object.values(detailFiles).map((d) => [d.id, d]))
export const hasDetail = (sol) => !!details[sol?.id]
export const solutionById = (id) => solutions.find((s) => s.id === id)
// Retrouve une solution du registre à partir d'un nom écrit à la main (ex. une alternative d'une fiche)
export const findByName = (name) => index.get(name)

// Valeur affichée pour (taille, niveau) : une exception `by_size` si elle existe, sinon la valeur par défaut du niveau.
// Une exception est un texte, ou { text, why } pour expliquer pourquoi la réponse change avec la taille.
export function resolve(it, sizeId, levelIdx) {
  const o = it.by_size?.[sizeId]
  const raw = Array.isArray(o) ? o[levelIdx] : o?.[levels[levelIdx].id]
  if (raw == null) return { text: it.v?.[levelIdx], why: null, custom: false }
  return typeof raw === 'string' ? { text: raw, why: null, custom: true } : { text: raw.text, why: raw.why ?? null, custom: true }
}

// Où la solution est utilisée : domaine, composant, niveaux (valeurs par défaut et variantes par taille)
export function usedIn(sol) {
  const out = []
  for (const t of tabs) {
    for (const it of t.items ?? []) {
      const found = new Set()
      for (const s of sizes) {
        if (it.sizes && !it.sizes.includes(s.id)) continue
        levels.forEach((l, i) => { if (annotate(resolve(it, s.id, i).text).sols.includes(sol)) found.add(l.name) })
      }
      if (found.size) out.push({ domain: t, item: it.name, levels: levels.filter((l) => found.has(l.name)).map((l) => l.name) })
    }
  }
  return out
}

if (import.meta.env.DEV) {
  for (const id of Object.keys(details)) if (!solutionById(id)) console.warn(`[fiches] « ${id} » absent de solutions.yaml : la fiche ne sera jamais liée`)
}

if (import.meta.env.DEV) {
  for (const t of tabs) for (const it of t.items ?? []) for (const [sid, o] of Object.entries(it.by_size ?? {})) {
    const where = `${t.id} / ${it.name} / by_size.${sid}`
    if (!sizes.some((s) => s.id === sid)) console.warn(`[catalogue] ${where} : taille inconnue`)
    if (Array.isArray(o)) { if (o.length !== levels.length) console.warn(`[catalogue] ${where} : ${o.length} valeurs, ${levels.length} attendues (null = valeur par défaut)`) }
    else for (const k of Object.keys(o ?? {})) if (!levels.some((l) => l.id === k)) console.warn(`[catalogue] ${where} : niveau « ${k} » inconnu`)
  }
}