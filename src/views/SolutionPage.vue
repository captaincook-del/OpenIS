<script setup>
import { computed } from 'vue'
import { details, hasDetail, solutionById, usedIn } from '../catalog'
import SolutionBadges from './SolutionBadges.vue'

const props = defineProps({ id: String })
const sol = computed(() => solutionById(props.id))
const d = computed(() => details[props.id])
const uses = computed(() => (sol.value ? usedIn(sol.value) : []))
const h2 = 'font-display font-700 text-2xl mt-10'
const altTarget = (a) => (a.id && hasDetail(solutionById(a.id)) ? { to: `/solutions/${a.id}` } : a.url ? { href: a.url } : a.id && solutionById(a.id) ? { href: solutionById(a.id).url } : null)
</script>

<template>
  <main class="max-w-3xl mx-auto px-5 py-8">
    <RouterLink to="/solutions" class="text-sm underline focusable">← Toutes les solutions</RouterLink>

    <template v-if="sol && d">
      <h1 class="mt-4 font-display font-800 text-4xl md:text-5xl">{{ sol.names[0] }}</h1>
      <div class="mt-3 flex flex-wrap items-center gap-3">
        <SolutionBadges :sol="sol" />
        <a :href="sol.url" target="_blank" rel="noopener noreferrer" class="underline focusable">Site du projet<span class="sr-only"> (nouvel onglet)</span></a>
      </div>
      <p class="mt-5 text-lg leading-relaxed">{{ d.summary }}</p>

      <h2 :class="h2">Pourquoi celle-ci</h2>
      <ul class="mt-3 grid gap-2 list-disc pl-5 leading-relaxed"><li v-for="w in d.why" :key="w">{{ w }}</li></ul>

      <h2 :class="h2">Pourquoi pas une autre</h2>
      <ul class="mt-3 grid gap-3">
        <li v-for="a in d.alternatives" :key="a.name" class="p-4 rounded-lg bg-white/70">
          <h3 class="font-600">
            <RouterLink v-if="altTarget(a)?.to" :to="altTarget(a).to" class="underline focusable">{{ a.name }}</RouterLink>
            <a v-else-if="altTarget(a)?.href" :href="altTarget(a).href" target="_blank" rel="noopener noreferrer" class="underline focusable">{{ a.name }}<span class="sr-only"> (nouvel onglet)</span></a>
            <template v-else>{{ a.name }}</template>
          </h3>
          <p class="mt-1 leading-relaxed">{{ a.verdict }}</p>
        </li>
      </ul>

      <template v-if="d.limits?.length">
        <h2 :class="h2">Limites à connaître</h2>
        <ul class="mt-3 grid gap-2 list-disc pl-5 leading-relaxed"><li v-for="l in d.limits" :key="l">{{ l }}</li></ul>
      </template>

      <template v-if="d.when_not">
        <h2 :class="h2">Quand choisir autre chose</h2>
        <p class="mt-3 leading-relaxed">{{ d.when_not }}</p>
      </template>

      <template v-if="uses.length">
        <h2 :class="h2">Où elle apparaît dans le catalogue</h2>
        <ul class="mt-3 divide-y divide-line border-y border-line">
          <li v-for="u in uses" :key="u.domain.id + u.item" class="py-2 text-sm">
            <b>{{ u.domain.name }}</b> · {{ u.item }} <span class="text-mute">— {{ u.levels.join(', ') }}</span>
          </li>
        </ul>
      </template>

      <template v-if="d.sources?.length">
        <h2 :class="h2">Sources</h2>
        <ul class="mt-3 grid gap-1"><li v-for="s in d.sources" :key="s.url">
          <a :href="s.url" target="_blank" rel="noopener noreferrer" class="underline focusable">{{ s.label }}<span class="sr-only"> (nouvel onglet)</span></a></li></ul>
      </template>
      <p v-if="d.updated" class="mt-8 text-sm text-mute">Fiche mise à jour en {{ d.updated }}. Licences et fonctions évoluent : vérifiez auprès du projet.</p>
    </template>

    <template v-else>
      <h1 class="mt-4 font-display font-800 text-3xl">Pas encore de fiche pour cette solution</h1>
      <p class="mt-3 text-mute">Une fiche s'affiche dès qu'un fichier <code>src/data/solutions/{{ id }}.yaml</code> existe.</p>
      <a v-if="sol" :href="sol.url" target="_blank" rel="noopener noreferrer" class="mt-4 inline-block underline focusable">Voir le site du projet<span class="sr-only"> (nouvel onglet)</span></a>
    </template>
  </main>
</template>
