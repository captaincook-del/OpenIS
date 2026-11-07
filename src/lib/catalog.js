import { reactive, watch } from 'vue'
import { state } from './store'
import roadmap from '../data/shared/roadmap.yaml'
import pricingShared from '../data/shared/pricing.yaml'
import reg from '../data/shared/solutions.yaml'

// ---- Fichiers de données : shared/ (neutre), fr/ (référence), en/ (traduction facultative, même structure) ----
const domFiles = import.meta.glob('../data/fr/domains/*.yaml', { eager: true, import: 'default' })
const ficheFiles = import.meta.glob('../data/fr/solutions/*.yaml', { eager: true, import: 'default' })
const frRoot = import.meta.glob('../data/fr/*.yaml', { eager: true, import: 'default' })
const enRoot = import.meta.glob('../data/en/*.yaml', { eager: true, import: 'default' })
const enDom = import.meta.glob('../data/en/domains/*.yaml', { eager: true, import: 'default' })
const enFiche = import.meta.glob('../data/en/solutions/*.yaml', { eager: true, import: 'default' })
const enPath = (p) => p.replace('../data/fr/', '../data/en/')
const site = frRoot['../data/fr/site.yaml']

// Fusion : la valeur anglaise remplace la française quand elle existe (null ou absente = on garde le français).
// Les listes se fusionnent par position : l'anglais doit suivre l'ordre du français.
const merge = (fr, en) => {
  if (en == null) return fr
  // Une exception de by_size peut être un texte ou { text, why } : on accepte l'une pour l'autre entre les langues
  if (fr && typeof fr === 'object' && !Array.isArray(fr) && 'text' in fr && typeof en === 'string') en = { text: en }
  if (typeof fr === 'string' && en && typeof en === 'object' && typeof en.text === 'string') return en.text
  if (Array.isArray(fr)) return fr.map((x, i) => merge(x, Array.isArray(en) ? en[i] : undefined))
  if (fr && typeof fr === 'object') return Object.fromEntries(Object.entries(fr).map(([k, v]) => [k, merge(v, en?.[k])]))
  return typeof en === typeof fr ? en : fr
}

// ---- Données réactives : remplacées à chaque changement de langue ----
export const levels = reactive([])
export const sizes = reactive([])
export const families = reactive([])
export const labelDefs = reactive([])
export const tabs = reactive([])
export const pages = reactive({})
export const pricing = reactive({})
export const details = reactive({})
export const coverage = reactive({})

export const solutions = reg.solutions.map((s) => ({ labels: [], license: null, ...s }))
export const repoUrl = import.meta.env.VITE_REPO_URL || frRoot['../data/fr/pages.yaml'].links?.repo || ''
const frTabs = Object.entries(domFiles).sort(([a], [b]) => a.localeCompare(b))

function apply(lang) {
  const EN = lang === 'en'
  const ov = (name) => merge(frRoot[`../data/fr/${name}.yaml`], EN ? enRoot[`../data/en/${name}.yaml`] : undefined)

  const s = ov('site')
  levels.splice(0, levels.length, ...s.levels)
  sizes.splice(0, sizes.length, ...s.sizes)
  const r = ov('licences')
  families.splice(0, families.length, ...r.families)
  labelDefs.splice(0, labelDefs.length, ...r.labels)

  tabs.splice(0, tabs.length, ...frTabs.map(([path, d]) => {
    const o = EN ? enDom[enPath(path)] : undefined
    return { ...merge(d, o), group: roadmap.domains.find((x) => x.id === d.id)?.group ?? 'Autres', translated: !EN || !!o }
  }))

  for (const k of Object.keys(details)) delete details[k]
  for (const [path, d] of Object.entries(ficheFiles)) {
    const o = EN ? enFiche[enPath(path)] : undefined
    details[d.id] = { ...merge(d, o), translated: !EN || !!o }
  }

  Object.assign(pricing, pricingShared, ov('pricing'))
  const p = ov('pages')
  // Adresses injectées à la construction (VITE_*), sinon valeurs de pages.yaml
  p.contact.email = import.meta.env.VITE_CONTACT_EMAIL || p.contact.email
  p.contact.claims_email = import.meta.env.VITE_CLAIMS_EMAIL || p.contact.claims_email || p.contact.email
  for (const k of Object.keys(pages)) delete pages[k]
  Object.assign(pages, p, { translated: !EN || !!enRoot['../data/en/pages.yaml'] })

  // Couverture : planned = pas de fichier ; partial = status: partial ; done = terminé
  const byId = new Map(tabs.map((t) => [t.id, t]))
  const known = new Set(roadmap.domains.map((d) => d.id))
  const stateOf = (t) => (!t ? 'planned' : t.status === 'partial' ? 'partial' : 'done')
  const all = [
    ...roadmap.domains.map((d) => ({ ...d, name: byId.get(d.id)?.name ?? d.name, status: stateOf(byId.get(d.id)) })),
    ...tabs.filter((t) => !known.has(t.id)).map((t) => ({ id: t.id, name: t.name, group: 'Autres', status: stateOf(t) })),
  ]
  const done = all.filter((d) => d.status === 'done').length
  Object.assign(coverage, {
    done, total: all.length, pct: Math.round((done / all.length) * 100),
    created: all.filter((d) => d.status !== 'planned').length,
    partial: all.filter((d) => d.status === 'partial').length,
    planned: all.filter((d) => d.status === 'planned').length,
    complete: done === all.length, // le bandeau « en construction » disparaît alors
    groups: Object.entries(all.reduce((g, d) => ((g[d.group] ||= []).push(d), g), {})),
  })
}
watch(() => state.lang, apply, { immediate: true })

