<script setup>
import { computed, ref } from 'vue'
import { pages, coverage, levels } from '../lib/catalog'
import { t, tg } from '../lib/i18n'
import RichText from '../components/RichText.vue'
import Icon from '../components/Icon.vue'

// À propos sur une colonne : le projet, l'échelle des niveaux, l'avancement par groupe
const page = computed(() => pages.about)
const levelSec = computed(() => page.value.sections.find((s) => s.levels))
const roadmapSec = computed(() => page.value.sections.find((s) => s.roadmap))
// Les autres sections (« Notre idée », « Pour qui ») : la première occupe toute la largeur
const intro = computed(() => page.value.sections.filter((s) => !s.levels && !s.roadmap))

const STATUSES = ['done', 'partial', 'planned']
const count = (list, k) => list.filter((d) => d.status === k).length
const summary = (list) => STATUSES.map((k) => [k, count(list, k)]).filter(([, n]) => n).map(([k, n]) => t('pg.n.' + k, { n })).join(' · ')
const share = (list, k) => (100 * count(list, k)) / list.length + '%'
const all = computed(() => coverage.groups.flatMap(([, l]) => l))
const chip = (s) => 'px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg text-[13px] md:text-sm border-[1.5px] ' +
  (s === 'done' ? 'bg-brandsoft border-brand font-600' : s === 'partial' ? 'bg-white border-brand border-dashed' : 'bg-white border-line text-mute')

// Groupe affiché dans le panneau : par défaut le premier qui n'est pas terminé
const picked = ref(null)
const groupIdx = computed(() => picked.value ?? Math.max(0, coverage.groups.findIndex(([, l]) => l.some((d) => d.status !== 'done'))))
const group = computed(() => coverage.groups[groupIdx.value])
// Échelle : la marche de chaque niveau monte de gauche à droite
const stepH = (i) => `${28 + i * 22}px`
const tint = (c, p) => `color-mix(in srgb, ${c} ${p}%, white)`
</script>

