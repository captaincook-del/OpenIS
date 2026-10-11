<script setup>
import { ref, computed } from 'vue'
import { solutions, families, familyOf, hasDetail } from '../catalog'
import SolutionBadges from './SolutionBadges.vue'
import BadgeLegend from './BadgeLegend.vue'

const q = ref('')
const fam = ref('')
const onlyFiche = ref(false)
const nFiches = computed(() => solutions.filter(hasDetail).length)
const list = computed(() =>
  solutions
    .filter((s) => (!fam.value || familyOf(s).id === fam.value) && (!onlyFiche.value || hasDetail(s)) && s.names[0].toLowerCase().includes(q.value.toLowerCase()))
    .sort((a, b) => a.names[0].localeCompare(b.names[0])),
)
const input = 'px-3 py-2 rounded-md border border-line bg-white focusable'
</script>

<template>
  <main class="max-w-6xl mx-auto px-5 py-8">
    <h1 class="font-display font-800 text-4xl md:text-5xl">Les {{ solutions.length }} solutions citées</h1>
    <p class="mt-3 text-mute max-w-2xl">Un nom mène à sa fiche quand elle existe (étiquette « Fiche »), sinon au site du projet. Le badge indique la licence ; un contour noir signale un label vérifié.</p>
    <div class="mt-6 flex flex-wrap gap-3">
      <label class="sr-only" for="q">Rechercher</label>
      <input id="q" v-model="q" type="search" placeholder="Rechercher une solution" :class="input" />
      <label class="sr-only" for="fam">Famille de licence</label>
      <select id="fam" v-model="fam" :class="input"><option value="">Toutes les licences</option><option v-for="f in families" :key="f.id" :value="f.id">{{ f.name }}</option></select>
      <label class="flex items-center gap-2 text-sm cursor-pointer"><input v-model="onlyFiche" type="checkbox" class="focusable" />Avec fiche ({{ nFiches }})</label>
    </div>
    <ul class="mt-6 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3 border-t border-line">
      <li v-for="s in list" :key="s.id" class="py-2.5 border-b border-line flex flex-wrap items-center justify-between gap-2">
        <span>
          <RouterLink v-if="hasDetail(s)" :to="`/solutions/${s.id}`" class="font-600 underline underline-offset-4 focusable">{{ s.names[0] }}<span class="sr-only"> (fiche)</span></RouterLink>
          <a v-else :href="s.url" target="_blank" rel="noopener noreferrer" class="font-600 underline underline-offset-4 focusable">{{ s.names[0] }}<span class="sr-only"> (nouvel onglet)</span></a>
          <span v-if="hasDetail(s)" class="ml-2 text-xs px-1.5 py-0.5 rounded bg-brandsoft text-ink font-600">Fiche</span>
        </span>
        <SolutionBadges :sol="s" />
      </li>
      <li v-if="!list.length" class="py-6 md:col-span-2 lg:col-span-3 text-mute">Aucune solution ne correspond. Effacez un filtre pour élargir la recherche.</li>
    </ul>
    <BadgeLegend class="mt-8" />
  </main>
</template>
