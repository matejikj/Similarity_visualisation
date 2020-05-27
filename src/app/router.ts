import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Root from '../vis-container/Root.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Visualisation',
    component: Root
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
