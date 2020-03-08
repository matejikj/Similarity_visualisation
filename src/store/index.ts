import Vue from 'vue'
import Vuex from 'vuex'
import { MappingNode } from '@/models/types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    leftDataset: Array<MappingNode>(),
    rightDataset: Array<MappingNode>()
  },
  mutations: {
    changeLeftDataset (state, value: Array<MappingNode>) {
      state.leftDataset = value
    },
    changeRightDataset (state, value: Array<MappingNode>) {
      state.rightDataset = value
    }
  },
  getters: {
    getLeftDataset: state => state.leftDataset,
    getRightDataset: state => state.rightDataset
  },
  actions: {
  },
  modules: {
  }
})
