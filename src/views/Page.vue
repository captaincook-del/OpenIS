<script setup>
import { computed } from 'vue'
import { pages, coverage, levels } from '../lib/catalog'
import { t, tg } from '../lib/i18n'
import RichText from '../components/RichText.vue'

const props = defineProps({ pageKey: String })
const page = computed(() => pages[props.pageKey])
// Une section `roadmap: true` part dans la colonne de droite avec l'avancement ; les autres deviennent des cartes
const side = computed(() => page.value.sections.find((s) => s.roadmap))
const main = computed(() => page.value.sections.filter((s) => !s.roadmap))
const label = (s) => t(s === 'done' ? 'pg.done' : s === 'partial' ? 'pg.partial' : 'pg.planned')
const chip = (s) => 'px-2.5 py-1 rounded-lg text-[13px] border-[1.5px] ' +
  (s === 'done' ? 'bg-brandsoft border-brand font-600' : s === 'partial' ? 'bg-white border-brand border-dashed' : 'border-line text-mute')
</script>

<template>
  <main class="wrap pt-6 md:pt-10 pb-4 md:pb-16 flex flex-wrap gap-x-14 gap-y-8 items-start">
    <article class="flex-[999_1_560px] min-w-0">
      <h1 class="h-page">{{ page.title }}</h1>
      <p v-if="!pages.translated" class="mt-2 mb-0 text-sm text-mute">{{ t('home.untranslated') }}</p>
      <div class="mt-6 md:mt-8 grid gap-3 md:gap-4 md:grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))]">
        <section v-for="s in main" :key="s.h" :class="['p-4 md:p-[22px] card', s.levels || s.p.length > 2 || s.p.some((b) => b.quote) ? 'md:col-span-full' : '']">
          <h2 class="m-0 font-display font-700 text-xl md:text-[22px]">{{ s.h }}</h2>
          <template v-for="(b, i) in s.p" :key="i">
            <!-- Bloc cité : adresses, extraits de loi. Une ligne par entrée -->
            <blockquote v-if="b.quote" class="mt-3 mx-0 pl-4 border-l-4 border-brand/40 leading-relaxed max-w-[760px]">
              <p v-for="(l, j) in b.quote" :key="j" class="m-0"><RichText :text="l" /></p>
            </blockquote>
            <p v-else class="mt-2.5 mb-0 leading-relaxed max-w-[760px]"><RichText :text="b" /></p>
          </template>
          <ol v-if="s.levels" class="mt-4.5 mb-0 p-0 list-none grid gap-2.5 grid-cols-[repeat(auto-fit,minmax(170px,1fr))]">
            <li v-for="(l, i) in levels" :key="l.id" class="flex flex-col gap-1 p-3.5 rounded-[10px] border border-line border-t-4" :style="{ borderTopColor: l.color }">
              <span class="text-xs text-mute">{{ t('pg.level', { n: i + 1 }) }}</span>
              <span class="font-700">{{ l.name }}</span>
              <span class="text-sm text-mute leading-snug">{{ l.pitch }}</span>
            </li>
          </ol>
        </section>
      </div>
    </article>

    <aside v-if="side" aria-labelledby="state" class="flex-[1_1_380px] md:max-w-[520px] p-4 md:p-6 card">
      <h2 id="state" class="m-0 font-display font-700 text-[22px] md:text-2xl">{{ side.h }}</h2>
      <p class="mt-2.5 mb-0 font-600">{{ t('pg.stat', { done: coverage.done, total: coverage.total, pct: coverage.pct }) }}</p>
      <span role="progressbar" :aria-label="t('banner.aria')" :aria-valuenow="coverage.pct" aria-valuemin="0" aria-valuemax="100"
        class="mt-2.5 block h-2.5 rounded-full bg-paper overflow-hidden"><span class="block h-full bg-brand" :style="{ width: coverage.pct + '%' }" /></span>
      <p class="mt-3 mb-0 flex flex-wrap gap-3.5 text-[13px] text-mute">
        <span class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded bg-brandsoft border-[1.5px] border-brand" />{{ t('pg.done') }}</span>
        <span class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded border-[1.5px] border-dashed border-brand" />{{ t('pg.partial') }}</span>
        <span class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded border-[1.5px] border-line" />{{ t('pg.planned') }}</span>
      </p>
      <p v-for="(b, i) in side.p" :key="i" class="mt-3 mb-0 text-sm text-mute leading-relaxed"><RichText :text="b" /></p>
      <div v-for="[group, list] in coverage.groups" :key="group" class="mt-4.5">
        <h3 class="m-0 text-sm font-700">{{ tg(group) }}</h3>
        <ul class="mt-2 mb-0 p-0 list-none flex flex-wrap gap-1.5">
          <li v-for="d in list" :key="d.id" :class="chip(d.status)">{{ d.name }}<span class="sr-only"> ({{ label(d.status) }})</span></li>
        </ul>
      </div>
    </aside>
  </main>
</template>
