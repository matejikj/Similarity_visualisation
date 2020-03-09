import Vue from 'vue'
import Vuex from 'vuex'
import { MappingNode, Link, Label, Node } from '@/models/types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    leftDataset: Object(),
    rightDataset: Object(),
    leftMapping: Array<MappingNode>(),
    rightMapping: Array<MappingNode>(),
    hierarchy: Array<Link>(),
    labels: Array<Label>(),
    leftMappingChoice: Number(),
    rightMappingChoice: Number(),
    activeViewDepth: 1,
    maximalViewDepth: 10,
    nodes: Array<Node>(),
    activeId: String()
  },
  mutations: {
    changeLeftDataset (state, value: object) {
      state.leftDataset = value
    },
    changeRightDataset (state, value: object) {
      state.rightDataset = value
    },
    changeLeftMapping (state, value: Array<MappingNode>) {
      state.leftMapping = value
    },
    changeRightMapping (state, value: Array<MappingNode>) {
      state.rightMapping = value
    },
    changeLeftMappingChoice (state, value: number) {
      state.leftMappingChoice = value
    },
    changeRightMappingChoice (state, value: number) {
      state.rightMappingChoice = value
    },
    changeActiveViewDepth (state, value: number) {
      state.activeViewDepth = value
    },
    changeMaximalViewDepth (state, value: number) {
      state.activeViewDepth = value
    },
    changeHierarchy (state, value: Array<Link>) {
      state.hierarchy = value
    },
    changeLabels (state, value: Array<Label>) {
      state.labels = value
    },
    changeNodes (state, value: Array<Node>) {
      state.nodes = value
    }
  },
  actions: {
  },
  modules: {
  }
})
