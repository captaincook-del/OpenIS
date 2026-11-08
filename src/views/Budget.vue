<script setup>
import { t } from '../lib/i18n'
import { ref, computed, toRefs } from 'vue'
import { levels, sizes, pricing } from '../lib/catalog'
import { state } from '../lib/store'
import { eur, visible, sum, byLevel, current } from '../lib/budget'
import Icon from '../components/Icon.vue'

const { sizeId, levelIdx } = toRefs(state)
const years = pricing.horizon_years
const nItems = computed(() => visible.value.reduce((n, d) => n + d.items.length, 0))
const level = computed(() => levels[levelIdx.value])
const max = computed(() => Math.max(...byLevel.value.flatMap((r) => [r.libre, r.prop])))
const w = (v, m) => Math.max(2, (v / m) * 100) + '%'

// Détail par domaine pour le niveau choisi : les 8 plus coûteux, puis tous sur demande
const SHORT = 8
const all = ref(false)
const byDomain = computed(() =>
  visible.value.filter((d) => d.items.length).map(({ t: d, items }) => ({ d, n: items.length, ...sum(items, levelIdx.value) })).sort((a, b) => b.libre - a.libre),
)
const shown = computed(() => (all.value ? byDomain.value : byDomain.value.slice(0, SHORT)))
const maxDomain = computed(() => Math.max(...byDomain.value.map((d) => d.libre), 1))
const kpi = 'p-4 md:px-[22px] md:py-5 rounded-[14px]'
const kpiNum = 'mt-1.5 mb-0 font-display font-800 leading-none'
</script>

