import Vue from 'vue'
import Vuex from 'vuex'
import circleVisualisation from '@/circle-visualisation/CircleVisualisation.store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    circleVisualisation
  }
})
