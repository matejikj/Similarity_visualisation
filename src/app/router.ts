import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import CircleVisualisation from '../circle-visualisation/CircleVisualisation.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'CircleVisualisation',
    component: CircleVisualisation
  },
  {
    path: '/tutorial',
    name: 'Tutorial',
    component: () => import('../tutorial/TutorialView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
