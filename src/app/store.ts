import Vue from 'vue'
import Vuex from 'vuex'
import { ROOT_LABEL, ROOT_ID, MAX_DEPTH, Link, MappingNode, Label, Node } from '@/models'
import { createLabels, createLinks, createNodes, createTree } from '@/services/create'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    leftDataset: Object(),
    rightDataset: Object(),
    pathDataset: Object(),
    leftMapping: Array<MappingNode>(),
    rightMapping: Array<MappingNode>(),
    labels: Array<Label>(),
    links: Array<Link>(),
    nodes: Array<Node>(),
    rootId: ROOT_ID,
    hierarchy: new Node(ROOT_LABEL, Array<Node>(), Array<Node>(), ROOT_ID, undefined, undefined),
    circlesPath: Array<string>(),
    depth: 1,
    maxDepth: MAX_DEPTH
  },
  mutations: {
    changeLeftDataset (state, value: any) {
      state.leftDataset = value
    },
    changeRightDataset (state, value: any) {
      state.rightDataset = value
    },
    changeLeftMapping (state, value: Array<MappingNode>) {
      state.leftMapping = value
    },
    changeRightMapping (state, value: Array<MappingNode>) {
      state.rightMapping = value
    },
    changeDepth (state, value: number) {
      state.depth = value
    },
    changeMaxDepth (state, value: number) {
      state.maxDepth = value
    },
    changeLabels (state, value: Array<Label>) {
      state.labels = value
    },
    changeNodes (state, value: Array<Node>) {
      state.nodes = value
    },
    changeCirclesPath (state, value: Array<Label>) {
      state.labels = value
    }
  },
  getters: {
    getMaxDepth: (state) => {
      return state.maxDepth
    },
    getDepth: (state) => {
      return state.depth
    },
    getHierarchy: (state) => {
      return state.hierarchy
    },
    getLeftDataset: (state) => {
      return state.leftDataset
    },
    getRightDataset: (state) => {
      return state.rightDataset
    },
    getLeftMapping: (state) => {
      return state.leftMapping
    },
    getRightMapping: (state) => {
      return state.rightMapping
    },
    getCirclesPath: (state) => {
      return state.circlesPath
    },
    getNodes: (state) => {
      return state.nodes
    },
    getLabels: (state) => {
      return state.labels
    },
    getRootId: (state) => {
      return state.rootId
    }
  },
  actions: {
    initialize: function () {
      this.state.circlesPath = [ROOT_ID]
      this.state.labels = createLabels(this.state.leftDataset, this.state.rightDataset)
      this.state.links = createLinks(this.state.leftDataset, this.state.rightDataset)
      this.state.nodes = createNodes(this.state.links, this.state.labels)
    },
    buildTree: function () {
      if (this.state.nodes.length === 0) {
        return undefined
      } else {
        if (this.state.depth === 0) {
          this.state.depth = 1
        }
        this.state.hierarchy = createTree(this.state.nodes, MAX_DEPTH)
        const maxDepth = this.state.maxDepth
        if (maxDepth < this.state.depth) {
          this.state.hierarchy = createTree(this.state.nodes, maxDepth)
        } else {
          this.state.hierarchy = createTree(this.state.nodes, this.state.depth)
        }
        this.state.maxDepth = maxDepth
      }
    }
  },
  modules: {
  }
})