<template>
  <main class="wrap pt-6 md:pt-10 pb-4 md:pb-16">
    <div class="flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
      <div class="flex-[1_1_520px]">
        <h1 class="h-page">{{ t('bud.title', { years }) }}</h1>
        <p class="mt-2.5 md:mt-3 mb-0 text-[15px] md:text-base text-mute max-w-[720px] leading-relaxed">{{ t('bud.intro', { n: nItems }) }}</p>
      </div>
      <fieldset class="w-full md:w-auto">
        <legend class="eyebrow mb-2">{{ t('bud.size') }}</legend>
        <div class="grid grid-cols-3 md:flex gap-1 p-1 rounded-xl bg-white border border-line">
          <label v-for="s in sizes" :key="s.id" :class="['radio-card !border-0 items-center justify-center gap-1.5 min-h-11 px-2 md:px-4 rounded-lg text-sm md:text-[15px] text-center',
            sizeId === s.id ? 'bg-brandsoft shadow-[inset_0_0_0_2px_#2F5D50] font-700' : 'text-mute']">
            <input v-model="sizeId" type="radio" name="bsize" :value="s.id" class="sr-only" />
            <Icon v-if="sizeId === s.id" name="check" :size="14" :stroke="3" />{{ s.name }}<span class="hidden md:inline">&nbsp;({{ s.users }})</span>
          </label>
        </div>
      </fieldset>
    </div>

    <!-- Chiffres du niveau choisi -->
    <section :aria-label="t('bud.selected', { level: level.name })" class="mt-5 md:mt-7 grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3">
      <div :class="kpi + ' col-span-2 md:col-span-1 bg-brand text-paper'">
        <p class="m-0 text-[13px] md:text-sm">{{ t('bud.kpi.free', { level: level.name }) }}</p>
        <p :class="kpiNum + ' text-[30px] md:text-[38px]'">{{ eur(current.libre) }}</p>
      </div>
      <div :class="kpi + ' card'">
        <p class="m-0 text-[13px] md:text-sm text-mute">{{ t('bud.kpi.prop') }}</p>
        <p :class="kpiNum + ' text-[22px] md:text-[38px]'">{{ eur(current.prop) }}</p>
      </div>
      <div :class="kpi + ' card'">
        <p class="m-0 text-[13px] md:text-sm text-mute">{{ current.gain >= 0 ? t('bud.kpi.gain', { years }) : t('bud.kpi.extra', { years }) }}</p>
        <p :class="[kpiNum, 'text-[22px] md:text-[38px]', current.gain >= 0 ? 'text-gain' : 'text-red-800']">{{ eur(Math.abs(current.gain)) }}</p>
      </div>
      <div :class="kpi + ' card col-span-2 md:col-span-1'">
        <p class="m-0 text-[13px] md:text-sm text-mute">{{ t('bud.kpi.setup') }}</p>
        <p :class="kpiNum + ' text-xl md:text-[28px] !leading-tight'">{{ eur(current.capex) }} · {{ t('bud.peryear', { v: eur(current.run) }) }}</p>
      </div>
    </section>

    <div class="mt-7 md:mt-8 flex flex-wrap gap-6 items-start">
      <section aria-labelledby="cmp" class="flex-[999_1_620px] min-w-0 md:(p-6 bg-white border border-line rounded-[14px])">
        <div class="flex flex-wrap justify-between items-baseline gap-3">
          <h2 id="cmp" class="m-0 font-display font-700 text-[22px] md:text-2xl">{{ t('bud.compare', { n: levels.length }) }}</h2>
          <p class="m-0 hidden md:flex gap-4.5 text-[13px] text-mute">
            <span class="flex items-center gap-1.5"><span class="w-3.5 h-2.5 rounded-sm bg-brand" />{{ t('bud.legfree') }}</span>
            <span class="flex items-center gap-1.5"><span class="w-3.5 h-2.5 rounded-sm bg-propbar" />{{ t('bud.prop') }}</span>
          </p>
        </div>
        <p class="mt-1 mb-0 text-[13px] text-mute md:hidden">{{ t('bud.tap') }}</p>
        <div class="mt-3 md:mt-4 flex flex-col gap-2">
          <button v-for="r in byLevel" :key="r.l.id" type="button" :aria-pressed="levelIdx === r.i" @click="levelIdx = r.i"
            :class="['focusable w-full p-3.5 md:(px-4 py-3.5) rounded-xl md:rounded-[10px] border-2 border-l-8 text-left cursor-pointer flex flex-col md:grid md:grid-cols-[minmax(160px,230px)_minmax(0,1fr)_minmax(150px,200px)] md:gap-5 md:items-center',
              levelIdx === r.i ? 'border-brand bg-white md:bg-soft' : 'border-line md:border-rule bg-white/70 md:bg-white hover:bg-white']"
            :style="{ borderLeftColor: r.l.color }">
            <span class="flex justify-between items-baseline gap-2 md:flex-col md:gap-0.5">
              <span class="font-700 flex items-center gap-1.5"><Icon v-if="levelIdx === r.i" name="check" :size="14" :stroke="3" />{{ r.l.name }}</span>
              <span class="hidden md:block text-[13px] text-mute">{{ t('bud.setup', { capex: eur(r.capex), run: eur(r.run) }) }}</span>
              <span :class="['md:hidden text-sm font-700', r.gain >= 0 ? 'text-gain' : 'text-red-800']">{{ r.gain >= 0 ? '−' : '+' }}{{ eur(Math.abs(r.gain)) }}</span>
            </span>
            <span aria-hidden="true" class="mt-2.5 md:mt-0 flex flex-col gap-1 md:gap-[5px]">
              <span class="block h-2.5 md:h-3 rounded-[3px]" :style="{ width: w(r.libre, max), background: r.l.color }" />
              <span class="block h-2.5 md:h-3 rounded-[3px] bg-propbar" :style="{ width: w(r.prop, max) }" />
            </span>
            <span class="mt-2 md:mt-0 flex md:flex-col justify-between gap-px text-[13px] md:text-sm md:text-right text-mute md:text-ink">
              <span><b class="hidden md:inline">{{ t('bud.free') }}</b><span class="md:hidden">{{ t('bud.free') }}</span> {{ eur(r.libre) }}</span>
              <span class="md:text-mute">{{ t('bud.prop') }} {{ eur(r.prop) }}</span>
              <span :class="['hidden md:block font-700', r.gain >= 0 ? 'text-gain' : 'text-red-800']">{{ r.gain >= 0 ? t('bud.saving') : t('bud.extra') }} {{ eur(Math.abs(r.gain)) }}</span>
            </span>
          </button>
        </div>
      </section>

      <section aria-labelledby="dom" class="flex-[1_1_380px] md:max-w-[520px] p-4 md:p-6 card">
        <h2 id="dom" class="m-0 font-display font-700 text-xl md:text-2xl">{{ t('bud.detail', { level: level.name }) }}</h2>
        <p class="mt-1.5 mb-0 text-sm text-mute">{{ t('bud.detailnote', { years }) }}</p>
        <ul class="mt-4 mb-0 p-0 list-none flex flex-col gap-3">
          <li v-for="d in shown" :key="d.d.id" class="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 items-center">
            <span class="text-sm font-600">{{ d.d.name }} <span class="font-400 text-mute">({{ d.n }})</span></span>
            <span class="text-sm text-right tabular-nums">{{ eur(d.libre) }}</span>
            <span aria-hidden="true" class="col-span-full h-1.5 md:h-2 rounded bg-paper overflow-hidden"><span class="block h-full rounded" :style="{ width: w(d.libre, maxDomain), background: level.color }" /></span>
          </li>
        </ul>
        <button v-if="byDomain.length > SHORT" type="button" :aria-expanded="all" @click="all = !all"
          class="focusable mt-4 min-h-11 w-full rounded-[10px] border border-edge bg-white font-600 cursor-pointer hover:bg-soft">
          {{ all ? t('bud.showless') : t('bud.showall', { n: byDomain.length }) }}</button>
      </section>
    </div>

    <p class="mt-4 md:mt-6 mb-0 text-[13px] md:text-sm text-mute max-w-[900px] leading-relaxed">{{ pricing.disclaimer }} {{ t('bud.etp', { cost: eur(pricing.etp_cost) }) }}</p>
  </main>
</template>
