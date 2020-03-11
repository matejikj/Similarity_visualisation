<template>
    <svg id="svg" ref="svg" width="100%" height="80vh">
      <g>
        <template v-for="c in output">
          <circle class="circle"
            :key="c.key1"
            :id="c.id"
            :r="c.r"
            :cx="c.x"
            :cy="c.y"
            :fill="c.fill"
            :stroke="c.stroke"
            @click.exact="clickCircle(c)"
            @click.ctrl="openWiki(c)"
          >
          </circle>
        </template>
        <template v-for="c in output">
          <text class="text"
            :key="c.key2"
            :x="c.x-12*(c.id.length)/3"
            v-if="c.isLeaf"
            :font-size="12"
            :y="c.y+6"
          >{{c.id}}
          </text>
        </template>
        <template v-for="c in leftArrows">
          <line class="link"
            :key="c.id"
            :id="c.id"
            :x1="c.lx"
            :y1="c.ly"
            :x2="c.rx"
            :y2="c.ry"
            :stroke="c.color"
          >
          </line>
        </template>
        <template v-for="c in rightArrows">
          <line class="link"
            :key="c.id"
            :id="c.id"
            :x1="c.lx"
            :y1="c.ly"
            :x2="c.rx"
            :y2="c.ry"
            :stroke="c.color"
          >
          </line>
        </template>
      </g>
    </svg>
</template>

<style>
.circle { text-decoration: underline; }
</style>

<script lang="ts">
import Vue from 'vue'
import { Node, Label, Link, Arrow } from '../models/types'
import store from '../store'
import * as d3 from 'd3'

