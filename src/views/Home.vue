<script setup>
import { t } from '../lib/i18n'
import { computed, toRefs } from 'vue'
import { levels, sizes, tabs, solutions, hasDetail, pricing } from '../lib/catalog'
import { state } from '../lib/store'
import { eur, current, visible } from '../lib/budget'
import Icon from '../components/Icon.vue'

// Accueil : on règle la taille et le niveau (état partagé), puis on ouvre le catalogue
const { sizeId, levelIdx } = toRefs(state)
const size = computed(() => sizes.find((s) => s.id === sizeId.value))
const level = computed(() => levels[levelIdx.value])
const nItems = computed(() => visible.value.reduce((n, d) => n + d.items.length, 0))
const stats = computed(() => [
  [tabs.length, 'acc.stat.domains'],
  [solutions.length, 'acc.stat.solutions'],
  [solutions.filter(hasDetail).length, 'acc.stat.fiches'],
  [levels.length, 'acc.stat.levels'],
])
const gain = computed(() => `${current.value.gain >= 0 ? t('bud.saving') : t('bud.extra')} ${eur(Math.abs(current.value.gain))}`)
const shortcuts = [['/catalogue', 'nav.catalog', 'acc.go.catalog'], ['/solutions', 'nav.solutions', 'acc.go.solutions'], ['/budget', 'nav.budget', 'acc.go.budget']]
const tint = (c) => `color-mix(in srgb, ${c} 12%, white)`
const step = 'shrink-0 inline-flex items-center justify-center w-[30px] h-[30px] md:w-9 md:h-9 rounded-full bg-brand text-paper text-[15px] md:text-lg'
// Rond de sélection affiché à droite d'une option sur téléphone
const dot = (on, c) => (on ? { background: c, borderColor: c } : {})
</script>

