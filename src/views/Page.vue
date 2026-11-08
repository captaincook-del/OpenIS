<script setup>
import { computed } from 'vue'
import { pages } from '../lib/catalog'
import { t } from '../lib/i18n'
import RichText from '../components/RichText.vue'

// Page de texte (mentions légales) : une carte par section.
// Chaque section porte l'id sec-N : /mentions-legales?s=N y fait défiler (voir router/index.js)
const props = defineProps({ pageKey: String })
const page = computed(() => pages[props.pageKey])
</script>

<template>
  <main class="wrap pt-6 md:pt-10 pb-4 md:pb-16">
    <h1 class="h-page">{{ page.title }}</h1>
    <p v-if="!pages.translated" class="mt-2 mb-0 text-sm text-mute">{{ t('home.untranslated') }}</p>
    <p v-if="page.lead" class="mt-3 md:mt-4.5 mb-0 text-lg md:text-[22px] leading-normal max-w-[860px]">{{ page.lead }}</p>

    <!-- Une carte par section, toutes sur la même largeur -->
    <div class="mt-6 md:mt-8 flex flex-col gap-3 md:gap-4">
      <section v-for="(s, i) in page.sections" :id="'sec-' + i" :key="s.h" class="p-4 md:p-[22px] card">
        <h2 class="m-0 font-display font-700 text-xl md:text-[22px]">{{ s.h }}</h2>
        <template v-for="(b, j) in s.p" :key="j">
          <!-- Bloc cité : adresses, extraits de loi. Une ligne par entrée -->
          <blockquote v-if="b.quote" class="mt-3 mx-0 pl-4 border-l-4 border-brand/40 leading-relaxed max-w-[760px]">
            <p v-for="(l, k) in b.quote" :key="k" class="m-0"><RichText :text="l" /></p>
          </blockquote>
          <p v-else class="mt-2.5 mb-0 leading-relaxed max-w-[760px]"><RichText :text="b" /></p>
        </template>
      </section>
    </div>
  </main>
</template>
