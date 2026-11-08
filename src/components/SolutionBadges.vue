<script setup>
import { t } from '../lib/i18n'
import { familyOf, labelDefs } from '../lib/catalog'
// `family` : ajoute le nom de la famille au badge (« AGPL-3.0 · Copyleft fort »), pour l'en-tête d'une fiche
defineProps({ sol: Object, family: Boolean })
const def = (id) => labelDefs.find((l) => l.id === id)
</script>

<template>
  <span class="inline-flex flex-wrap items-center gap-1.5">
    <span :class="['rounded-md font-600', family ? 'px-3 py-1.5 text-sm font-700' : 'px-2 py-0.5 text-xs']" :style="{ color: familyOf(sol).color, background: familyOf(sol).bg }"
      :title="`${familyOf(sol).name} : ${familyOf(sol).desc}`">{{ sol.license || t('badge.nolicense') }}<template v-if="family"> · {{ familyOf(sol).name }}</template></span>
    <a v-for="id in sol.labels" :key="id" :href="def(id).url" target="_blank" rel="noopener noreferrer"
      :class="['rounded-md border-[1.5px] border-ink font-700 no-underline focusable', family ? 'px-3 py-1 text-sm' : 'px-2 py-px text-xs']" :title="def(id).desc">
      {{ def(id).name }}<span class="sr-only"> {{ t('a11y.newtab') }}</span></a>
  </span>
</template>
