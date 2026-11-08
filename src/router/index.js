import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Catalog from '../views/Catalog.vue'
import Budget from '../views/Budget.vue'
import Solutions from '../views/Solutions.vue'
import SolutionPage from '../views/SolutionPage.vue'
import Contact from '../views/Contact.vue'
import Page from '../views/Page.vue'
import About from '../views/About.vue'

export default createRouter({
  history: createWebHashHistory(),
  // Mode hash : pas d'ancre #id. ?s=N fait défiler jusqu'à la section N d'une page (mentions légales depuis l'À propos)
  scrollBehavior: (to) => (to.query.s != null ? { el: '#sec-' + to.query.s, top: 16 } : { top: 0 }),
  routes: [
    { path: '/', component: Home },
    { path: '/catalogue', component: Catalog },
    { path: '/budget', component: Budget },
    { path: '/solutions', component: Solutions },
    { path: '/solutions/:id', component: SolutionPage, props: true },
    { path: '/a-propos', component: About },
    { path: '/contact', component: Contact },
    { path: '/mentions-legales', component: Page, props: { pageKey: 'legal' } },
  ],
})
