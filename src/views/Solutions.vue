<script setup>
import { t } from '../lib/i18n'
import { ref, computed } from 'vue'
import { solutions, families, familyOf, hasDetail } from '../lib/catalog'
import SolutionBadges from '../components/SolutionBadges.vue'
import Icon from '../components/Icon.vue'

const q = ref('')
const fam = ref('')
const onlyFiche = ref(false)
const nFiches = computed(() => solutions.filter(hasDetail).length)
const list = computed(() =>
  solutions
    .filter((s) => (!fam.value || familyOf(s).id === fam.value) && (!onlyFiche.value || hasDetail(s)) && s.names[0].toLowerCase().includes(q.value.toLowerCase()))
    .sort((a, b) => a.names[0].localeCompare(b.names[0])),
)
// Index alphabétique : première solution de chaque lettre (les noms qui commencent par un chiffre ou un signe vont sous « # »)
const letterOf = (s) => { const c = s.names[0][0].toUpperCase(); return /[A-Z]/.test(c) ? c : '#' }
const firsts = computed(() => {
  const m = new Map()
  for (const s of list.value) if (!m.has(letterOf(s))) m.set(letterOf(s), s.id)
  return m
})
const letters = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
// Routeur en mode hash : on fait défiler la page plutôt que d'utiliser une ancre
const jump = (l) => document.getElementById('s-' + firsts.value.get(l))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
const pillOn = 'border-brand bg-brandsoft font-700'
</script>

<template>
  <main class="wrap pt-6 md:pt-10 pb-4 md:pb-16">
    <div class="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
      <div>
        <h1 class="h-page">{{ t('sol.title', { n: solutions.length }) }}</h1>
        <p class="mt-2.5 md:mt-3 mb-0 text-[15px] md:text-base text-mute max-w-[680px] leading-relaxed">{{ t('sol.intro') }}</p>
      </div>
      <p class="m-0 hidden md:block text-sm text-mute">{{ t('sol.count', { n: nFiches, f: families.length }) }}</p>
    </div>

    <div role="search" class="mt-5 md:mt-7 md:(p-4 bg-white border border-line rounded-[14px]) grid grid-cols-[minmax(0,1fr)] md:(flex flex-row) flex-wrap md:items-center gap-3 md:gap-x-5">
      <label class="flex-[1_1_320px] flex items-center gap-2.5 min-h-12 px-3.5 border border-edge rounded-[10px] bg-white cursor-text focus-within:(border-brand shadow-[0_0_0_1px_#2F5D50])">
        <Icon name="search" class="text-mute" />
        <span class="sr-only">{{ t('sol.searchlabel') }}</span>
        <input v-model="q" type="search" :placeholder="t('sol.search')" class="flex-1 min-w-0 h-11 border-0 outline-none shadow-none appearance-none bg-transparent text-base" />
      </label>
      <fieldset class="flex md:flex-wrap items-center gap-2 md:gap-1.5 overflow-x-auto -mx-4 px-4 md:(mx-0 px-0 overflow-visible) pb-1 md:pb-0">
        <legend class="sr-only">{{ t('sol.famlabel') }}</legend>
        <label :class="['radio-card shrink-0 items-center min-h-10 px-3.5 !rounded-full text-sm', fam === '' ? pillOn : 'border-line bg-white font-500']">
          <input v-model="fam" type="radio" name="fam" value="" class="sr-only" />{{ t('sol.allfam') }}</label>
        <label v-for="f in families" :key="f.id" :class="['radio-card shrink-0 items-center gap-1.5 min-h-10 px-3.5 !rounded-md text-sm font-600 whitespace-nowrap', fam === f.id ? 'border-ink' : 'border-transparent']"
          :style="{ background: f.bg, color: f.color }" :title="f.desc">
          <input v-model="fam" type="radio" name="fam" :value="f.id" class="sr-only" /><Icon v-if="fam === f.id" name="check" :size="14" :stroke="3" />{{ f.name }}</label>
      </fieldset>
      <label class="flex items-center gap-2.5 min-h-11 text-[15px] cursor-pointer">
        <input v-model="onlyFiche" type="checkbox" class="w-5 h-5 accent-brand focusable" />{{ t('sol.only', { n: nFiches }) }}</label>
    </div>

    <nav :aria-label="t('sol.letters')" class="hidden md:flex mt-5 flex-wrap gap-1">
      <button v-for="l in letters" :key="l" type="button" :disabled="!firsts.has(l)" @click="jump(l)"
        class="focusable w-9 h-9 rounded-lg border border-line bg-white font-600 text-sm cursor-pointer hover:bg-brandsoft disabled:(bg-transparent border-transparent text-edge cursor-default hover:bg-transparent)">{{ l }}</button>
    </nav>

    <p class="sr-only" aria-live="polite">{{ t('sol.shown', { n: list.length, total: solutions.length }) }}</p>
    <ul class="mt-4 md:mt-5 mb-0 p-0 list-none bg-white md:bg-transparent border md:border-0 border-line rounded-xl overflow-hidden md:overflow-visible md:grid md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:gap-3">
      <li v-for="s in list" :id="'s-' + s.id" :key="s.id"
        class="border-b border-rule last:border-b-0 md:(border md:border-line md:last:border-b md:rounded-xl md:bg-white) flex md:flex-col gap-3 min-h-[60px] md:min-h-[92px] px-3.5 py-2 md:px-4.5 md:py-4 items-center md:items-stretch">
        <div class="flex-1 min-w-0 flex flex-col md:flex-row md:items-start md:justify-between gap-1 md:gap-2.5">
          <RouterLink v-if="hasDetail(s)" :to="`/solutions/${s.id}`" class="font-700 text-base md:text-[17px] underline-offset-4 md:underline focusable">{{ s.names[0] }}<span class="sr-only"> {{ t('sol.srfiche') }}</span></RouterLink>
          <a v-else :href="s.url" target="_blank" rel="noopener noreferrer" class="font-700 text-base md:text-[17px] underline-offset-4 md:underline focusable">{{ s.names[0] }}<span class="sr-only"> {{ t('a11y.site') }}</span></a>
          <span class="flex items-center gap-1.5 md:hidden"><SolutionBadges :sol="s" /><span v-if="hasDetail(s)" class="px-[7px] py-px rounded-md bg-brandsoft text-xs font-700">{{ t('sol.tag') }}</span></span>
          <span v-if="hasDetail(s)" class="hidden md:inline shrink-0 px-2 py-0.5 rounded-md bg-brandsoft text-xs font-700">{{ t('sol.tag') }}</span>
          <span v-else class="hidden md:flex shrink-0 items-center gap-1 text-xs text-mute">{{ t('sol.site') }}<Icon name="ext" :size="14" /></span>
        </div>
        <div class="hidden md:flex"><SolutionBadges :sol="s" /></div>
        <Icon :name="hasDetail(s) ? 'next' : 'ext'" :size="18" class="md:hidden text-mute" />
      </li>
      <li v-if="!list.length" class="p-6 md:col-span-full text-mute">{{ t('sol.none') }}</li>
    </ul>
  </main>
</template>
