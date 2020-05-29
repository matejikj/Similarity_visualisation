import Vue from 'vue'
import Vuex from 'vuex'
import Visualisation from '../visualisation/Visualisation.store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Visualisation
  }
})
