import Vue from 'vue'
import Vuex from 'vuex'
import { Position, ROOT_LABEL, ROOT_ID } from '@/models/types'
import { Link } from '@/models/Link'
import { Label } from '@/models/Label'
import { Node } from '@/models/Node'
import { Mapping } from '@/models/Mapping'
import { Visualisation } from '@/models/Visualisation'

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
    visualisation: new Visualisation(0, 0)
  },
  mutations: {
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
    changeLeftSelectedMappingNodes (state, value: Array<string>) {
      state.leftMapping.selectedNodes = value
    },
    changeRightSelectedMappingNodes (state, value: Array<string>) {
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
    }
  },
  actions: {
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
    circleClicked: function (context, data) {
      this.commit('changeVisRootId', data)
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
    createHierarchy: function (): void {
      const leftDataset = this.state.leftDataset
      const rightDataset = this.state.rightDataset
      const array = Array<Link>()
      if (leftDataset.hierarchy !== undefined) {
        for (let i = 0; i < leftDataset.hierarchy.length; i++) {
          const newLink = new Link(leftDataset.hierarchy[i][2], leftDataset.hierarchy[i][0])
          array.push(newLink)
        }
      }
      if (rightDataset.hierarchy !== undefined) {
        for (let i = 0; i < rightDataset.hierarchy.length; i++) {
          const newLink = new Link(rightDataset.hierarchy[i][2], rightDataset.hierarchy[i][0])
          if (array.filter(x => x.source === newLink.source && x.target === newLink.target).length === 0) {
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
      const root = new Node(ROOT_LABEL, new Array<Node>(), new Array<Node>(), ROOT_ID, null, null)
      array.push(root)
      if (this.state.links !== undefined) {
        for (let i = 0; i < this.state.links.length; i++) {
          if (!visitedNodesArray.includes(this.state.links[i].target)) {
            visitedNodesArray.push(this.state.links[i].target)
            const node = new Node(this.state.labels.filter(x => x.id === this.state.links[i].target)[0].label, new Array<Node>(), new Array<Node>(), this.state.links[i].target, null, null)
            array.push(node)
          }
          if (!visitedNodesArray.includes(this.state.links[i].source)) {
            visitedNodesArray.push(this.state.links[i].source)
            const node = new Node(this.state.labels.filter(x => x.id === this.state.links[i].source)[0].label, new Array<Node>(), new Array<Node>(), this.state.links[i].source, null, null)
            array.push(node)
          }
        }
      }
      for (let i = 0; i < array.length; i++) {
        const id = array[i].id

        for (let j = 0; j < this.state.links.length; j++) {
          if (this.state.links[j].target === id) {
            array[i].parents.push(array.filter(x => x.id === this.state.links[j].source)[0])
          }
          if (this.state.links[j].source === id) {
            array[i].children.push(array.filter(x => x.id === this.state.links[j].target)[0])
          }
        }
      }
      const rootsArray = array.filter(x => x.parents.length === 0)
      for (let i = 0; i < rootsArray.length; i++) {
        if (rootsArray[i].id !== 'root') {
          rootsArray[i].parents.push(root)
          root.children.push(rootsArray[i])
        }
      }
      this.commit('changeNodes', array)
    }
  },
  modules: {
  }
})
