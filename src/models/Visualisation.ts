import store from '../store'
import { Arrow } from './Arrow'
import { Node } from './Node'
import { Circle } from './Circle'
import * as d3 from 'd3'
import { ROOT_ID, MAX_DEPTH, ROOT_LABEL } from './types'

export class Visualisation {
    leftArrows: Array<Arrow> = []
    rightArrows: Array<Arrow> = []
    // eslint-disable-next-line
    circles: Array<Circle> = []
    rootID: string = ROOT_ID
    root: Node = new Node(ROOT_LABEL, Array<Node>(), Array<Node>(), ROOT_ID, null, null)
    activeDepth = 1
    maxDepth = MAX_DEPTH

    width: number
    height: number

    constructor (height: number, width: number) {
      this.width = width
      this.height = height
    }

    public createVisualisation (nodes: Array<Node>): void {
      if (this.activeDepth === 0) {
        this.activeDepth = 1
      }
      this.root = this.buildTree(nodes, MAX_DEPTH)
      const maxDepth = this.maxDepth
      if (maxDepth < this.activeDepth) {
        this.root = this.buildTree(nodes, maxDepth)
      } else {
        this.root = this.buildTree(nodes, this.activeDepth)
      }
      this.maxDepth = maxDepth
      this.packCircles(this.root)
    }

    public createLayer (urls: Array<string>): Array<string> {
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
    }

    public repaintArrows (lefts: Array<string>, rights: Array<string>): void {
      const queue = Array<Node>()
      const screenLevel = Array<Node>()
      // queue.push(this.treeRoot)
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
          const targetNode = this.circles.filter(x => x.id === leftDepthLevel[i])[0]
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
          const targetNode = this.circles.filter(x => x.id === rightDepthLevel[i])[0]
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
    }

    /**
     * createMappingTree
     */
    public buildTree (nodes: Array<Node>, depth: number): Node {
      nodes.forEach(element => {
        element.depth = null
      })
      const tmpRoot = nodes.filter(x => x.id === this.rootID)[0]
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
              const tmpChildren = nodes.filter(x => x.id === node.children[i].id)[0]
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
    }

    // eslint-disable-next-line
    public packCircles (root: Node): void {
      const margin = 10
      const packChart = d3.pack()
      packChart.size([this.width - margin, this.height - margin])
      packChart.padding(10)
      const treeRoot = d3.hierarchy(root)
        .sum(d => Math.sqrt(d.value))

      const output = packChart(treeRoot).descendants()
      const interpolate = d3.interpolateRgb('steelblue', 'brown')

      this.circles = new Array<Circle>()
      for (let i = 0; i < output.length; i++) {
        const color = interpolate(output[i].data.depth / this.maxDepth)
        const n: Circle = {
          fill: color,
          id: output[i].data.id,
          label: output[i].data.label,
          isLeaf: output[i].data.isLeaf,
          x: output[i].x,
          y: output[i].y,
          r: output[i].r,
          depth: output[i].data.depth,
          stroke: 'black'
        }
        this.circles.push(n)
      }
    }
}
