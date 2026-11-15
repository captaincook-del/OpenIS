<script setup>
import { computed } from 'vue'
import { pages } from '../lib/catalog'
import { t } from '../lib/i18n'
import RichText from '../components/RichText.vue'
import Icon from '../components/Icon.vue'

// Page de texte (mentions légales) : une carte, une rangée par section, titre à gauche et texte à droite.
// Chaque section porte l'id sec-N : /mentions-legales?s=N y fait défiler (voir router/index.js)
const props = defineProps({ pageKey: String })
const page = computed(() => pages[props.pageKey])

// Regroupe les paragraphes d'une section en blocs à afficher :
// une phrase courte terminée par « : » suivie d'un `quote` devient une carte titrée (adresse),
// et les cartes qui se suivent forment une grille ; les autres `quote` restent des citations.
const isLabel = (b) => typeof b === 'string' && b.length <= 80 && b.trimEnd().endsWith(':')
function blocks(s) {
  const out = []
  const p = s.p ?? []
  for (let i = 0; i < p.length; i++) {
    const b = p[i]
    if (!b) continue
    if (isLabel(b) && p[i + 1]?.quote) {
      const card = { label: b, lines: p[++i].quote }
      const last = out.at(-1)
      if (last?.cards) last.cards.push(card)
      else out.push({ cards: [card] })
    } else if (b.quote) out.push({ quote: b.quote })
    else out.push({ text: b, highlight: s.highlight && !out.length })
  }
  return out
}
</script>

<template>
  <main class="wrap pt-6 md:pt-11 pb-4 md:pb-16">
    <div class="max-w-[1180px] mx-auto">
      <h1 class="h-page">{{ page.title }}</h1>
      <p v-if="!pages.translated" class="mt-2 mb-0 text-sm text-mute">{{ t('home.untranslated') }}</p>
      <p v-if="page.lead" class="mt-3 md:mt-4.5 mb-0 text-lg md:text-[22px] leading-normal max-w-[860px]">{{ page.lead }}</p>

      <div class="mt-4.5 md:mt-7 card md:rounded-[18px] px-4 md:px-10 divide-y divide-rule">
        <section v-for="(s, i) in page.sections" :id="'sec-' + i" :key="s.h"
          class="py-5 md:py-8 grid md:grid-cols-[240px_minmax(0,1fr)] gap-x-8 gap-y-2.5">
          <div>
            <h2 class="m-0 font-display font-700 text-xl md:text-[22px]">{{ s.h }}</h2>
            <RouterLink v-if="s.contact" to="/contact"
              class="focusable hidden md:inline-flex mt-3.5 items-center gap-2 min-h-11 px-4 rounded-[10px] bg-brand !text-paper font-700 no-underline hover:opacity-92">
              {{ t('pg.contact') }}<Icon name="next" :size="18" :stroke="2.4" /></RouterLink>
          </div>

          <div class="min-w-0 max-w-[720px] flex flex-col gap-3 text-[15px] md:text-base leading-relaxed md:leading-[1.65]">
            <template v-for="(b, j) in blocks(s)" :key="j">
              <!-- Mis en avant : la réponse que l'on vient chercher -->
              <p v-if="b.highlight" class="m-0 flex gap-2.5 md:gap-3 items-start px-3.5 md:px-4.5 py-3 md:py-4 rounded-[10px] md:rounded-xl bg-brandsoft font-600 leading-normal">
                <Icon name="check" :size="20" :stroke="2.6" class="mt-px text-brand" /><span><RichText :text="b.text" /></span></p>
              <p v-else-if="b.text" class="m-0"><RichText :text="b.text" /></p>
              <!-- Adresses : cartes titrées, côte à côte sur ordinateur -->
              <div v-else-if="b.cards" class="grid gap-2 md:gap-3 md:grid-cols-2">
                <address v-for="c in b.cards" :key="c.label" class="not-italic px-3.5 md:px-4.5 py-3 md:py-4 rounded-[10px] md:rounded-xl bg-soft border border-rule leading-normal">
                  <span class="block mb-1 md:mb-1.5 text-[13px] text-mute"><RichText :text="c.label" /></span>
                  <template v-for="(l, k) in c.lines" :key="k"><RichText :text="l" /><br v-if="k < c.lines.length - 1" /></template>
                </address>
              </div>
              <!-- Citation (extrait de loi) -->
              <blockquote v-else-if="b.quote" class="m-0 pl-4.5 md:pl-6 pr-3.5 md:pr-5 py-3.5 md:py-4.5 rounded-[10px] md:rounded-xl bg-soft border-l-4 border-brand/50 md:text-[17px] leading-relaxed">
                <p v-for="(l, k) in b.quote" :key="k" class="m-0"><RichText :text="l" /></p>
              </blockquote>
              <!-- Téléphone : le bouton suit le premier paragraphe (sur ordinateur, il est sous le titre) -->
              <RouterLink v-if="s.contact && j === 0" to="/contact"
                class="focusable md:hidden flex items-center justify-center gap-2 h-12 rounded-xl bg-brand !text-paper font-700 no-underline">
                {{ t('pg.contact') }}<Icon name="next" :size="18" :stroke="2.4" /></RouterLink>
            </template>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>
