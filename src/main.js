import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'
import './assets/base.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { state } from './lib/store'

document.documentElement.lang = state.lang
createApp(App).use(router).mount('#app')
