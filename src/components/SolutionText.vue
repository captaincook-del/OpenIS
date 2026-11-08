<script setup>
import { computed } from 'vue'
import { annotate, hasDetail } from '../lib/catalog'
import { t } from '../lib/i18n'

// Texte d'un composant : les noms de solutions connues deviennent des liens.
// Fiche = lien plein qui reste sur le site ; site du projet = lien pointillé avec ↗, nouvel onglet.
const props = defineProps({ text: String, color: String })
const a = computed(() => annotate(props.text))
const base = 'underline underline-offset-4 decoration-2 focusable'
</script>

<template>
  <p class="m-0 text-[17px] md:text-base font-600 md:font-400 leading-snug md:leading-relaxed">
    <template v-for="(p, i) in a.parts" :key="i">
      <RouterLink v-if="p.s && hasDetail(p.s)" :to="`/solutions/${p.s.id}`" :class="base + ' font-700'" :style="{ textDecorationColor: color }">{{ p.t }}<span class="sr-only"> {{ t('a11y.fiche') }}</span></RouterLink>
      <a v-else-if="p.s" :href="p.s.url" target="_blank" rel="noopener noreferrer" :class="base + ' decoration-dotted'" :style="{ textDecorationColor: color }">{{ p.t }}<span aria-hidden="true" class="text-sm"> ↗</span><span class="sr-only"> {{ t('a11y.site') }}</span></a>
      <template v-else>{{ p.t }}</template>
    </template>
  </p>
</template>
