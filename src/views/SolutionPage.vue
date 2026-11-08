<script setup>
import { t } from '../lib/i18n'
import { computed } from 'vue'
import { details, hasDetail, solutionById, findByName, usedIn, pages, levels } from '../lib/catalog'
import SolutionBadges from '../components/SolutionBadges.vue'
import Icon from '../components/Icon.vue'

const props = defineProps({ id: String })
const sol = computed(() => solutionById(props.id))
const d = computed(() => details[props.id])
const uses = computed(() => (sol.value ? usedIn(sol.value) : []))
// Une alternative mène à sa fiche si elle existe (retrouvée par `id` ou par son nom), sinon à son site
const altTarget = (a) => {
  const s = (a.id && solutionById(a.id)) || findByName(a.name)
  if (s) return hasDetail(s) ? { to: `/solutions/${s.id}` } : { href: a.url ?? s.url }
  return a.url ? { href: a.url } : null
}
// Sommaire : seulement les sections présentes. Routeur en mode hash : on fait défiler plutôt que de suivre une ancre
const toc = computed(() => [
  ['why', 'sp.why', 'sp.short.why', d.value?.why?.length],
  ['alt', 'sp.alt', 'sp.short.alt', d.value?.alternatives?.length],
  ['lim', 'sp.limits', 'sp.short.limits', d.value?.limits?.length],
  ['not', 'sp.whennot', 'sp.short.whennot', d.value?.when_not],
  ['use', 'sp.used', 'sp.short.used', uses.value.length],
  ['src', 'sp.sources', 'sp.sources', d.value?.sources?.length],
].filter((x) => x[3]))
const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
const colorOf = (name) => levels.find((l) => l.name === name)?.color
const h2 = 'm-0 font-display font-700 text-2xl md:text-[28px]'
</script>

