import Vue from 'vue'
import Vuex from 'vuex'
import { ROOT_LABEL, ROOT_ID, MAX_DEPTH } from '@/static/constants.ts'
import { Link, MappingNode, Label, Node } from '@/models'
import { createLabels, createLinks, createNodes } from '@/utils/create'

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
    }
  },
  actions: {
    initialize: function (): void {
      this.state.labels = createLabels(this.state.leftDataset, this.state.rightDataset)
      this.state.links = createLinks(this.state.leftDataset, this.state.rightDataset)
      this.state.nodes = createNodes(this.state.links, this.state.labels)
    }
    // repackCircles: function (): void {
    //   this.state.visualisation.packCircles(this.state.visualisation.root)
    //   this.state.visualisation.repaintArrows(Position.Left, this.state.leftMapping.selectedNodes)
    //   this.state.visualisation.repaintArrows(Position.Right, this.state.rightMapping.selectedNodes)
    // },
    // toggleDialog: function (): void {
    //   this.state.dialog = !this.state.dialog
    // },
    // cutPath: function (context, value: number): void {
    //   this.state.path.pathIds = this.state.path.pathIds.slice(0, value + 1)
    //   this.state.path.createCircles(this.state.nodes)
    // },
    // resetActivePath: function (): void {
    //   this.state.path.pathIds = [ROOT_ID]
    //   this.state.path.createCircles(this.state.nodes)
    // },
    // resetRootId: function (): void {
    //   this.state.visualisation.rootID = ROOT_ID
    // },
    // repaintArrows: function (): void {
    //   this.state.visualisation.repaintArrows(Position.Left, this.state.leftMapping.selectedNodes)
    //   this.state.visualisation.repaintArrows(Position.Right, this.state.rightMapping.selectedNodes)
    // },
    // paintArrows: function (context, position: Position): void {
    //   switch (position) {
    //     case Position.Left:
    //       this.state.visualisation.repaintArrows(position, this.state.leftMapping.selectedNodes)
    //       break
    //     case Position.Right:
    //       this.state.visualisation.repaintArrows(position, this.state.rightMapping.selectedNodes)
    //       break
    //   }
    // },
    // circleClicked: function (context, data: Circle) {
    //   this.commit('changeVisRootId', data.id)
    //   this.commit('changeVisDepth', 1)
    //   this.state.path.refreshPath(data)
    //   this.state.path.createCircles(this.state.nodes)
    //   this.state.visualisation.createVisualisation(this.state.nodes)
    // },
    // pathClicked: function (context, data: Circle) {
    //   this.commit('changeVisRootId', data.id)
    //   this.commit('changeVisDepth', 1)
    //   this.state.visualisation.createVisualisation(this.state.nodes)
    // },
    // changeViewDepth: function (context, data) {
    //   this.commit('changeVisDepth', data)
    //   this.state.visualisation.createVisualisation(this.state.nodes)
    // },
    // paintCircles: function (): void {
    //   this.state.visualisation.createVisualisation(this.state.nodes)
    // },
    // createMapping: function (context, position: Position): void {
    //   switch (position) {
    //     case Position.Left:
    //       this.state.leftMapping.createMapping(this.state.leftDataset)
    //       break
    //     case Position.Right:
    //       this.state.rightMapping.createMapping(this.state.rightDataset)
    //       break
    //   }
    // },
    // resetMapping: function (context, position: Position): void {
    //   switch (position) {
    //     case Position.Left:
    //       this.state.leftMapping.resetMapping()
    //       break
    //     case Position.Right:
    //       this.state.rightMapping.resetMapping()
    //       break
    //   }
    // }
    // public createVisualisation (nodes: Array<Node>): void {
    //   if (this.activeDepth === 0) {
    //     this.activeDepth = 1
    //   }
    //   this.root = this.buildTree(nodes, MAX_DEPTH)
    //   const maxDepth = this.maxDepth
    //   if (maxDepth < this.activeDepth) {
    //     this.root = this.buildTree(nodes, maxDepth)
    //   } else {
    //     this.root = this.buildTree(nodes, this.activeDepth)
    //   }
    //   this.maxDepth = maxDepth
    //   this.packCircles(this.root)
    // }
  },
  modules: {
  }
})
