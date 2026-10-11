<script setup>
import { ref, computed, toRefs } from 'vue'
import { levels, sizes, tabs, coverage, resolve } from '../catalog'
import { state } from '../store'
import SolutionText from './SolutionText.vue'
import BadgeLegend from './BadgeLegend.vue'

const { sizeId, levelIdx } = toRefs(state)
const tabId = ref(tabs[0].id)
const size = computed(() => sizes.find((s) => s.id === sizeId.value))
const level = computed(() => levels[levelIdx.value])
const tab = computed(() => tabs.find((t) => t.id === tabId.value))
const visible = (t) => t.items.filter((i) => !i.sizes || i.sizes.includes(sizeId.value))
// Chaque composant avec sa valeur pour (taille, niveau) : variante par taille si elle existe, sinon valeur du niveau
const rows = computed(() => visible(tab.value).map((it) => ({ it, r: resolve(it, sizeId.value, levelIdx.value) })))
const total = computed(() => tabs.reduce((n, t) => n + visible(t).length, 0))
const groups = computed(() => coverage.groups.map(([g]) => [g, tabs.filter((t) => t.group === g)]).filter(([, l]) => l.length))

// Bouton radio : l'input reste accessible, le span porte le visuel.
// Sélectionné = teinte douce + contour de couleur + coche ; sélectionnable = blanc, contour visible.
const pill = (on) =>
  'flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 text-sm text-ink cursor-pointer select-none transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 ' +
  (on ? 'font-700' : 'font-500 bg-white border-edge hover:border-brand hover:bg-brandsoft/50')
const tint = (on, c) => (on ? { background: `color-mix(in srgb, ${c} 16%, white)`, borderColor: c } : {})
const BRAND = '#2F5D50'
</script>

<template>
  <div :style="{ '--lv': level.color }">
    <header class="max-w-6xl mx-auto px-5 pt-8 pb-6">
      <h1 class="font-display font-800 text-4xl md:text-6xl leading-[0.98] max-w-4xl">
        Un système d'information complet, sans enfermement.
      </h1>
      <p class="mt-4 text-lg text-mute max-w-2xl leading-relaxed">
        Choisissez la taille et le niveau d'exigence : la pile libre correspondante s'affiche, de la virtualisation jusqu'au poste de chaque utilisateur.
      </p>
    </header>

    <!-- Barre de choix, collée en haut pour ne jamais faire remonter la page -->
    <div class="md:sticky top-0 z-10 bg-paper/95 backdrop-blur border-y border-line">
      <div class="max-w-6xl mx-auto px-5 py-3 grid gap-3 lg:grid-cols-[auto_1fr] lg:gap-8 lg:items-end">
        <fieldset>
          <legend class="text-sm font-600 text-mute mb-1">Taille de l'organisation</legend>
          <div class="flex flex-wrap gap-2">
            <label v-for="s in sizes" :key="s.id">
              <input v-model="sizeId" type="radio" name="size" :value="s.id" class="peer sr-only" />
              <span :class="pill(sizeId === s.id)" :style="tint(sizeId === s.id, BRAND)"><span v-if="sizeId === s.id" aria-hidden="true">✓</span>{{ s.name }}</span>
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend class="text-sm font-600 text-mute mb-1">Niveau d'exigence</legend>
          <div class="flex flex-wrap gap-2">
            <label v-for="(l, i) in levels" :key="l.id">
              <input v-model="levelIdx" type="radio" name="level" :value="i" class="peer sr-only" />
              <span :class="pill(levelIdx === i)" :style="tint(levelIdx === i, l.color)"><span v-if="levelIdx === i" aria-hidden="true">✓</span>{{ l.name }}</span>
            </label>
          </div>
        </fieldset>
      </div>
      <p class="max-w-6xl mx-auto px-5 pb-2 text-sm text-mute">
        {{ level.pitch }} · {{ size.users }} utilisateurs, {{ size.hosts }} ·
        <RouterLink to="/budget" class="underline focusable">Voir le budget</RouterLink>
      </p>
    </div>

    <main class="max-w-6xl mx-auto px-5 py-8 grid gap-6 md:grid-cols-[250px_1fr]">
      <nav aria-label="Domaines" class="flex md:block gap-4 overflow-x-auto md:overflow-y-auto md:sticky md:top-36 md:self-start md:max-h-[calc(100vh-10rem)] pb-2">
        <div v-for="[group, list] in groups" :key="group" class="flex md:block gap-2 md:mb-5 shrink-0">
          <h2 class="hidden md:block text-sm font-600 text-mute mb-1.5">{{ group }}</h2>
          <button v-for="t in list" :key="t.id" :aria-current="tabId === t.id"
            class="focusable shrink-0 md:w-full flex items-center justify-between gap-3 text-left px-3 py-2 rounded-md border-l-4 mb-0 md:mb-1 transition-colors text-sm text-ink cursor-pointer"
            :class="tabId === t.id ? 'bg-white font-700 shadow-sm' : 'border-transparent font-500 hover:bg-white/70'"
            :style="tabId === t.id ? { borderLeftColor: level.color } : {}" @click="tabId = t.id">
            <span>{{ t.name }}</span>
            <!-- Domaine encore en cours d'enrichissement : indication discrète -->
            <span v-if="t.status === 'partial'" class="text-xs font-400 text-mute" title="Domaine en cours d'enrichissement">en cours</span>
          </button>
        </div>
        <p class="hidden md:block text-sm text-mute">{{ total }} composants pour « {{ size.name }} ».</p>
      </nav>

      <section :aria-label="tab.name" class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="font-display font-800 text-3xl mr-2">{{ tab.name }}</h2>
          <span class="chip" :style="{ borderColor: level.color }">{{ level.name }}</span>
          <span class="chip">{{ size.name }}</span>
          <span v-if="tab.status === 'partial'" class="chip border-dashed text-mute" title="De nouveaux composants seront ajoutés">En cours d'enrichissement</span>
        </div>
        <p class="mt-2 text-mute">{{ tab.intro }} <span class="text-ink">{{ tab.sizing?.[sizeId] }}</span></p>

        <ul class="mt-5 divide-y divide-line border-y border-line">
          <li v-for="{ it, r } in rows" :key="it.name" class="py-3 grid gap-1 md:grid-cols-[190px_1fr] md:gap-5">
            <div>
              <h3 class="font-600">{{ it.name }}</h3>
              <p class="text-sm text-mute">{{ it.role }}</p>
            </div>
            <div>
              <SolutionText :text="r.text ?? '—'" :color="level.color" />
              <!-- Variante propre à cette taille : on dit pourquoi la réponse n'est pas la même -->
              <p v-if="r.custom" class="mt-2 text-sm">
                <span class="mr-2 px-1.5 py-0.5 rounded bg-brandsoft text-xs font-600">Variante {{ size.name }}</span>
                <span v-if="r.why" class="text-mute">{{ r.why }}</span>
              </p>
            </div>
          </li>
        </ul>

        <details class="mt-5">
          <summary class="cursor-pointer font-600 text-sm focusable">Légende des badges</summary>
          <BadgeLegend class="mt-3" />
        </details>
      </section>
    </main>
  </div>
</template>