// ---- Solutions : liens, badges, fiches ----
export const familyOf = (sol) =>
  families.find((f) => sol.license && f.prefixes.some((p) => sol.license.startsWith(p))) ?? families.find((f) => f.id === 'unknown')

const index = new Map(solutions.flatMap((s) => s.names.map((n) => [n, s])))
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const re = new RegExp(`(?<![\\p{L}\\d])(${[...index.keys()].sort((a, b) => b.length - a.length).map(esc).join('|')})(?![\\p{L}\\d])`, 'gu')

// Découpe un texte en morceaux ; les noms de solutions connues portent leur fiche `s`
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

export const hasDetail = (sol) => !!details[sol?.id]
export const solutionById = (id) => solutions.find((s) => s.id === id)
export const findByName = (name) => index.get(name)

// Valeur affichée pour (taille, niveau) : exception `by_size` si elle existe, sinon valeur par défaut du niveau
export function resolve(it, sizeId, levelIdx) {
  const o = it.by_size?.[sizeId]
  const raw = Array.isArray(o) ? o[levelIdx] : o?.[levels[levelIdx].id]
  if (raw == null) return { text: it.v?.[levelIdx], why: null, custom: false }
  return typeof raw === 'string' ? { text: raw, why: null, custom: true } : { text: raw.text, why: raw.why ?? null, custom: true }
}

// Où la solution est utilisée : domaine, composant, niveaux (valeurs par défaut et variantes)
export function usedIn(sol) {
  const out = []
  for (const t of tabs) for (const it of t.items ?? []) {
    const found = new Set()
    for (const s of sizes) {
      if (it.sizes && !it.sizes.includes(s.id)) continue
      levels.forEach((l, i) => { if (annotate(resolve(it, s.id, i).text).sols.includes(sol)) found.add(l.name) })
    }
    if (found.size) out.push({ domain: t, item: it.name, levels: levels.filter((l) => found.has(l.name)).map((l) => l.name) })
  }
  return out
}

// ---- Contrôles en développement : une donnée mal formée s'affiche vide ou disparaît sans erreur ----
if (import.meta.env.DEV) {
  const w = (m) => console.warn('[catalogue] ' + m)
  const ids = new Set(roadmap.domains.map((d) => d.id))
  for (const [, t] of frTabs) {
    if (!ids.has(t.id)) w(`domaine « ${t.id} » absent de roadmap.yaml : classé dans « Autres »`)
    for (const it of t.items ?? []) {
      // Coût : voir les formules en tête de shared/pricing.yaml
      const c = it.cost
      if (!c) w(`${t.id} / ${it.name} : pas de bloc cost, composant absent du budget`)
      else {
        if (!['user', 'server', 'core', 'site', 'flat'].includes(c.unit)) w(`${t.id} / ${it.name} : cost.unit « ${c.unit} » inconnu`)
        for (const k of ['setup', 'etp']) if (c[k]?.length !== 3) w(`${t.id} / ${it.name} : cost.${k} doit avoir 3 valeurs (startup, pme, grande)`)
        if (typeof c.price !== 'number') w(`${t.id} / ${it.name} : cost.price manquant`)
        if (c.from && !site.levels.some((l) => l.id === c.from)) w(`${t.id} / ${it.name} : cost.from « ${c.from} » inconnu`)
        if (c.price && !c.ref) w(`${t.id} / ${it.name} : cost.ref manquant (produit propriétaire de référence)`)
      }
      if (it.v?.length !== 5) w(`${t.id} / ${it.name} : ${it.v?.length ?? 0} valeurs dans v, 5 attendues`)
      for (const [sid, o] of Object.entries(it.by_size ?? {})) {
        if (!site.sizes.some((z) => z.id === sid)) w(`${t.id} / ${it.name} : taille « ${sid} » inconnue`)
        if (!Array.isArray(o)) for (const k of Object.keys(o ?? {})) if (!site.levels.some((l) => l.id === k)) w(`${t.id} / ${it.name} / ${sid} : niveau « ${k} » inconnu`)
      }
    }
  }
  const partial = frTabs.filter(([, t]) => t.status === 'partial').map(([, t]) => t.id)
  if (partial.length) w(`bandeau « en construction » affiché à cause de : ${partial.join(', ')}`)
  for (const d of Object.values(ficheFiles)) if (!solutions.some((s) => s.id === d.id)) console.warn(`[fiches] « ${d.id} » absent de solutions.yaml`)
}
