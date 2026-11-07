<script setup>
import { t, tg } from '../lib/i18n'
import { ref, computed, toRefs } from 'vue'
import { levels, sizes, tabs, coverage, resolve, pages, annotate, pricing } from '../lib/catalog'
import { state } from '../lib/store'
import { eur, current } from '../lib/budget'
import SolutionText from '../components/SolutionText.vue'
import SolutionChip from '../components/SolutionChip.vue'
import BadgeLegend from '../components/BadgeLegend.vue'
import Icon from '../components/Icon.vue'

const { sizeId, levelIdx } = toRefs(state)
const tabId = ref(tabs[0].id)
const size = computed(() => sizes.find((s) => s.id === sizeId.value))
const level = computed(() => levels[levelIdx.value])
const visible = (d) => d.items.filter((i) => !i.sizes || i.sizes.includes(sizeId.value))
const groups = computed(() => coverage.groups.map(([g]) => [g, tabs.filter((d) => d.group === g)]).filter(([, l]) => l.length))
// Ordre de lecture : celui du menu (groupes), pour que « précédent / suivant » suive ce que l'on voit
const ordered = computed(() => groups.value.flatMap(([, l]) => l))
const pos = computed(() => ordered.value.findIndex((d) => d.id === tabId.value))
const tab = computed(() => ordered.value[pos.value])
const prev = computed(() => ordered.value[pos.value - 1])
const next = computed(() => ordered.value[pos.value + 1])
// Chaque composant avec sa valeur pour (taille, niveau) : variante par taille si elle existe, sinon valeur du niveau
const rows = computed(() => visible(tab.value).map((it) => {
  const r = resolve(it, sizeId.value, levelIdx.value)
  return { it, r, sols: annotate(r.text ?? '').sols }
}))
const total = computed(() => tabs.reduce((n, d) => n + visible(d).length, 0))
const go = (d) => { if (d) tabId.value = d.id }
const tint = (c, pct = 14) => `color-mix(in srgb, ${c} ${pct}%, white)`
const stepBtn = 'focusable shrink-0 w-12 h-12 rounded-[10px] border border-edge bg-white flex items-center justify-center cursor-pointer disabled:(cursor-default text-edge border-line bg-transparent)'
const navBtn = 'focusable min-h-11 px-4.5 rounded-[10px] border border-edge bg-white font-600 cursor-pointer disabled:(cursor-not-allowed font-400 border-line bg-transparent text-mute)'
</script>

