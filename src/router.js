import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Budget from './views/Budget.vue'
import Solutions from './views/Solutions.vue'
import SolutionPage from './views/SolutionPage.vue'
import Contact from './views/Contact.vue'
import Page from './views/Page.vue'

export default createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', component: Home },
    { path: '/budget', component: Budget },
    { path: '/solutions', component: Solutions },
    { path: '/solutions/:id', component: SolutionPage, props: true },
    { path: '/a-propos', component: Page, props: { pageKey: 'about' } },
    { path: '/contact', component: Contact },
    { path: '/mentions-legales', component: Page, props: { pageKey: 'legal' } },
  ],
})
