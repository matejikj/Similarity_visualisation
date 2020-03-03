import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    leftDatasetUrl: '',
    rightDatasetUrl: ''
  },
  mutations: {
    changeLeftDatasetUrl (state, value) {
      state.leftDatasetUrl = value
    },
    changeRightDatasetUrl (state, value) {
      state.rightDatasetUrl = value
    }
  },
  getters: {
    leftDatasetUrl: state => state.leftDatasetUrl,
    rightDatasetUrl: state => state.rightDatasetUrl
  },
  actions: {
  },
  modules: {
  }
})
