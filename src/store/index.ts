import Vue from 'vue'
import Vuex from 'vuex'
import { ROOT_LABEL, ROOT_ID, MAX_DEPTH } from '@/static/constants.ts'
import { Link, MappingNode, Label, Node } from '@/models'
import { createLabels, createLinks, createNodes, createTree } from '@/utils/create'

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
    root: new Node(ROOT_LABEL, Array<Node>(), Array<Node>(), ROOT_ID, null, null),
    circlesPath: [ROOT_ID],
    depth: 2,
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
    changeLinks (state, value: Array<Link>) {
      state.links = value
    },
    changeLabels (state, value: Array<Label>) {
      state.labels = value
    },
    changeNodes (state, value: Array<Node>) {
      state.nodes = value
    }
  },
  getters: {
    getMaxDepth: (state) => {
      return state.maxDepth
    },
    getDepth: (state) => {
      return state.depth
    },
    getRoot: (state) => {
      return state.root
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
    }
  },
  actions: {
    initialize: function () {
      this.state.labels = createLabels(this.state.leftDataset, this.state.rightDataset)
      this.state.links = createLinks(this.state.leftDataset, this.state.rightDataset)
      this.state.nodes = createNodes(this.state.links, this.state.labels)
    },
    buildTree: function () {
      if (this.state.nodes.length === 0) {
        return undefined
      } else {
        this.state.root = createTree(this.state.nodes, this.state.depth)
      }
    }
  },
  modules: {
  }
})
