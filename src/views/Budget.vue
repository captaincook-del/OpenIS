<script setup>
import { computed, toRefs } from 'vue'
import { levels, sizes, pricing } from '../catalog'
import { state } from '../store'

const { sizeId, levelIdx } = toRefs(state)
const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: pricing.currency, maximumFractionDigits: 0 })
const years = pricing.horizon_years

const rows = computed(() => {
  const p = pricing.sizes[sizeId.value]
  return levels.map((l, i) => {
    const run = p.opex[i] + p.etp[i] * pricing.etp_cost
    const libre = p.capex[i] + years * run
    const prop = years * p.proprietary[i]
    return { l, i, capex: p.capex[i], run, libre, prop, gain: prop - libre }
  })
})
const max = computed(() => Math.max(...rows.value.flatMap((r) => [r.libre, r.prop])))
const w = (v) => Math.max(2, (v / max.value) * 100) + '%'
</script>

<template>
  <main class="max-w-6xl mx-auto px-5 py-8">
    <h1 class="font-display font-800 text-4xl md:text-5xl">Combien ça coûte, sur {{ years }} ans ?</h1>
    <p class="mt-4 text-mute max-w-2xl">Investissement initial, exploitation annuelle et temps d'administration, comparés à une pile propriétaire équivalente.</p>

    <div class="mt-6 flex flex-wrap gap-2" role="radiogroup" aria-label="Taille">
      <button v-for="s in sizes" :key="s.id" role="radio" :aria-checked="sizeId === s.id" class="focusable chip"
        :class="sizeId === s.id ? '!bg-brandsoft !border-brand font-700' : ''" @click="sizeId = s.id">{{ s.name }} ({{ s.users }})</button>
    </div>

    <ul class="mt-8 grid gap-3">
      <li v-for="r in rows" :key="r.l.id">
        <button class="focusable w-full text-left p-4 rounded-lg border bg-white/60 hover:bg-white grid gap-3 md:grid-cols-[220px_1fr_170px] items-center"
          :class="levelIdx === r.i ? 'border-brand bg-white shadow-sm' : 'border-line'" :aria-pressed="levelIdx === r.i" :style="{ borderLeftColor: r.l.color, borderLeftWidth: '8px' }" @click="levelIdx = r.i">
          <span class="font-600">{{ r.l.name }}
            <span class="block text-sm text-mute font-400">Mise en place {{ eur.format(r.capex) }} · {{ eur.format(r.run) }}/an</span></span>
          <span class="grid gap-1.5" aria-hidden="true">
            <span class="h-3 rounded-sm" :style="{ width: w(r.libre), background: r.l.color }" />
            <span class="h-3 rounded-sm bg-mute/40" :style="{ width: w(r.prop) }" />
          </span>
          <span class="text-sm">
            <span class="block"><b>Libre</b> {{ eur.format(r.libre) }}</span>
            <span class="block text-mute">Propriétaire {{ eur.format(r.prop) }}</span>
            <span class="block font-600" :class="r.gain >= 0 ? 'text-green-700' : 'text-red-700'">
              {{ r.gain >= 0 ? 'Économie' : 'Surcoût' }} {{ eur.format(Math.abs(r.gain)) }}</span>
          </span>
        </button>
      </li>
    </ul>
    <p class="mt-6 text-sm text-mute max-w-3xl">{{ pricing.disclaimer }} Le temps d'administration est valorisé à {{ eur.format(pricing.etp_cost) }} par an et par équivalent temps plein.</p>
  </main>
</template>
