<script setup>
import { computed } from 'vue'
import { familyOf, hasDetail } from '../lib/catalog'
import { t } from '../lib/i18n'

// Badge cliquable « Nom · licence », teinté par famille de licence : mène à la fiche, sinon au site du projet
const props = defineProps({ sol: Object })
const fam = computed(() => familyOf(props.sol))
const cls = 'focusable inline-flex items-center gap-1 min-h-8 md:min-h-7 px-2.5 py-0.5 rounded-md text-[13px] font-600 no-underline hover:underline'
const style = computed(() => ({ background: fam.value.bg, color: fam.value.color, boxShadow: props.sol.labels.length ? 'inset 0 0 0 1.5px #16221F' : null }))
const label = computed(() => `${props.sol.names[0]} · ${props.sol.license || t('badge.nolicense')}`)
</script>

<template>
  <RouterLink v-if="hasDetail(sol)" :to="`/solutions/${sol.id}`" :class="cls" :style="style" :title="`${fam.name} : ${fam.desc}`">{{ label }}<span class="sr-only"> {{ t('a11y.fiche') }}</span></RouterLink>
  <a v-else :href="sol.url" target="_blank" rel="noopener noreferrer" :class="cls" :style="style" :title="`${fam.name} : ${fam.desc}`">{{ label }}<span aria-hidden="true">↗</span><span class="sr-only"> {{ t('a11y.site') }}</span></a>
</template>