<template>
  <div>
    <section class="bg-brand text-paper border-t border-paper/15">
      <div class="wrap pt-7 md:pt-16 pb-12 md:pb-24 flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
        <div class="flex-[1_1_560px] max-w-[980px]">
          <h1 class="m-0 font-display font-800 text-[38px] md:text-[clamp(44px,5.4vw,88px)] leading-none md:leading-[0.96] tracking-[-0.015em]">{{ t('home.title') }}</h1>
          <p class="mt-3.5 md:mt-6 mb-0 text-base md:text-xl leading-normal max-w-[720px]">{{ t('acc.intro') }}</p>
        </div>
        <ul class="m-0 p-0 list-none grid grid-cols-4 md:grid-cols-2 gap-x-4 md:gap-x-10 gap-y-6">
          <li v-for="[n, key] in stats" :key="key">
            <span class="block font-display font-800 text-[28px] md:text-[44px] leading-none">{{ n }}</span>
            <span class="text-[13px] md:text-sm">{{ t(key) }}</span>
          </li>
        </ul>
      </div>
    </section>

    <main class="wrap -mt-4 md:-mt-14 pb-28 md:pb-16">
      <div class="card md:rounded-[18px] md:shadow-[0_12px_32px_rgba(22,34,31,0.08)] p-4 md:p-8 flex flex-col gap-6 md:gap-8">
        <fieldset>
          <legend class="mb-3.5 md:mb-4 flex items-center gap-2.5 md:gap-3 font-display font-700 text-xl md:text-[26px]">
            <span :class="step" aria-hidden="true">1</span>{{ t('acc.step1') }}</legend>
          <div class="grid grid-cols-[minmax(0,1fr)] md:grid-cols-3 gap-2 md:gap-3">
            <label v-for="s in sizes" :key="s.id"
              :class="['radio-card items-center md:items-stretch md:flex-col gap-3 md:gap-1.5 min-h-16 px-3.5 py-2.5 md:p-5 md:rounded-[14px]', sizeId === s.id ? 'border-brand bg-brandsoft' : 'border-rule md:border-line bg-white']">
              <input v-model="sizeId" type="radio" name="hsize" :value="s.id" class="sr-only" />
              <span class="hidden md:flex items-center justify-between gap-2">
                <span class="font-display font-800 text-[26px]">{{ s.name }}</span>
                <span v-if="sizeId === s.id" class="flex w-7 h-7 rounded-full bg-brand text-paper items-center justify-center"><Icon name="check" :size="16" :stroke="3" /></span>
              </span>
              <span class="hidden md:block font-600">{{ t('home.users', { users: s.users, hosts: s.hosts }) }}</span>
              <span class="hidden md:block text-sm text-mute">{{ s.profil }}</span>
              <span class="md:hidden order-first flex-1 flex flex-col gap-0.5">
                <span class="font-700 text-[17px]">{{ s.name }}</span>
                <span class="text-sm text-mute">{{ t('home.users', { users: s.users, hosts: s.hosts }) }}</span>
              </span>
              <span class="md:hidden w-6 h-6 rounded-full border-2 border-edge bg-white flex items-center justify-center text-paper" :style="dot(sizeId === s.id, '#2F5D50')">
                <Icon v-if="sizeId === s.id" name="check" :size="14" :stroke="3.2" /></span>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend class="mb-3.5 md:mb-4 flex items-center gap-2.5 md:gap-3 font-display font-700 text-xl md:text-[26px]">
            <span :class="step" aria-hidden="true">2</span>{{ t('acc.step2') }}</legend>
          <div class="grid grid-cols-[minmax(0,1fr)] md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
            <label v-for="(l, i) in levels" :key="l.id"
              :class="['radio-card items-center md:items-stretch md:flex-col gap-3 md:gap-2.5 min-h-16 px-3.5 py-2.5 md:p-4 md:rounded-[14px] border-l-[6px] md:border-l-2', levelIdx === i ? '' : 'border-rule md:border-line bg-white']"
              :style="levelIdx === i ? { borderColor: l.color, background: tint(l.color) } : { borderLeftColor: l.color }">
              <input v-model="levelIdx" type="radio" name="hlevel" :value="i" class="sr-only" />
              <span class="hidden md:block h-1.5 rounded-sm" :style="{ background: l.color }" />
              <span class="flex-1 md:flex-none flex flex-col gap-0.5 md:gap-2.5">
                <span class="flex items-center gap-1.5 font-700 md:text-[17px]"><Icon v-if="levelIdx === i" name="check" :size="16" :stroke="3" class="hidden md:block" />{{ l.name }}</span>
                <span class="text-sm text-mute leading-snug">{{ l.pitch }}</span>
              </span>
              <span class="md:hidden w-6 h-6 rounded-full border-2 border-edge bg-white flex items-center justify-center text-white" :style="dot(levelIdx === i, l.color)">
                <Icon v-if="levelIdx === i" name="check" :size="14" :stroke="3.2" /></span>
            </label>
          </div>
        </fieldset>

        <!-- Récapitulatif et accès au catalogue ; sur téléphone, la même action est fixée en bas de l'écran -->
        <div class="hidden md:flex pt-6 border-t border-rule flex-wrap items-center justify-between gap-x-10 gap-y-5">
          <div aria-live="polite" class="flex flex-wrap items-baseline gap-x-10 gap-y-3">
            <p class="m-0 text-lg">{{ t('acc.recap', { size: size.name, level: level.name, n: nItems }) }}</p>
            <p class="m-0 text-mute">{{ t('acc.budget', { years: pricing.horizon_years }) }} <b class="text-ink">{{ eur(current.libre) }}</b> · {{ gain }} {{ t('acc.vsprop') }}</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <RouterLink to="/budget" class="focusable flex items-center min-h-13 px-5.5 rounded-xl border border-edge bg-white font-600 no-underline">{{ t('home.budget') }}</RouterLink>
            <RouterLink to="/catalogue" class="focusable flex items-center gap-2.5 min-h-13 px-6.5 rounded-xl bg-brand !text-paper font-700 text-[17px] no-underline hover:opacity-92">
              {{ t('acc.cta') }}<Icon name="next" :size="20" :stroke="2.4" /></RouterLink>
          </div>
        </div>
      </div>

      <nav :aria-label="t('acc.explore')" class="mt-5 md:mt-12 grid grid-cols-[minmax(0,1fr)] md:grid-cols-3 gap-2 md:gap-4">
        <RouterLink v-for="[to, title, desc] in shortcuts" :key="to" :to="to"
          class="focusable flex items-center md:items-start justify-between md:justify-start md:flex-col gap-2 min-h-14 px-4 py-3 md:p-6 rounded-xl md:rounded-[14px] bg-white/60 border border-line no-underline hover:bg-white">
          <span class="flex flex-col gap-0.5 md:gap-2">
            <span class="font-700 md:(font-display text-[22px])">{{ t(title) }}</span>
            <span class="text-sm md:text-base text-mute leading-normal">{{ t(desc, { years: pricing.horizon_years }) }}</span>
          </span>
          <Icon name="next" class="md:hidden text-mute" />
        </RouterLink>
      </nav>
    </main>

    <!-- Téléphone : choix en cours et accès au catalogue, au-dessus de la barre d'onglets -->
    <div aria-live="polite" class="md:hidden fixed inset-x-0 bottom-[72px] z-10 px-4 py-3 bg-white border-t border-line shadow-[0_-6px_16px_rgba(22,34,31,0.06)] flex items-center gap-3">
      <span class="flex-1 min-w-0 flex flex-col">
        <span class="text-sm font-700 truncate">{{ size.name }} · {{ level.name }}</span>
        <span class="text-[13px] text-mute">{{ t('acc.short', { v: eur(current.libre), years: pricing.horizon_years }) }}</span>
      </span>
      <RouterLink to="/catalogue" class="focusable shrink-0 flex items-center gap-2 h-12 px-4.5 rounded-xl bg-brand !text-paper font-700 no-underline">
        {{ t('acc.ctashort') }}<Icon name="next" :size="18" :stroke="2.4" /></RouterLink>
    </div>
  </div>
</template>
