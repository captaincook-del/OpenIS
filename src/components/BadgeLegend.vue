<script setup>
import { t } from '../lib/i18n'
import { families, labelDefs } from '../lib/catalog'
// `titled` : affiche son propre titre (sinon un <summary> parent le porte)
defineProps({ titled: Boolean })
</script>

<template>
  <section :aria-label="titled ? null : t('legend.title')">
    <h2 v-if="titled" class="m-0 text-[15px] font-700">{{ t('legend.title') }}</h2>
    <ul :class="['m-0 p-0 list-none flex flex-col gap-2.5 text-sm', titled ? 'mt-3' : '']">
      <li v-for="f in families" :key="f.id" class="flex gap-2.5 items-baseline">
        <span class="shrink-0 px-2 py-0.5 rounded-md font-600 text-xs" :style="{ color: f.color, background: f.bg }">{{ f.name }}</span>
        <span class="text-mute">{{ f.desc }}</span>
      </li>
    </ul>
    <p class="mt-3 mb-0 text-[13px] text-mute">
      {{ t('legend.labels') }}
      <template v-for="(l, i) in labelDefs" :key="l.id"><template v-if="i">, </template><a :href="l.url" target="_blank" rel="noopener noreferrer" class="underline focusable" :title="l.desc">{{ l.name }}<span class="sr-only"> {{ t('a11y.newtab') }}</span></a></template>.
      {{ t('legend.note') }}
    </p>
  </section>
</template>
