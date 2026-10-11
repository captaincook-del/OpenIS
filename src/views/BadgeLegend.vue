<script setup>
import { families, labelDefs } from '../catalog'
</script>

<template>
  <aside class="p-4 rounded-lg border border-line bg-white/60 text-sm" aria-label="Légende des badges">
    <h3 class="font-600">Comprendre les badges</h3>
    <ul class="mt-3 grid gap-2 md:grid-cols-2">
      <li v-for="f in families" :key="f.id" class="flex items-start gap-2">
        <span class="px-2 py-0.5 rounded-full font-600 text-xs shrink-0" :style="{ color: f.color, background: f.bg }">{{ f.name }}</span>
        <span class="text-mute">{{ f.desc }}</span>
      </li>
      <li v-for="l in labelDefs" :key="l.id" class="flex items-start gap-2">
        <a :href="l.url" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded-full border border-ink text-xs font-600 shrink-0 focusable">✓ {{ l.name }}</a>
        <span class="text-mute">{{ l.desc }}</span>
      </li>
    </ul>
    <p class="mt-3 text-mute">Licences et labels sont indicatifs : vérifiez la version que vous déployez auprès du projet.</p>
  </aside>
</template>
