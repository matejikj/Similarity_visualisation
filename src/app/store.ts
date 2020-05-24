import Vue from 'vue'
import Vuex from 'vuex'
import visualisation from '@/vis-container/Visualisation.store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    visualisation
  }
})
