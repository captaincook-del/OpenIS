<script setup>
import { computed } from 'vue'
import { annotate, hasDetail } from '../catalog'
import SolutionBadges from './SolutionBadges.vue'

const props = defineProps({ text: String, color: String })
const a = computed(() => annotate(props.text))
const base = 'underline underline-offset-4 decoration-2 focusable'
// Fiche = lien plein, en gras, qui reste sur le site ; site du projet = lien pointillé avec ↗, nouvel onglet
const ficheClass = base + ' font-700'
const siteClass = base + ' decoration-dotted'
</script>

<template>
  <div>
    <p class="text-lg font-500">
      <template v-for="(p, i) in a.parts" :key="i">
        <RouterLink v-if="p.s && hasDetail(p.s)" :to="`/solutions/${p.s.id}`" :class="ficheClass" :style="{ textDecorationColor: color }">{{ p.t }}<span class="sr-only"> (fiche de la solution)</span></RouterLink>
        <a v-else-if="p.s" :href="p.s.url" target="_blank" rel="noopener noreferrer" :class="siteClass" :style="{ textDecorationColor: color }">{{ p.t }}<span aria-hidden="true" class="text-sm"> ↗</span><span class="sr-only"> (site du projet, nouvel onglet)</span></a>
        <template v-else>{{ p.t }}</template>
      </template>
    </p>
    <ul v-if="a.sols.length" class="mt-2 flex flex-wrap gap-x-5 gap-y-1">
      <li v-for="s in a.sols" :key="s.id" class="flex flex-wrap items-center gap-2 text-sm">
        <!-- Le nom mène à la fiche quand elle existe, sinon au site du projet -->
        <RouterLink v-if="hasDetail(s)" :to="`/solutions/${s.id}`" class="font-600 underline underline-offset-2 focusable">{{ s.names[0] }}<span class="sr-only"> (fiche)</span></RouterLink>
        <a v-else :href="s.url" target="_blank" rel="noopener noreferrer" class="text-mute underline decoration-dotted underline-offset-2 focusable">{{ s.names[0] }} <span aria-hidden="true">↗</span><span class="sr-only"> (site du projet, nouvel onglet)</span></a>
        <SolutionBadges :sol="s" />
        <a v-if="hasDetail(s)" :href="s.url" target="_blank" rel="noopener noreferrer" class="text-xs text-mute underline decoration-dotted focusable">Site ↗<span class="sr-only"> du projet (nouvel onglet)</span></a>
      </li>
    </ul>
  </div>
</template>