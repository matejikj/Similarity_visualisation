import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import VisMaster from '../visualisation/VisMaster.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Visualisation',
    component: VisMaster
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