<template>
  <main class="wrap pb-4 md:pb-16">
    <!-- Le projet -->
    <section class="pt-6 md:pt-11 pb-7 md:pb-10 grid gap-x-16 gap-y-5 md:gap-y-8 lg:grid-cols-2 items-start">
      <div>
        <h1 class="h-page">{{ page.title }}</h1>
        <p v-if="!pages.translated" class="mt-2 mb-0 text-sm text-mute">{{ t('home.untranslated') }}</p>
        <p v-if="page.lead" class="mt-3 md:mt-4.5 mb-0 text-lg md:text-[22px] leading-normal md:leading-[1.45] max-w-[720px]">{{ page.lead }}</p>
      </div>
      <dl class="m-0 grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2 gap-2.5 md:gap-3">
        <div v-for="(s, i) in intro" :key="s.h" :class="['card p-4 md:p-5', i === 0 ? 'sm:col-span-2' : '']">
          <dt class="eyebrow">{{ s.h }}</dt>
          <dd v-for="(b, j) in s.p" :key="j" class="mt-1.5 md:mt-2 mx-0 leading-normal md:leading-relaxed text-[15px] md:text-base"><RichText :text="b" /></dd>
        </div>
        <div class="p-4 md:p-5 rounded-[14px] bg-brand text-paper flex sm:flex-col items-center sm:items-start justify-between gap-3">
          <dt class="text-xs md:text-[13px] font-600 uppercase tracking-[0.06em]">{{ t('abt.start') }}</dt>
          <dd class="m-0"><RouterLink to="/" class="focusable inline-flex items-center gap-2 min-h-11 px-4 whitespace-nowrap rounded-[10px] bg-paper !text-brand font-700 no-underline hover:bg-white">
            {{ t('abt.cta') }}<Icon name="next" :size="18" :stroke="2.4" /></RouterLink></dd>
        </div>
      </dl>
    </section>

    <!-- Niveaux : une échelle lue de gauche à droite (liste sur téléphone) -->
    <section v-if="levelSec" aria-labelledby="niv-h" class="card md:rounded-[18px] p-4 md:p-9">
      <div class="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1.5">
        <h2 id="niv-h" class="h-sec">{{ levelSec.h }}</h2>
        <p v-for="(b, j) in levelSec.p" :key="j" class="m-0 text-sm md:text-base text-mute max-w-[720px]"><RichText :text="b" /></p>
      </div>
      <ol class="mt-4 md:mt-7 mb-0 p-0 list-none grid gap-1.5 md:gap-3 md:grid-cols-5 md:items-end">
        <li v-for="(l, i) in levels" :key="l.id" class="flex md:flex-col items-center md:items-stretch gap-3 md:gap-2.5 px-3 py-2.5 md:p-0 rounded-[10px] border border-rule md:border-0">
          <span aria-hidden="true" class="hidden md:block rounded-t-lg rounded-b-sm border-t-[5px]" :style="{ height: stepH(i), background: tint(l.color, 22), borderColor: l.color }" />
          <span aria-hidden="true" class="md:hidden shrink-0 self-end mb-1 w-2 rounded-sm" :style="{ height: 14 + i * 7 + 'px', background: l.color }" />
          <span class="flex-1 flex flex-col gap-px md:gap-1">
            <span class="hidden md:block text-xs text-mute">{{ t('pg.level', { n: i + 1 }) }}</span>
            <span class="font-700 md:text-[17px]">{{ l.name }}</span>
            <span class="text-[13px] md:text-sm text-mute leading-snug md:min-h-10">{{ l.pitch }}</span>
          </span>
        </li>
      </ol>
      <p class="hidden md:flex mt-4.5 mb-0 pt-2.5 border-t border-rule justify-between text-[13px] text-mute">
        <span>{{ t('abt.scale.low') }}</span><span>{{ t('abt.scale.high') }}</span>
      </p>
    </section>

    <!-- Avancement : un chiffre, une carte par groupe, un seul panneau de détail -->
    <section v-if="roadmapSec" aria-labelledby="av-h" class="mt-5 card md:rounded-[18px] p-4 md:p-9">
      <div class="flex flex-wrap items-center gap-x-10 gap-y-2.5">
        <h2 id="av-h" class="h-sec">{{ roadmapSec.h }}</h2>
        <div class="flex-[1_1_360px] flex items-center gap-3 md:gap-4">
          <span class="font-display font-800 text-[32px] md:text-[40px] leading-none">{{ coverage.pct }} %</span>
          <span class="flex-1 flex flex-col gap-1.5">
            <span role="progressbar" :aria-label="t('banner.aria')" :aria-valuenow="coverage.pct" aria-valuemin="0" aria-valuemax="100" class="flex h-2 md:h-2.5 rounded-full bg-paper overflow-hidden">
              <span class="bg-brand" :style="{ width: share(all, 'done') }" /><span class="bg-brand/45" :style="{ width: share(all, 'partial') }" />
            </span>
            <span class="text-[13px] md:text-sm text-mute">{{ summary(all) }} {{ t('abt.of', { total: coverage.total }) }}</span>
          </span>
        </div>
      </div>

      <div role="group" :aria-label="t('abt.groups')" class="mt-4 md:mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-2.5">
        <button v-for="([g, list], i) in coverage.groups" :key="g" type="button" :aria-pressed="i === groupIdx" @click="picked = i"
          :class="['focusable flex flex-col gap-1.5 md:gap-2 min-h-13 px-3 py-2.5 md:p-3.5 rounded-[10px] md:rounded-xl border-2 text-left cursor-pointer', i === groupIdx ? 'border-brand bg-soft' : 'border-rule bg-white hover:border-edge']">
          <span class="flex justify-between items-baseline gap-2 text-sm md:text-base"><span class="font-700">{{ tg(g) }}</span><span class="tabular-nums">{{ count(list, 'done') }}/{{ list.length }}</span></span>
          <span aria-hidden="true" class="flex h-[5px] md:h-1.5 rounded-full bg-paper overflow-hidden">
            <span class="bg-brand" :style="{ width: share(list, 'done') }" /><span class="bg-brand/45" :style="{ width: share(list, 'partial') }" />
          </span>
          <span class="hidden md:block text-[13px] text-mute">{{ summary(list) }}</span>
        </button>
      </div>
      <div v-if="group" aria-live="polite" class="mt-2.5 md:mt-3 p-3 md:p-4.5 rounded-[10px] md:rounded-xl bg-soft flex flex-wrap items-center gap-1.5 md:gap-2">
        <span class="w-full md:w-auto md:mr-2 text-sm md:text-base font-600">{{ tg(group[0]) }}<span class="md:hidden font-400 text-mute"> · {{ summary(group[1]) }}</span></span>
        <span v-for="d in group[1]" :key="d.id" :class="chip(d.status)">{{ d.name }}<span class="sr-only"> ({{ t('pg.' + d.status) }})</span></span>
      </div>
      <p class="mt-3 md:mt-3.5 mb-0 flex flex-wrap gap-x-3.5 gap-y-1 text-[13px] text-mute">
        <span class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded bg-brandsoft border-[1.5px] border-brand" />{{ t('pg.done') }}</span>
        <span class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded border-[1.5px] border-dashed border-brand" />{{ t('pg.partial') }}</span>
        <span class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded border-[1.5px] border-line" />{{ t('pg.planned') }}</span>
      </p>
      <p v-for="(b, j) in roadmapSec.p" :key="j" class="mt-2.5 mb-0 text-sm text-mute leading-relaxed max-w-[900px]"><RichText :text="b" /></p>
    </section>
  </main>
</template>
