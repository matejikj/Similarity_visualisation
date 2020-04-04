import Vue from 'vue'
import VueRouter from 'vue-router'
import Visualisation from '../views/Visualisation.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Visualisation',
    component: Visualisation
  }
]

const router = new VueRouter({
  routes
})

export default router
