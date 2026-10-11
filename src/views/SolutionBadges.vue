<script setup>
import { familyOf, labelDefs } from '../catalog'
defineProps({ sol: Object })
</script>

<template>
  <span class="inline-flex flex-wrap items-center gap-1">
    <span class="px-2 py-0.5 rounded-full font-600 text-xs" :style="{ color: familyOf(sol).color, background: familyOf(sol).bg }"
      :title="`${familyOf(sol).name} : ${familyOf(sol).desc}`">{{ sol.license || 'Licence à renseigner' }}</span>
    <a v-for="id in sol.labels" :key="id" :href="labelDefs.find((l) => l.id === id).url" target="_blank" rel="noopener noreferrer"
      class="px-2 py-0.5 rounded-full border border-ink text-xs font-600 focusable" :title="labelDefs.find((l) => l.id === id).desc">
      ✓ {{ labelDefs.find((l) => l.id === id).name }}</a>
  </span>
</template>