<template>
  <main v-if="sol && d">
    <!-- En-tête de la fiche -->
    <div class="bg-white md:bg-transparent border-b border-line md:border-0">
      <div class="wrap pt-6 md:pt-7 pb-5 md:pb-0">
        <nav :aria-label="t('sp.crumb')" class="hidden md:flex gap-2 text-sm text-mute">
          <RouterLink to="/solutions" class="underline focusable">{{ t('nav.solutions') }}</RouterLink><span aria-hidden="true">/</span>
          <span aria-current="page" class="text-ink font-600">{{ sol.names[0] }}</span>
        </nav>
        <div class="md:(mt-4 pb-7 border-b border-line) flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
          <div class="flex-[1_1_560px] min-w-0">
            <h1 class="m-0 font-display font-800 text-[38px] md:text-[clamp(40px,4.4vw,68px)] leading-none">{{ sol.names[0] }}</h1>
            <div class="md:hidden mt-3"><SolutionBadges :sol="sol" family /></div>
            <p class="mt-3.5 md:mt-4 mb-0 text-[17px] md:text-xl leading-normal max-w-[860px]">{{ d.summary }}</p>
            <p v-if="!d.translated" class="mt-2 mb-0 text-sm text-mute">{{ t('sp.untranslated') }}</p>
          </div>
          <div class="w-full md:w-auto flex flex-wrap gap-2.5 items-center">
            <span class="hidden md:inline-flex"><SolutionBadges :sol="sol" family /></span>
            <a :href="sol.url" target="_blank" rel="noopener noreferrer"
              class="focusable w-full md:w-auto flex items-center justify-center gap-2 min-h-12 md:min-h-11 px-4.5 rounded-[10px] bg-brand !text-paper font-700 no-underline hover:opacity-90">
              {{ t('sp.site') }}<Icon name="ext" :size="16" /><span class="sr-only"> {{ t('a11y.newtab') }}</span></a>
          </div>
        </div>
      </div>
    </div>

    <!-- Téléphone : sommaire en pastilles -->
    <nav :aria-label="t('sp.toc')" class="md:hidden flex gap-2 overflow-x-auto px-4 py-3 border-b border-line">
      <button v-for="([id, , short], i) in toc" :key="id" type="button" @click="jump(id)"
        :class="['focusable shrink-0 min-h-10 px-3.5 rounded-full text-sm cursor-pointer', i === 0 ? 'bg-brand text-paper font-700' : 'border border-edge bg-white']">{{ t(short) }}</button>
    </nav>

    <div class="wrap pt-2 md:pt-8 pb-4 md:pb-16 flex flex-wrap gap-10 items-start">
      <nav :aria-label="t('sp.toc')" class="hidden lg:flex flex-[1_1_200px] max-w-[220px] flex-col gap-0.5 text-[15px] sticky top-4">
        <p class="eyebrow mt-0 mb-2">{{ t('sp.tocshort') }}</p>
        <button v-for="([id, label], i) in toc" :key="id" type="button" @click="jump(id)"
          :class="['focusable text-left px-3 py-2 border-l-3 rounded-r-lg cursor-pointer hover:bg-white', i === 0 ? 'border-brand bg-white font-700' : 'border-transparent']">{{ t(label) }}</button>
      </nav>

      <article class="flex-[999_1_560px] min-w-0 max-w-[920px]">
        <template v-if="d.why?.length">
          <h2 id="why" :class="h2 + ' mt-5 md:mt-0'">{{ t('sp.why') }}</h2>
          <ul class="mt-3 md:mt-4 mb-0 pl-5 md:p-0 md:list-none flex flex-col md:grid md:grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-2.5 md:gap-3 leading-relaxed">
            <li v-for="w in d.why" :key="w" class="md:(p-4.5 bg-white border border-line rounded-xl)">{{ w }}</li>
          </ul>
        </template>

        <template v-if="d.alternatives?.length">
          <h2 id="alt" :class="h2 + ' mt-8 md:mt-11'">{{ t('sp.alt') }}</h2>
          <div class="mt-3 md:mt-4 flex flex-col gap-2 md:gap-3">
            <div v-for="a in d.alternatives" :key="a.name" class="p-4 md:p-5 card !rounded-xl grid gap-1.5 md:gap-5 md:grid-cols-[minmax(160px,220px)_minmax(0,1fr)]">
              <h3 class="m-0 text-[17px]">
                <RouterLink v-if="altTarget(a)?.to" :to="altTarget(a).to" class="underline focusable">{{ a.name }}</RouterLink>
                <a v-else-if="altTarget(a)?.href" :href="altTarget(a).href" target="_blank" rel="noopener noreferrer" class="underline focusable">{{ a.name }}<span class="sr-only"> {{ t('a11y.newtab') }}</span></a>
                <template v-else>{{ a.name }}</template>
                <span v-if="altTarget(a)" class="block mt-1 md:mt-1.5 text-[13px] font-500 text-mute">{{ altTarget(a).to ? t('sp.altfiche') : t('sp.altsite') }}</span>
              </h3>
              <p class="m-0 leading-relaxed text-[15px] md:text-base">{{ a.verdict }}</p>
            </div>
          </div>
        </template>

        <div v-if="d.limits?.length || d.when_not" class="mt-8 md:mt-11 grid gap-8 md:grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))]">
          <section v-if="d.limits?.length">
            <h2 id="lim" :class="h2">{{ t('sp.limits') }}</h2>
            <ul class="mt-3 md:mt-3.5 mb-0 pl-5 flex flex-col gap-2 leading-relaxed"><li v-for="l in d.limits" :key="l">{{ l }}</li></ul>
          </section>
          <section v-if="d.when_not">
            <h2 id="not" :class="h2">{{ t('sp.whennot') }}</h2>
            <p class="mt-3 md:mt-3.5 mb-0 leading-relaxed">{{ d.when_not }}</p>
          </section>
        </div>

        <template v-if="d.sources?.length">
          <h2 id="src" :class="h2 + ' mt-8 md:mt-11'">{{ t('sp.sources') }}</h2>
          <ul class="mt-3 mb-0 pl-5"><li v-for="s in d.sources" :key="s.url">
            <a :href="s.url" target="_blank" rel="noopener noreferrer" class="inline-flex items-center min-h-11 md:min-h-0 underline focusable">{{ s.label }}</a> <span class="text-mute">{{ t('a11y.newtab') }}</span></li></ul>
        </template>
        <p v-if="d.updated" class="mt-4 md:mt-7 mb-0 text-[13px] md:text-sm text-mute leading-normal">{{ t('sp.updated', { date: d.updated }) }}</p>
      </article>

      <aside :aria-label="t('sp.used')" class="flex-[1_1_300px] lg:max-w-[360px] w-full flex flex-col gap-4">
        <section v-if="uses.length" id="use" class="p-4 md:p-5 card">
          <h2 class="m-0 text-base md:text-[15px] font-700">{{ t('sp.used') }}</h2>
          <div v-for="u in uses" :key="u.domain.id + u.item" class="mt-3.5 pt-3.5 border-t border-rule">
            <p class="m-0 font-600">{{ u.domain.name }} · {{ u.item }}</p>
            <div class="mt-2.5 flex flex-wrap gap-1.5">
              <span v-for="l in u.levels" :key="l" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-line bg-white text-[13px]">
                <span class="w-2 h-2 rounded-full" :style="{ background: colorOf(l) }" />{{ l }}</span>
            </div>
          </div>
        </section>
        <div class="p-4 md:p-5 rounded-[14px] bg-brandsoft text-sm leading-normal">
          <p class="m-0">{{ pages.disclaimer }}</p>
          <RouterLink to="/contact" class="mt-2.5 inline-block font-700 underline focusable">{{ t('sp.report') }}</RouterLink>
        </div>
      </aside>
    </div>
  </main>

  <main v-else class="wrap pt-6 md:pt-10 pb-16">
    <RouterLink to="/solutions" class="text-sm underline focusable">{{ t('sp.back') }}</RouterLink>
    <h1 class="mt-4 h-page !text-3xl">{{ t('sp.nopage') }}</h1>
    <p class="mt-3 text-mute">{{ t('sp.nopage2', { id }) }}</p>
    <a v-if="sol" :href="sol.url" target="_blank" rel="noopener noreferrer" class="mt-4 inline-block underline focusable">{{ t('sp.visit') }}<span class="sr-only"> {{ t('a11y.newtab') }}</span></a>
  </main>
</template>
