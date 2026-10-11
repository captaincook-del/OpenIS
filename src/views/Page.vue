<script setup>
import { computed } from 'vue'
import { pages, coverage } from '../catalog'
import RichText from './RichText.vue'

const props = defineProps({ pageKey: String })
const page = computed(() => pages[props.pageKey])
</script>

<template>
  <main class="max-w-3xl mx-auto px-5 py-8">
    <h1 class="font-display font-800 text-4xl md:text-5xl">{{ page.title }}</h1>
    <section v-for="s in page.sections" :key="s.h" class="mt-8">
      <h2 class="font-display font-700 text-2xl">{{ s.h }}</h2>
      <template v-for="(b, i) in s.p" :key="i">
        <!-- Bloc cité : adresses, extraits de loi. Une ligne par entrée -->
        <blockquote v-if="b.quote" class="mt-3 pl-4 border-l-4 border-brand/40 leading-relaxed max-w-prose">
          <p v-for="(l, j) in b.quote" :key="j"><RichText :text="l" /></p>
        </blockquote>
        <p v-else class="mt-3 leading-relaxed max-w-prose"><RichText :text="b" /></p>
      </template>
    </section>

    <section v-if="page.roadmap" class="mt-4">
      <p class="font-600">{{ coverage.done }} domaines terminés sur {{ coverage.total }} ({{ coverage.pct }} %) · pointillés : à compléter</p>
      <div v-for="[group, list] in coverage.groups" :key="group" class="mt-5">
        <h3 class="font-600">{{ group }}</h3>
        <ul class="mt-2 flex flex-wrap gap-2">
          <li v-for="d in list" :key="d.id" class="chip" :class="d.status === 'done' ? '!bg-brandsoft !border-brand font-600' : d.status === 'partial' ? '!border-brand !border-dashed' : 'text-mute'">
            {{ d.name }}<span class="sr-only"> ({{ d.status === 'done' ? 'terminé' : d.status === 'partial' ? 'à compléter' : 'prévu' }})</span></li>
        </ul>
      </div>
    </section>
  </main>
</template>