<template>
  <div>
    <!-- Titre et configuration -->
    <section class="wrap pt-6 md:pt-10 pb-2 md:pb-7 grid grid-cols-[minmax(0,1fr)] gap-4 md:gap-x-14 md:gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
      <div>
        <h1 class="m-0 font-display font-800 text-[34px] md:text-[clamp(36px,4.2vw,64px)] leading-[1.02] md:leading-[0.98] tracking-[-0.01em]">{{ t('home.title') }}</h1>
        <p class="mt-3 md:mt-4.5 text-base md:text-lg leading-relaxed text-mute max-w-[620px]">{{ t('home.intro') }}</p>
      </div>
      <div role="group" :aria-label="t('home.config')" class="card p-4 md:p-[22px] flex flex-col gap-4 md:gap-[18px]">
        <fieldset>
          <legend class="eyebrow mb-2 md:mb-2.5">{{ t('home.size') }}</legend>
          <div class="grid grid-cols-3 gap-1 md:gap-2 p-1 md:p-0 rounded-[10px] bg-paper md:bg-transparent">
            <label v-for="s in sizes" :key="s.id" :class="['radio-card flex-col justify-center md:justify-start gap-0.5 min-h-11 px-2 md:px-3 py-2 md:py-2.5 text-center md:text-left',
              sizeId === s.id ? 'border-transparent md:border-brand bg-white md:bg-brandsoft shadow-sm md:shadow-none' : 'border-transparent md:border-line md:bg-white text-mute md:text-ink']">
              <input v-model="sizeId" type="radio" name="size" :value="s.id" class="sr-only" />
              <span :class="['flex items-center justify-center md:justify-start gap-1.5 text-sm md:text-base leading-tight', sizeId === s.id ? 'font-700 text-ink' : 'font-500 md:font-700']">
                <Icon v-if="sizeId === s.id" name="check" :size="14" :stroke="3" />{{ s.name }}</span>
              <span class="hidden md:block text-[13px] text-mute">{{ t('home.usersonly', { users: s.users }) }}</span>
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend class="eyebrow mb-2 md:mb-2.5">{{ t('home.level') }}</legend>
          <div class="flex md:grid md:grid-cols-5 gap-2 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-1 md:pb-0">
            <label v-for="(l, i) in levels" :key="l.id"
              :class="['radio-card shrink-0 items-center md:items-stretch md:flex-col gap-1.5 md:gap-2 min-h-11 px-3.5 md:p-2.5 !rounded-full md:!rounded-[10px]', levelIdx === i ? '' : 'border-line bg-white']"
              :style="levelIdx === i ? { borderColor: l.color, background: tint(l.color) } : {}">
              <input v-model="levelIdx" type="radio" name="level" :value="i" class="sr-only" />
              <span class="md:hidden w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: l.color }" />
              <span class="hidden md:block h-1 rounded-sm" :style="{ background: l.color }" />
              <span :class="['flex items-center gap-1.5 text-sm leading-tight whitespace-nowrap md:whitespace-normal', levelIdx === i ? 'font-700' : 'font-500 md:font-700']">
                <Icon v-if="levelIdx === i" name="check" :size="14" :stroke="3" />{{ l.name }}</span>
            </label>
          </div>
          <p class="mt-2.5 md:mt-3 text-sm text-mute leading-snug">{{ level.pitch }} · {{ t('home.users', { users: size.users, hosts: size.hosts }) }}</p>
        </fieldset>
      </div>
    </section>

    <div class="wrap pt-5 md:pt-2 pb-2 md:pb-16 grid grid-cols-[minmax(0,1fr)] gap-5 lg:gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_340px] items-start">
      <!-- Ordinateur : menu des domaines -->
      <nav :aria-label="t('home.domains')" class="hidden lg:flex flex-col gap-5.5 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] overflow-y-auto pr-1 lg:row-span-2 xl:row-span-1">
        <div v-for="[group, list] in groups" :key="group">
          <h2 class="eyebrow mb-1.5">{{ tg(group) }}</h2>
          <div class="flex flex-col gap-0.5">
            <button v-for="d in list" :key="d.id" type="button" :aria-current="tabId === d.id ? 'true' : null" @click="go(d)"
              :class="['focusable w-full min-h-10 flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg border-l-4 text-left text-[15px] cursor-pointer',
                tabId === d.id ? 'bg-white font-700 shadow-[0_1px_2px_rgba(22,34,31,0.08)]' : 'border-transparent font-500 hover:bg-white/70']"
              :style="tabId === d.id ? { borderLeftColor: level.color } : {}">
              <span>{{ d.name }}</span>
              <span v-if="d.status === 'partial'" class="text-xs font-400 text-mute" :title="t('home.wiptitle')">{{ t('home.wip') }}</span>
            </button>
          </div>
        </div>
        <p class="text-sm text-mute">{{ t('home.count', { n: total, size: size.name }) }}</p>
      </nav>

      <main class="min-w-0">
        <!-- Téléphone et tablette : choix du domaine -->
        <div class="lg:hidden mb-5">
          <label for="dom" class="eyebrow block mb-2">{{ t('home.domainof', { i: pos + 1, n: ordered.length }) }}</label>
          <div class="flex gap-2">
            <button type="button" :class="stepBtn" :disabled="!prev" :aria-label="prev ? t('home.prevto', { name: prev.name }) : t('home.prev')" @click="go(prev)"><Icon name="prev" /></button>
            <select id="dom" v-model="tabId" class="field flex-1 min-w-0 h-12 font-600">
              <optgroup v-for="[group, list] in groups" :key="group" :label="tg(group)">
                <option v-for="d in list" :key="d.id" :value="d.id">{{ d.name }}<template v-if="d.status === 'partial'"> ({{ t('home.wip') }})</template></option>
              </optgroup>
            </select>
            <button type="button" :class="stepBtn" :disabled="!next" :aria-label="next ? t('home.nextto', { name: next.name }) : t('home.next')" @click="go(next)"><Icon name="next" /></button>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 md:gap-2.5">
          <h2 class="m-0 mr-1 md:mr-2 font-display font-800 text-[28px] md:text-[40px] leading-tight">{{ tab.name }}</h2>
          <span class="px-2.5 md:px-3 py-0.5 md:py-1 rounded-full border-2 text-[13px] md:text-sm font-600" :style="{ borderColor: level.color, background: tint(level.color, 12) }">{{ level.name }}</span>
          <span class="chip text-[13px] md:text-sm">{{ size.name }}</span>
          <span v-if="tab.status === 'partial'" class="chip border-dashed text-mute" :title="t('home.wipchiptitle')">{{ t('home.wipchip') }}</span>
          <span class="hidden md:inline ml-auto text-sm text-mute">{{ t('home.position', { i: pos + 1, n: ordered.length, k: rows.length }) }}</span>
        </div>
        <p class="mt-2 md:mt-2.5 text-[15px] md:text-base text-mute leading-relaxed max-w-[860px]">{{ tab.intro }} <span class="text-ink">{{ tab.sizing?.[sizeId] }}</span></p>
        <p v-if="!tab.translated" class="mt-2 text-sm text-mute">{{ t('home.untranslated') }}</p>

        <!-- Composants : tableau sur ordinateur, cartes sur téléphone -->
        <div role="table" :aria-label="t('home.tablelabel')" class="mt-4 md:mt-6 md:(bg-white border border-line rounded-[14px] overflow-hidden)">
          <div role="row" class="hidden md:grid grid-cols-[minmax(160px,1fr)_minmax(0,2.2fr)_minmax(180px,1fr)] gap-6 px-6 py-3 bg-soft border-b border-line eyebrow tracking-[0.05em]">
            <span role="columnheader">{{ t('home.col.item') }}</span><span role="columnheader">{{ t('home.col.sol') }}</span><span role="columnheader">{{ t('home.col.lic') }}</span>
          </div>
          <div class="flex flex-col gap-2.5 md:gap-0">
            <div v-for="{ it, r, sols } in rows" :key="it.name" role="row"
              class="bg-white border border-line rounded-xl md:(border-0 border-b border-rule rounded-none) md:last:border-b-0 p-4 md:(px-6 py-4.5) grid gap-1.5 md:gap-6 md:grid-cols-[minmax(160px,1fr)_minmax(0,2.2fr)_minmax(180px,1fr)] items-start">
              <div role="cell">
                <h3 class="m-0 hidden md:block text-base font-600">{{ it.name }}</h3>
                <p class="m-0 hidden md:block mt-0.5 text-sm text-mute">{{ it.role }}</p>
                <p class="m-0 md:hidden eyebrow tracking-[0.05em]">{{ it.name }} · {{ it.role }}</p>
              </div>
              <div role="cell">
                <SolutionText :text="r.text ?? '—'" :color="level.color" />
                <!-- Variante propre à cette taille : on dit pourquoi la réponse n'est pas la même -->
                <p v-if="r.custom" class="mt-2 text-sm">
                  <span class="mr-2 px-1.5 py-0.5 rounded bg-brandsoft text-xs font-600">{{ t('home.variant', { size: size.name }) }}</span>
                  <span v-if="r.why" class="text-mute">{{ r.why }}</span>
                </p>
              </div>
              <div role="cell" class="flex flex-wrap gap-1.5 mt-1 md:mt-0">
                <SolutionChip v-for="s in sols" :key="s.id" :sol="s" />
              </div>
            </div>
          </div>
        </div>

        <div class="hidden lg:flex mt-5 flex-wrap justify-between gap-3">
          <button type="button" :class="navBtn" :disabled="!prev" @click="go(prev)">← {{ prev ? prev.name : t('home.prev') }}</button>
          <button type="button" :class="navBtn" :disabled="!next" @click="go(next)">{{ next ? next.name : t('home.next') }} →</button>
        </div>
        <p class="mt-4 md:mt-5 text-[13px] md:text-sm text-mute leading-relaxed max-w-[760px]">{{ pages.disclaimer }}</p>
      </main>

      <!-- Résumé : budget du choix et légende -->
      <aside :aria-label="t('home.summary')" class="flex flex-col md:grid md:grid-cols-2 xl:flex gap-4 lg:col-start-2 xl:col-start-auto xl:sticky xl:top-4">
        <RouterLink to="/budget" class="focusable group flex flex-col p-4 md:p-[22px] rounded-[14px] bg-brand !text-paper no-underline">
          <span class="text-[13px] md:(uppercase tracking-[0.06em]) opacity-90">{{ t('home.sumtitle', { years: pricing.horizon_years, size: size.name, level: level.name }) }}</span>
          <span class="hidden md:block mt-3.5 text-sm">{{ t('home.free') }}</span>
          <span class="mt-0.5 font-display font-800 text-[26px] md:text-4xl leading-none">{{ eur(current.libre) }}</span>
          <span class="hidden md:block mt-3 text-sm">{{ t('home.propeq') }} <b>{{ eur(current.prop) }}</b></span>
          <span class="mt-1.5 text-sm md:text-[15px] font-700">{{ current.gain >= 0 ? t('bud.saving') : t('bud.extra') }} {{ eur(Math.abs(current.gain)) }}</span>
          <span class="mt-4 flex items-center justify-center gap-2 min-h-11 rounded-[10px] bg-paper text-brand font-700 group-hover:bg-white">{{ t('home.seebudget') }}<Icon name="next" :size="18" /></span>
        </RouterLink>
        <details class="md:hidden card px-4 py-1">
          <summary class="min-h-11 flex items-center font-600 text-[15px] cursor-pointer focusable">{{ t('legend.title') }}</summary>
          <BadgeLegend class="pb-3" />
        </details>
        <BadgeLegend class="hidden md:block card p-5" titled />
      </aside>
    </div>
  </div>
</template>
