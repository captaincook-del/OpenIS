import { computed } from 'vue'
import { levels, tabs, pricing } from './catalog'
import { state } from './store'

// Calcul du budget, partagé entre la page Budget et le résumé du catalogue.
// Chaque composant porte son coût dans `cost` (voir les formules en tête de shared/pricing.yaml).
const SIZE_IDX = { startup: 0, pme: 1, grande: 2 }
const UNIT = { user: 'users', server: 'servers', core: 'cores', site: 'sites' }

export const eur = (v) =>
  new Intl.NumberFormat(state.lang === 'en' ? 'en-GB' : 'fr-FR', { style: 'currency', currency: pricing.currency, maximumFractionDigits: 0 }).format(v)

// Composants visibles pour la taille choisie, par domaine
export const visible = computed(() => tabs.map((t) => ({ t, items: (t.items ?? []).filter((i) => !i.sizes || i.sizes.includes(state.sizeId)) })))

// Coût d'un composant au niveau i : mise en place, coûts annuels libre et propriétaire, temps d'administration
function item(c, i) {
  const size = pricing.sizes[state.sizeId], s = SIZE_IDX[state.sizeId], L = pricing.levels
  const qty = c.unit === 'flat' ? 1 : size[UNIT[c.unit]]
  const etp = c.etp[s] * L.etp[i]
  const setup = c.setup[s] * L.setup[i]
  const bought = c.price && i >= Math.max(0, levels.findIndex((l) => l.id === c.from))
  const licence = bought ? Math.max((c.min ?? 0) * size.min_factor, qty * c.price * size.price_factor) * L.proprietary[i] : 0
  return {
    setup, etp,
    run: qty * (c.support ?? 0) * L.support[i] + etp * pricing.etp_cost,
    propSetup: setup * pricing.share.setup,
    propRun: licence + etp * pricing.share.etp * pricing.etp_cost,
  }
}

export function sum(items, i) {
  let capex = 0, run = 0, propSetup = 0, propRun = 0, etp = 0
  for (const it of items) {
    if (!it.cost?.unit) continue
    const c = item(it.cost, i)
    capex += c.setup; run += c.run; propSetup += c.propSetup; propRun += c.propRun; etp += c.etp
  }
  const years = pricing.horizon_years
  const libre = capex + years * run
  const prop = propSetup + years * propRun
  return { capex, run, etp, libre, prop, gain: prop - libre }
}

// Une ligne par niveau, pour la taille choisie
export const byLevel = computed(() => levels.map((l, i) => ({ l, i, ...sum(visible.value.flatMap((d) => d.items), i) })))
// Niveau choisi
export const current = computed(() => byLevel.value[state.levelIdx])
