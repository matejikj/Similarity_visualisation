<template>
    <p></p>
</template>

<script lang="ts">
import Vue from 'vue'
import { Node, Label, Link } from '../models/types'
import store from '../store'
// import * as d3 from 'd3'
// import store from '../store'

export default Vue.extend({
  name: 'Visualisation',

  data: () => ({
  }),
  mounted () {
    this.$store.subscribe((mutation) => {
      switch (mutation.type) {
        case 'changeLabels':
          this.initializeNodes()
          console.log('LEFT')
          break
        case 'changeActiveViewDepth':
          // ahoj
          // visualise();
          break
      }
    })
  },
  methods: {
    initializeNodes: function (): Array<Node> {
      const array = new Array<Node>()
      const visitedNodesArray = new Array<string>()
      const root = new Node('ROOT', new Array<Node>(), new Array<Node>(), 'root', undefined, undefined)
      array.push(root)
      const links = store.state.hierarchy
      const labels = store.state.labels
      if (links !== undefined) {
        for (let i = 0; i < links.length; i++) {
          if (!visitedNodesArray.includes(links[i].target)) {
            visitedNodesArray.push(links[i].target)
            const node = new Node(labels.filter(x => x.id === links[i].target)[0].label, new Array<Node>(), new Array<Node>(), links[i].target, undefined, undefined)
            array.push(node)
          }
          if (!visitedNodesArray.includes(links[i].source)) {
            visitedNodesArray.push(links[i].source)
            const node = new Node(labels.filter(x => x.id === links[i].source)[0].label, new Array<Node>(), new Array<Node>(), links[i].source, undefined, undefined)
            array.push(node)
          }
        }
      }

      for (let i = 0; i < array.length; i++) {
        const id = array[i].id

        for (let j = 0; j < links.length; j++) {
          if (links[j].target === id) {
            array[i].parents.push(array.filter(x => x.id === links[j].source)[0])
          }
          if (links[j].source === id) {
            array[i].children.push(array.filter(x => x.id === links[j].target)[0])
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

      return array
    },
    buildTree: function (id: string, depth: number): Node {
      const nodesArray = this.initializeNodes()

      const root = Object.assign(Node, store.state.nodes.filter(x => x.id === id)[0])
      const maxDepth = 0
      root.depth = 0

      return root
    },
    // eslint-disable-next-line
    visualise: function (leftDataset: any, rightDataset: any, hierarchy: any, labels: any, depth: number, id: string) {
      const treeRoot = this.buildTree(id, depth)
    }
  }
})
</script>