export default Vue.extend({
  name: 'Visualisation',
  data: () => ({
    height: 0,
    width: 0,
    output: Object(),
    maxDepth: Number(),
    treeRoot: new Node('', Array<Node>(), Array<Node>(), '', 0, ''),
    leftArrows: Array<Arrow>(),
    rightArrows: Array<Arrow>()
  }),
  mounted () {
    this.$store.subscribe((mutation) => {
      switch (mutation.type) {
        case 'changeLabels':
          this.initializeNodes(store.state.hierarchy, store.state.labels)
          this.$store.commit('changeActiveViewDepth', 0)
          this.$store.commit('changeActiveId', 'root')
          this.visualise(store.state.activeId, store.state.activeViewDepth)
          this.repaintArrows(store.state.leftArrowsId, store.state.rightArrowsId)
          break
        case 'changeActiveViewDepth':
          this.visualise(store.state.activeId, store.state.activeViewDepth)
          this.repaintArrows(store.state.leftArrowsId, store.state.rightArrowsId)
          break
        case 'changeLeftArrowsId':
          this.repaintArrows(store.state.leftArrowsId, store.state.rightArrowsId)
          break
        case 'changeRightArrowsId':
          this.repaintArrows(store.state.leftArrowsId, store.state.rightArrowsId)
          break
      }
    })
  },
  methods: {
    createLayer: function (urls: Array<string>): Array<string> {
      const layerArray = Array<string>()
      let j = 0
      for (let i = 0; i < urls.length; i++) {
        const n = store.state.nodes.filter(y => y.id === urls[i])[0]
        if (n === undefined) {
          continue
        }
        const stack = Array<Node>()
        stack.push(n)
        let cycleArray = Array<string>()
        const visitedArray = Array<string>()
        while (stack.length !== 0) {
          const parent = stack.pop()
          j++
          console.log(j)
          if (parent !== undefined) {
            if (cycleArray.includes(parent.id)) {
              cycleArray = new Array<string>()
              continue
            }
            if (parent.parents === null) {
              cycleArray = new Array<string>()
              continue
            }
            cycleArray.push(parent.id)
            if (parent.depth == null) {
              if (parent.parents != null) {
                for (let i = 0; i < parent.parents.length; i++) {
                  if (!visitedArray.includes(parent.parents[i].id)) {
                    visitedArray.push(parent.parents[i].id)
                    stack.push(parent.parents[i])
                  }
                }
              }
            } else {
              if (!layerArray.includes(parent.id)) {
                layerArray.push(parent.id)
              }
            }
          }
        }
      }
      console.log('STOP')
      return layerArray
    },
    repaintArrows: function (lefts: Array<string>, rights: Array<string>) {
      this.leftArrows = Array<Arrow>()
      this.rightArrows = Array<Arrow>()
      const queue = Array<Node>()
      const screenLevel = Array<Node>()
      queue.push(this.treeRoot)

      while (queue.length !== 0) {
        const vertex = queue.shift()
        if (vertex !== undefined) {
          screenLevel.push(vertex)
          if (vertex.children !== undefined && vertex.children !== null) {
            for (let i = 0; i < vertex.children.length; i++) {
              queue.push(vertex.children[i])
            }
          }
        }
      }

      let counter = 0
      if (lefts !== null && lefts !== undefined) {
        const leftDepthLevel = this.createLayer(lefts)
        for (let i = 0; i < leftDepthLevel.length; i++) {
          const targetNode = this.output.filter(x => x.id === leftDepthLevel[i])[0]
          const n: Arrow = {
            color: 'red',
            strokeWidth: 2,
            id: counter,
            lx: 0,
            ly: this.height / 2,
            rx: targetNode.x,
            ry: targetNode.y,
            r: targetNode.r
          }
          counter++
          this.leftArrows.push(n)
        }
      }

      if (rights !== null && rights !== undefined) {
        const rightDepthLevel = this.createLayer(rights)
        for (let i = 0; i < rightDepthLevel.length; i++) {
          const targetNode = this.output.filter(x => x.id === rightDepthLevel[i])[0]
          const n: Arrow = {
            color: 'red',
            strokeWidth: 2,
            id: counter,
            lx: this.width,
            ly: this.height / 2,
            rx: targetNode.x,
            ry: targetNode.y,
            r: targetNode.r
          }
          counter++
          this.rightArrows.push(n)
        }
      }
    },
    openWiki: function (data: any) {
      const win = window.open('https://www.wikidata.org/wiki/' + data.id, '_blank')
      if (win !== null) {
        win.focus()
      }
    },
    clickCircle: function (data: any) {
      this.$store.commit('changeActiveViewDepth', 0)
      this.$store.commit('changeActiveId', data.id)
      this.visualise(store.state.activeId, store.state.activeViewDepth)
    },
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
      tmpRoot.depth = 0
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
                tmpChildren.depth = newLevelDepth
                if (maxDepth < newLevelDepth) {
                  maxDepth = newLevelDepth
                }
                if (newLevelDepth < depth) {
                  queue.push(node.children[i])
                } else {
                  if (newLevelDepth === depth) {
                    children.children = []
                    children.value = 1
                    children.isLeaf = true
                  }
                }
              }
            }
          } else {
            node.children = []
            node.value = 1
            node.isLeaf = true
          }
        }
      }
      this.maxDepth = maxDepth
      return root
    },
    packCircles: function (root: Node) {
      const margin = 10
      const packChart = d3.pack()
      // @ts-ignore
      this.width = this.$refs.svg.clientWidth
      // @ts-ignore
      this.height = this.$refs.svg.clientHeight
      packChart.size([this.width - margin, this.height - margin])
      packChart.padding(10)
      const treeRoot = d3.hierarchy(root)
        .sum(d => Math.sqrt(d.value))

      const output = packChart(treeRoot).descendants()
      const length = output.length

      const interpolate = d3.interpolateRgb('steelblue', 'brown')

      return output.map((d, i) => {
        const color = interpolate(d.data.depth / store.state.maximalViewDepth)
        return {
          fill: color,
          id: d.data.id,
          label: d.data.label,
          key1: (i + 1),
          key2: length + (i + 1),
          isLeaf: d.data.isLeaf,
          depth: d.data.depth,
          r: d.r,
          x: d.x,
          y: d.y,
          stroke: 'black'
        }
      })
    },
    // eslint-disable-next-line
    visualise: function (id: string, depth: number) {
      if (depth === 0) {
        depth = 1
      }
      this.treeRoot = this.buildTree(id, 8)
      const maxDepth = this.maxDepth
      this.$store.commit('changeMaximalViewDepth', maxDepth - 1)
      if (maxDepth < depth) {
        this.treeRoot = this.buildTree(id, maxDepth)
      } else {
        this.treeRoot = this.buildTree(id, depth)
      }
      this.output = this.packCircles(this.treeRoot)
    }
  }
})
</script>
