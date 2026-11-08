<script setup>
import { useRoute } from 'vue-router'
import { coverage, repoUrl } from './lib/catalog'
import { t, setLang, LANGS } from './lib/i18n'
import { state } from './lib/store'
import Icon from './components/Icon.vue'

const LANG_NAMES = { fr: 'Français', en: 'English' }
const nav = [['/catalogue', 'nav.catalog', 'grid'], ['/solutions', 'nav.solutions', 'search'], ['/budget', 'nav.budget', 'chart'], ['/a-propos', 'nav.about', 'info'], ['/contact', 'nav.contact', 'mail']]
// Focus visible sur fond vert : anneau clair
const ring = 'outline-none focus-visible:(ring-2 ring-paper ring-offset-2 ring-offset-brand)'
// /solutions/xxx garde « Solutions » actif ; l'accueil « / » n'a pas d'onglet, le logo y mène
const route = useRoute()
const isActive = (to) => route.path.startsWith(to)
</script>

<template>
  <div class="min-h-screen bg-paper text-ink font-sans flex flex-col pb-[72px] md:pb-0">
    <header class="bg-brand text-paper">
      <div class="wrap min-h-[68px] py-3 md:py-0 flex flex-wrap items-center gap-x-10 gap-y-2">
        <RouterLink to="/" :aria-current="route.path === '/' ? 'page' : null" :aria-label="t('nav.home')" :class="ring + ' rounded-sm font-display font-800 text-xl md:text-[22px] text-paper no-underline'">Mon SI Libre</RouterLink>

        <nav :aria-label="t('nav.aria')" class="hidden md:flex flex-wrap gap-1 flex-auto">
          <RouterLink v-for="[to, key] in nav" :key="to" v-slot="{ href, navigate }" :to="to" custom>
            <a :href="href" :aria-current="isActive(to) ? 'page' : null" @click="navigate"
              :class="[ring, 'px-3.5 py-2 rounded-lg no-underline', isActive(to) ? 'bg-paper/16 text-white font-600' : 'text-paper hover:bg-paper/10']">{{ t(key) }}</a>
          </RouterLink>
        </nav>

        <!-- Avancement : affiché tant que le catalogue n'est pas complet -->
        <div v-if="!coverage.complete" class="order-last md:order-none w-full md:w-auto flex items-center gap-2.5 text-[13px] md:text-sm"
          :title="t('banner', { done: coverage.done, total: coverage.total, pct: coverage.pct })">
          <span class="md:order-2 block flex-1 md:flex-none md:w-24 h-[5px] md:h-1.5 rounded-full bg-paper/25 overflow-hidden" role="progressbar"
            :aria-label="t('banner.aria')" :aria-valuenow="coverage.pct" aria-valuemin="0" aria-valuemax="100">
            <span class="block h-full bg-paper" :style="{ width: coverage.pct + '%' }" />
          </span>
          <span><b>{{ t('banner.short') }}</b> · {{ t('banner.count', { done: coverage.done, total: coverage.total }) }}</span>
        </div>

        <div class="ml-auto md:ml-0 flex items-center gap-4">
          <div class="flex gap-0.5 p-[3px] rounded-lg border border-paper/35" role="group" :aria-label="t('lang.label')">
            <button v-for="l in LANGS" :key="l" type="button" :lang="l" :aria-pressed="state.lang === l" :title="LANG_NAMES[l]"
              :class="[ring, 'min-w-11 min-h-9 md:min-h-0 md:min-w-0 px-2.5 py-1 rounded-md text-[13px] uppercase cursor-pointer', state.lang === l ? '!bg-paper !text-brand font-700' : 'text-paper hover:bg-paper/10']"
              @click="setLang(l)">{{ l }}<span class="sr-only"> ({{ LANG_NAMES[l] }})</span></button>
          </div>
          <a v-if="repoUrl" :href="repoUrl" target="_blank" rel="noopener noreferrer" :class="ring + ' hidden md:flex rounded-sm text-paper'" :aria-label="t('gh.label')" :title="t('footer.source')">
            <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
      </div>
    </header>

    <div class="flex-1"><RouterView /></div>

    <footer class="mt-7 md:mt-0 border-t border-line">
      <div class="wrap py-5 md:py-6 flex flex-col md:flex-row flex-wrap md:justify-between gap-2.5 md:gap-3 text-[13px] md:text-sm text-mute">
        <span>{{ t('footer.tagline') }}</span>
        <span class="flex gap-5">
          <a v-if="repoUrl" :href="repoUrl" target="_blank" rel="noopener noreferrer" class="underline focusable">{{ t('footer.source') }}<span class="sr-only"> {{ t('a11y.newtab') }}</span></a>
          <RouterLink to="/mentions-legales" class="underline focusable">{{ t('footer.legal') }}</RouterLink>
        </span>
      </div>
    </footer>

    <!-- Téléphone : barre d'onglets en bas -->
    <nav :aria-label="t('nav.aria')" class="md:hidden fixed inset-x-0 bottom-0 z-20 h-[72px] px-1 pt-1.5 pb-2.5 bg-white border-t border-line grid grid-cols-5">
      <RouterLink v-for="[to, key, icon] in nav" :key="to" v-slot="{ href, navigate }" :to="to" custom>
        <a :href="href" :aria-current="isActive(to) ? 'page' : null" @click="navigate"
          :class="['focusable flex flex-col items-center justify-center gap-[3px] text-[11px] no-underline rounded-lg', isActive(to) ? 'font-700 text-brand' : 'text-mute']">
          <span :class="['flex px-3.5 py-[3px] rounded-full', isActive(to) ? 'bg-brandsoft' : '']"><Icon :name="icon" :size="22" /></span>{{ t(key) }}
        </a>
      </RouterLink>
    </nav>
  </div>
</template>
