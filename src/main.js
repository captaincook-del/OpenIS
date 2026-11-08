// Le reset d'abord : les classes UnoCSS (outline-none…) doivent passer après lui, sinon Firefox garde son contour de focus natif
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import './assets/base.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { state } from './lib/store'

document.documentElement.lang = state.lang
createApp(App).use(router).mount('#app')
