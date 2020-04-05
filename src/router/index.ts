import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import CircleVisualisationView from '../views/CircleVisualisationView.vue'

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
    // route level code-splitting
    // this generates a separate chunk (tutorial.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tutorial" */ '../views/Tutorial.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
