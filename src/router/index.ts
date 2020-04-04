import Vue from 'vue'
import VueRouter from 'vue-router'
import Visualisation from '../views/Visualisation.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Visualisation',
    component: Visualisation
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
  routes
})

export default router
