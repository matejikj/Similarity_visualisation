import Vue from 'vue'
import Vuex from 'vuex'
import { Position, ROOT_LABEL, ROOT_ID, MappingNode } from '@/models/types'
import { Link } from '@/models/Link'
import { Label } from '@/models/Label'
import { Node } from '@/models/Node'
import { Mapping } from '@/models/Mapping'
import { Visualisation } from '@/models/Visualisation'
import { History } from '@/models/History'
import { Circle } from '@/models/Circle'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    leftDataset: Object(),
    rightDataset: Object(),
    leftMapping: new Mapping(),
    rightMapping: new Mapping(),
    labels: Array<Label>(),
    links: Array<Link>(),
    nodes: Array<Node>(),
    path: new History(),
    visualisation: new Visualisation(0, 0),
    dialog: false
  },
  mutations: {
    changeDialog (state, value: boolean) {
      state.dialog = value
    },
    changeLeftDataset (state, value: object) {
      state.leftDataset = value
    },
    changeRightDataset (state, value: object) {
      state.rightDataset = value
    },
    changeLinks (state, value: Array<Link>) {
      state.links = value
    },
    changeLabels (state, value: Array<Label>) {
      state.labels = value
    },
    changeNodes (state, value: Array<Node>) {
      state.nodes = value
    },
    changeVisDepth (state, value: number) {
      state.visualisation.activeDepth = value
    },
    changeVisRootId (state, value: string) {
      state.visualisation.rootID = value
    },
    changeVisHeight (state, value: number) {
      state.visualisation.height = value
    },
    changeVisWidth (state, value: number) {
      state.visualisation.width = value
    },
    changePathVisWidth (state, value: number) {
      state.path.canvasWidth = value
    },
    changeLeftSelectedMappingNodes (state, value: Array<MappingNode>) {
      state.leftMapping.selectedNodes = value
    },
    changeRightSelectedMappingNodes (state, value: Array<MappingNode>) {
      state.rightMapping.selectedNodes = value
    },
    changeLeftSelectedMapping (state, value: number) {
      state.leftMapping.selectedMapping = value
    },
    changeRightSelectedMapping (state, value: number) {
      state.rightMapping.selectedMapping = value
    }
  },
  getters: {
    getMaxDepth: (state) => {
      return state.visualisation.maxDepth
    },
    getViewDepth: (state) => {
      return state.visualisation.activeDepth
    },
    getDialog: (state) => {
      return state.dialog
    },
    getCircles: (state) => {
      return state.visualisation.circles
    },
    getLeftArrows: (state) => {
      return state.visualisation.leftArrows
    },
    getRightArrows: (state) => {
      return state.visualisation.rightArrows
    },
    getLeftMapping: (state) => {
      return state.leftMapping.items
    },
    getRightMapping: (state) => {
      return state.rightMapping.items
    },
    getPath: (state) => {
      return state.path.circles
    }
  },
  actions: {
    repackCircles: function (): void {
      this.state.visualisation.packCircles(this.state.visualisation.root)
      this.state.visualisation.repaintArrows(Position.Left, this.state.leftMapping.selectedNodes)
      this.state.visualisation.repaintArrows(Position.Right, this.state.rightMapping.selectedNodes)
    },
    toggleDialog: function (): void {
      this.state.dialog = !this.state.dialog
    },
    cutPath: function (context, value: number): void {
      this.state.path.pathIds = this.state.path.pathIds.slice(0, value + 1)
      this.state.path.createCircles(this.state.nodes)
    },
    resetActivePath: function (): void {
      this.state.path.pathIds = [ROOT_ID]
      this.state.path.createCircles(this.state.nodes)
    },
    resetRootId: function (): void {
      this.state.visualisation.rootID = ROOT_ID
    },
    repaintArrows: function (): void {
      this.state.visualisation.repaintArrows(Position.Left, this.state.leftMapping.selectedNodes)
      this.state.visualisation.repaintArrows(Position.Right, this.state.rightMapping.selectedNodes)
    },
    paintArrows: function (context, position: Position): void {
      switch (position) {
        case Position.Left:
          this.state.visualisation.repaintArrows(position, this.state.leftMapping.selectedNodes)
          break
        case Position.Right:
          this.state.visualisation.repaintArrows(position, this.state.rightMapping.selectedNodes)
          break
      }
    },
    circleClicked: function (context, data: Circle) {
      this.commit('changeVisRootId', data.id)
      this.commit('changeVisDepth', 1)
      this.state.path.refreshPath(data)
      this.state.path.createCircles(this.state.nodes)
      this.state.visualisation.createVisualisation(this.state.nodes)
    },
    pathClicked: function (context, data: Circle) {
      this.commit('changeVisRootId', data.id)
      this.commit('changeVisDepth', 1)
      this.state.visualisation.createVisualisation(this.state.nodes)
    },
    changeViewDepth: function (context, data) {
      this.commit('changeVisDepth', data)
      this.state.visualisation.createVisualisation(this.state.nodes)
    },
    paintCircles: function (): void {
      this.state.visualisation.createVisualisation(this.state.nodes)
    },
    createMapping: function (context, position: Position): void {
      switch (position) {
        case Position.Left:
          this.state.leftMapping.createMapping(this.state.leftDataset)
          break
        case Position.Right:
          this.state.rightMapping.createMapping(this.state.rightDataset)
          break
      }
    },
    resetMapping: function (context, position: Position): void {
      switch (position) {
        case Position.Left:
          this.state.leftMapping.resetMapping()
          break
        case Position.Right:
          this.state.rightMapping.resetMapping()
          break
      }
    },
    createHierarchy: function (): void {
      const leftDataset = this.state.leftDataset
      const rightDataset = this.state.rightDataset
      const array = Array<Link>()
      if (leftDataset.hierarchy !== undefined) {
        for (let i = 0; i < leftDataset.hierarchy.length; i++) {
          const newLink = new Link(leftDataset.hierarchy[i][2], leftDataset.hierarchy[i][0], leftDataset.hierarchy[i][1])
          array.push(newLink)
        }
      }
      if (rightDataset.hierarchy !== undefined) {
        for (let i = 0; i < rightDataset.hierarchy.length; i++) {
          const newLink = new Link(rightDataset.hierarchy[i][2], rightDataset.hierarchy[i][0], rightDataset.hierarchy[i][1])
          if (array.filter(x => x.parent === newLink.parent && x.child === newLink.child).length === 0) {
            array.push(newLink)
          }
        }
      }
      this.commit('changeLinks', array)
    },
    createLabels: function (): void {
      const leftDataset = this.state.leftDataset
      const rightDataset = this.state.rightDataset
      const array = Array<Label>()
      if (leftDataset.labels !== undefined) {
        for (const key in leftDataset.labels) {
          const value = leftDataset.labels[key]
          const newLabel = new Label(key, value)
          array.push(newLabel)
        }
      }
      if (rightDataset.labels !== undefined) {
        for (const key in rightDataset.labels) {
          const newLabel = new Label(key, rightDataset.labels[key])
          if (array.filter(x => x.id === newLabel.id && x.label === newLabel.label).length === 0) {
            array.push(newLabel)
          }
        }
      }
      this.commit('changeLabels', array)
    },
    initializeNodes: function (): void {
      const array = new Array<Node>()
      const visitedNodesArray = new Array<string>()
      if (this.state.links !== undefined) {
        for (let i = 0; i < this.state.links.length; i++) {
          if (!visitedNodesArray.includes(this.state.links[i].child)) {
            visitedNodesArray.push(this.state.links[i].child)
            const node = new Node(this.state.labels.filter(x => x.id === this.state.links[i].child)[0].label, new Array<Node>(), new Array<Node>(), this.state.links[i].child, null, null)
            array.push(node)
          }
          if (!visitedNodesArray.includes(this.state.links[i].parent)) {
            visitedNodesArray.push(this.state.links[i].parent)
            const node = new Node(this.state.labels.filter(x => x.id === this.state.links[i].parent)[0].label, new Array<Node>(), new Array<Node>(), this.state.links[i].parent, null, null)
            array.push(node)
          }
        }
      }

      for (let i = 0; i < array.length; i++) {
        const id = array[i].id

        for (let j = 0; j < this.state.links.length; j++) {
          if (this.state.links[j].child === id) {
            array[i].parents.push(array.filter(x => x.id === this.state.links[j].parent)[0])
          }
          if (this.state.links[j].parent === id) {
            array[i].children.push(array.filter(x => x.id === this.state.links[j].child)[0])
          }
        }
      }

      const noParentsNodes = array.filter(x => x.parents.length === 0)

      let root = array.filter(x => x.id === ROOT_ID)[0]

      if (root === undefined || root === null) {
        root = new Node(ROOT_LABEL, new Array<Node>(), new Array<Node>(), ROOT_ID, null, null)
        noParentsNodes.forEach(element => {
          element.parents.push(root)
          root.children.push(element)
        })
        array.splice(0, 0, root)
        const rootsArray = array.filter(x => x.parents.length === 0)
        for (let i = 0; i < rootsArray.length; i++) {
          if (rootsArray[i].id !== ROOT_ID) {
            rootsArray[i].parents.push(root)
            root.children.push(rootsArray[i])
          }
        }
      } else {
        noParentsNodes.forEach(element => {
          element.parents.push(root)
          root.children.push(element)
        })
      }
      this.commit('changeNodes', array)
    }
  },
  modules: {
  }
})
