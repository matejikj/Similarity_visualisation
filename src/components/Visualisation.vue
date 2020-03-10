<template>
    <svg id="svg" ref="svg" width="100%" height="80vh">
      <g>
        <circle
          v-for="c in output"
          :key="c.id"
          :r="c.r"
          :cx="c.x"
          :cy="c.y"
          :stroke="c.stroke"
        >
        </circle>
      </g>
    </svg>
</template>

<script lang="ts">
import Vue from 'vue'
import { Node, Label, Link } from '../models/types'
import store from '../store'
import * as d3 from 'd3'

export default Vue.extend({
  name: 'Visualisation',
  data: () => ({
    height: 0,
    width: 0,
    output: Object()
  }),
  mounted () {
    this.$store.subscribe((mutation) => {
      switch (mutation.type) {
        case 'changeLabels':
          this.initializeNodes(store.state.hierarchy, store.state.labels)
          this.$store.commit('changeActiveViewDepth', 10)
          this.$store.commit('changeActiveId', 'root')
          this.visualise(store.state.activeId, store.state.activeViewDepth)
          console.log('changeLabels')
          break
        case 'changeActiveViewDepth':
          this.visualise(store.state.activeId, store.state.activeViewDepth)
          console.log('Zoom')
          break
      }
    })
  },
  methods: {
    initializeNodes: function (links: Array<Link>, labels: Array<Label>): void {
      const array = new Array<Node>()
      const visitedNodesArray = new Array<string>()
      const root = new Node('ROOT', new Array<Node>(), new Array<Node>(), 'root', null, null)
      array.push(root)
      if (links !== undefined) {
        for (let i = 0; i < links.length; i++) {
          if (!visitedNodesArray.includes(links[i].target)) {
            visitedNodesArray.push(links[i].target)
            const node = new Node(labels.filter(x => x.id === links[i].target)[0].label, new Array<Node>(), new Array<Node>(), links[i].target, null, null)
            array.push(node)
          }
          if (!visitedNodesArray.includes(links[i].source)) {
            visitedNodesArray.push(links[i].source)
            const node = new Node(labels.filter(x => x.id === links[i].source)[0].label, new Array<Node>(), new Array<Node>(), links[i].source, null, null)
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
      this.$store.commit('changeNodes', array)
    },
    buildTree: function (id: string, depth: number): Node {
      const nodesArray = store.state.nodes
      nodesArray.forEach(element => {
        element.depth = null
      })
      const tmpRoot = nodesArray.filter(x => x.id === id)[0]
      const root = new Node(tmpRoot.label, tmpRoot.parents, tmpRoot.children, tmpRoot.id, tmpRoot.depth, tmpRoot.color)
      let maxDepth = 0
      root.depth = 0
      const queue = Array<Node>()
      queue.push(root)
      while (queue.length !== 0) {
        const node = queue.shift()
        if (node !== undefined && node.children !== undefined) {
          if (node.children.length !== 0) {
            for (let i = 0; i < node.children.length; i++) {
              const tmpChildren = nodesArray.filter(x => x.id === node.children[i].id)[0]
              const children = new Node(tmpChildren.label, tmpChildren.parents, tmpChildren.children, tmpChildren.id, tmpChildren.depth, tmpChildren.color)
              node.children[i] = children
              if (node.depth !== null) {
                const newLevelDepth = node.depth + 1
                children.depth = newLevelDepth
                if (maxDepth < newLevelDepth) {
                  maxDepth = newLevelDepth
                }
                if (newLevelDepth < depth) {
                  queue.push(node.children[i])
                  console.log('PRIDANO')
                } else {
                  if (newLevelDepth === depth) {
                    children.children = []
                    children.value = 1
                  }
                }
              }
            }
          } else {
            node.children = []
            node.value = 1
          }
        }
      }
      return root
    },
    packCircles: function (root: Node) {
      const margin = 10
      // @ts-ignore
      console.log(this.$refs.svg.clientWidth)
      // @ts-ignore
      console.log(this.$refs.svg.clientHeight)

      const packChart = d3.pack()
      // @ts-ignore
      packChart.size([this.$refs.svg.clientWidth - margin, this.$refs.svg.clientHeight - margin])
      packChart.padding(10)
      const treeRoot = d3.hierarchy(root)
        .sum(d => Math.sqrt(d.value))

      const output = packChart(treeRoot).descendants()
      return output.map((d, i) => {
        return {
          id: i + 1,
          r: d.r,
          x: d.x,
          y: d.y,
          stroke: 'grey'
        }
      })
    },
    // eslint-disable-next-line
    visualise: function (id: string, depth: number) {
      const treeRoot = this.buildTree(id, depth)
      console.log(treeRoot)
      this.output = this.packCircles(treeRoot)
    }
  }
})
</script>
