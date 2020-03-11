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
    leftArrowsId: Array<string>(),
    rightArrowsId: Array<string>(),
    activeViewDepth: 0,
    maximalViewDepth: 0,
    nodes: Array<Node>(),
    activeId: 'root'
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
    changeActiveId (state, value: string) {
      state.activeId = value
    },
    changeMaximalViewDepth (state, value: number) {
      state.maximalViewDepth = value
    },
    changeHierarchy (state, value: Array<Link>) {
      state.hierarchy = value
    },
    changeLabels (state, value: Array<Label>) {
      state.labels = value
    },
    changeNodes (state, value: Array<Node>) {
      state.nodes = value
    },
    changeLeftArrowsId (state, value: Array<string>) {
      state.leftArrowsId = value
    },
    changeRightArrowsId (state, value: Array<string>) {
      state.rightArrowsId = value
    }
  },
  actions: {
  },
  modules: {
  }
})
