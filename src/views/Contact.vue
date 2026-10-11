<script setup>
import { reactive } from 'vue'
import { pages } from '../catalog'

const c = pages.contact
const f = reactive({ name: '', email: '', topic: c.topics[0], page: '', message: '' })

function send() {
  const subject = `[Monde Libre] ${f.topic}${f.page ? ' – ' + f.page : ''}`
  const body = `${f.message}\n\n---\nObjet : ${f.topic}\nPage ou contenu concerné : ${f.page || 'non précisé'}\n${f.name ? 'Nom ou pseudonyme : ' + f.name + '\n' : ''}Réponse à : ${f.email}`
  location.href = `mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
const input = 'w-full px-3 py-2 rounded-md border border-edge bg-white focusable'
</script>

<template>
  <main class="max-w-2xl mx-auto px-5 py-8">
    <h1 class="font-display font-800 text-4xl">{{ c.title }}</h1>
    <p class="mt-3 text-mute leading-relaxed">{{ c.intro }}</p>
    <p class="mt-4 p-4 rounded-md bg-white border-l-4 border-brand leading-relaxed">{{ c.notice }}</p>
    <p class="mt-3 text-sm text-mute">
      Pour une réclamation sur un contenu, voir aussi les
      <RouterLink to="/mentions-legales" class="underline focusable">mentions légales</RouterLink> (recours auprès de l'hébergeur).
    </p>

    <form class="mt-8 grid gap-4" @submit.prevent="send">
      <label class="grid gap-1">Objet
        <select v-model="f.topic" :class="input"><option v-for="t in c.topics" :key="t">{{ t }}</option></select></label>
      <label class="grid gap-1">Page ou contenu concerné <span class="text-sm text-mute">(facultatif, mais utile)</span>
        <input v-model="f.page" placeholder="Ex. fiche Redis, domaine Réseau, page Budget" :class="input" /></label>
      <label class="grid gap-1">Votre message
        <textarea v-model="f.message" required rows="7" placeholder="Que faut-il corriger ou discuter, et pourquoi ? Une source aide à traiter la demande." :class="input" /></label>
      <label class="grid gap-1">Nom ou pseudonyme <span class="text-sm text-mute">(facultatif)</span>
        <input v-model="f.name" autocomplete="nickname" :class="input" /></label>
      <label class="grid gap-1">Courriel pour la réponse
        <input v-model="f.email" type="email" required autocomplete="email" :class="input" /></label>
      <button class="focusable justify-self-start px-5 py-2.5 rounded-md bg-brand text-paper font-600 hover:opacity-90">Ouvrir mon courriel</button>
    </form>
  </main>
</template>
