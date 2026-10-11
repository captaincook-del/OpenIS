<script setup>
import { coverage, repoUrl } from './catalog'
const nav = [
  ['/', 'Catalogue'], ['/solutions', 'Solutions'], ['/budget', 'Budget'], ['/a-propos', 'À propos'], ['/contact', 'Contact'],
]
// Focus visible sur fond vert : anneau clair
const ring = 'outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-brand rounded-sm'
</script>

<template>
  <div class="min-h-screen bg-paper text-ink font-sans flex flex-col">
    <!-- En-tête : un seul bloc vert, texte clair. Le bandeau d'avancement n'apparaît que tant que le catalogue n'est pas complet -->
    <div class="bg-brand text-paper">
      <div v-if="!coverage.complete" class="border-b border-paper/20 text-sm">
        <div class="max-w-6xl mx-auto px-5 py-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>Catalogue en construction : {{ coverage.done }} domaines terminés sur {{ coverage.total }} ({{ coverage.pct }} %)</span>
          <span class="h-1.5 w-32 rounded-full bg-paper/25 overflow-hidden" role="progressbar" :aria-valuenow="coverage.pct" aria-valuemin="0" aria-valuemax="100">
            <span class="block h-full bg-paper" :style="{ width: coverage.pct + '%' }" />
          </span>
        </div>
      </div>

      <header class="max-w-6xl w-full mx-auto px-5 py-4 flex flex-wrap items-center justify-between gap-3">
        <RouterLink to="/" :class="ring + ' font-display font-800 text-xl text-paper'">Mon SI Libre</RouterLink>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <nav aria-label="Navigation principale" class="flex flex-wrap gap-x-5 gap-y-1">
            <RouterLink v-for="[to, label] in nav" :key="to" :to="to"
              :class="ring + ' py-1 border-b-2 border-transparent text-paper/90 hover:text-paper hover:border-paper/60'"
              active-class="!border-paper !text-paper font-600" exact-active-class="!border-paper !text-paper font-600">{{ label }}</RouterLink>
          </nav>
          <a v-if="repoUrl" :href="repoUrl" target="_blank" rel="noopener noreferrer" :class="ring + ' text-paper/90 hover:text-paper'"
            aria-label="Code source du site sur GitHub (nouvel onglet)" title="Code source sur GitHub">
            <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
      </header>
    </div>

    <div class="flex-1"><RouterView /></div>

    <footer class="max-w-6xl w-full mx-auto px-5 py-8 mt-10 text-sm text-mute border-t border-line flex flex-wrap justify-between gap-3">
      <span>Site vitrine. Toutes les briques citées sont des logiciels libres ou ouverts.</span>
      <span class="flex gap-4">
        <a v-if="repoUrl" :href="repoUrl" target="_blank" rel="noopener noreferrer" class="underline focusable">Code source<span class="sr-only"> (nouvel onglet)</span></a>
        <RouterLink to="/mentions-legales" class="underline focusable">Mentions légales</RouterLink>
      </span>
    </footer>
  </div>
</template>