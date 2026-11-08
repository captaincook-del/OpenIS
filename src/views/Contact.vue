<script setup>
import { computed, reactive } from 'vue'
import { pages } from '../lib/catalog'
import { t } from '../lib/i18n'
import Icon from '../components/Icon.vue'

const c = computed(() => pages.contact)
const f = reactive({ topic: 0, name: '', email: '', page: '', message: '' })

function send() {
  const topic = c.value.topics[f.topic]
  const subject = `[Mon SI Libre] ${topic}${f.page ? ' – ' + f.page : ''}`
  const body = `${f.message}\n\n---\n${t('ct.b.topic')} ${topic}\n${t('ct.b.page')} ${f.page || t('ct.b.none')}\n${f.name ? t('ct.b.name') + ' ' + f.name + '\n' : ''}${t('ct.b.reply')} ${f.email}`
  // Première entrée de `topics` = réclamation : elle part vers l'adresse dédiée
  const to = f.topic === 0 ? c.value.claims_email : c.value.email
  location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
const lab = 'flex flex-col gap-1.5 font-600'
const opt = 'font-400 text-sm text-mute'
</script>

<template>
  <main class="wrap pt-6 md:pt-10 pb-4 md:pb-16 flex flex-wrap gap-x-16 gap-y-5 md:gap-y-10 items-start">
    <div class="flex-[1_1_360px] md:max-w-[520px]">
      <h1 class="h-page">{{ c.title }}</h1>
      <p class="mt-3 md:mt-4 mb-0 text-[15px] md:text-base leading-relaxed text-mute">{{ c.intro }}</p>
      <div class="mt-4 md:mt-5 p-4 md:p-4.5 rounded-xl card flex gap-3.5">
        <Icon name="alert" :size="22" class="text-brand mt-0.5" />
        <p class="m-0 text-sm md:text-base leading-normal">{{ c.notice }}</p>
      </div>
      <p class="hidden md:block mt-4 mb-0 text-sm text-mute">{{ t('ct.legal1') }} <RouterLink to="/mentions-legales" class="underline focusable">{{ t('ct.legal2') }}</RouterLink> {{ t('ct.legal3') }}</p>
    </div>

    <form class="flex-[999_1_560px] min-w-0 md:max-w-[880px] md:(p-7 bg-white border border-line rounded-2xl) grid gap-4.5 md:gap-5 md:grid-cols-2" @submit.prevent="send">
      <fieldset class="md:col-span-2">
        <legend class="font-600 mb-2.5">{{ t('ct.topic') }}</legend>
        <div class="grid gap-2 sm:grid-cols-2">
          <label v-for="(x, i) in c.topics" :key="i" :class="['radio-card items-center gap-2 min-h-12 px-3.5 py-2 bg-white', f.topic === i ? 'border-brand !bg-brandsoft font-700' : 'border-line']">
            <input v-model="f.topic" type="radio" name="topic" :value="i" class="sr-only" />
            <Icon v-if="f.topic === i" name="check" :size="16" :stroke="3" />{{ x }}</label>
        </div>
      </fieldset>
      <label :class="lab + ' md:col-span-2'">
        <span>{{ t('ct.page') }} <span :class="opt">{{ t('ct.optional') }}</span></span>
        <input v-model="f.page" :placeholder="t('ct.pageph')" class="field min-h-[52px] md:min-h-12" /></label>
      <label :class="lab + ' md:col-span-2'">{{ t('ct.message') }}
        <textarea v-model="f.message" required rows="6" :placeholder="t('ct.msgph')" class="field py-3 resize-y" /></label>
      <label :class="lab">
        <span>{{ t('ct.name') }} <span :class="opt">{{ t('ct.optional') }}</span></span>
        <input v-model="f.name" autocomplete="nickname" class="field min-h-[52px] md:min-h-12" /></label>
      <label :class="lab">
        <span>{{ t('ct.email') }} <span :class="opt">{{ t('ct.required') }}</span></span>
        <input v-model="f.email" type="email" inputmode="email" required autocomplete="email" class="field min-h-[52px] md:min-h-12" /></label>
      <div class="md:col-span-2 flex flex-col-reverse md:flex-row flex-wrap md:items-center justify-between gap-3">
        <p class="m-0 text-[13px] md:text-sm text-mute">{{ t('ct.opens') }}</p>
        <button class="focusable min-h-[52px] md:min-h-12 px-6 rounded-xl md:rounded-[10px] bg-brand text-paper font-700 cursor-pointer hover:opacity-90">{{ t('ct.send') }}</button>
      </div>
      <p class="md:hidden m-0 text-[13px] text-mute leading-normal">{{ t('ct.legal1') }} <RouterLink to="/mentions-legales" class="underline focusable">{{ t('ct.legal2') }}</RouterLink> {{ t('ct.legal3') }}</p>
    </form>
  </main>
</template>
