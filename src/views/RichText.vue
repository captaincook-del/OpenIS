<script setup>
import { computed } from 'vue'
import { pages } from '../catalog'

// Texte simple avec liens [texte](adresse) et jetons {email} et {claims_email} remplacés par les adresses de contact
const props = defineProps({ text: { type: String, default: '' } })
const parts = computed(() => {
  const src = props.text.replaceAll('{claims_email}', pages.contact.claims_email).replaceAll('{email}', pages.contact.email)
  const out = []
  let last = 0
  for (const m of src.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
    if (m.index > last) out.push({ t: src.slice(last, m.index) })
    out.push({ t: m[1], href: m[2], ext: /^https?:/.test(m[2]) })
    last = m.index + m[0].length
  }
  if (last < src.length) out.push({ t: src.slice(last) })
  return out
})
</script>

<template>
  <template v-for="(x, i) in parts" :key="i">
    <a v-if="x.href" :href="x.href" :target="x.ext ? '_blank' : null" :rel="x.ext ? 'noopener noreferrer' : null" class="underline underline-offset-2 focusable">{{ x.t }}<span v-if="x.ext" class="sr-only"> (nouvel onglet)</span></a>
    <template v-else>{{ x.t }}</template>
  </template>
</template>
