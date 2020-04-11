import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import CircleVisualisationView from '../circle-visualisation/CircleVisualisationView.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'CircleVisualisationView',
    component: CircleVisualisationView
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
