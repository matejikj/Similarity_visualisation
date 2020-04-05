import store from '../store'
import { Arrow } from './Arrow'
import { Node } from './Node'
import { Circle } from './Circle'
import * as d3 from 'd3'
import { Position, MappingNode, ArrowData } from './types'
import { ROOT_ID, MAX_DEPTH, ROOT_LABEL } from '../static/constants'

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
    viewDepthLevel: Array<ArrowData> = []

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

    public createLayer (urls: Array<MappingNode>): Array<ArrowData> {
      const layerArray = Array<ArrowData>()
      for (let i = 0; i < urls.length; i++) {
        const n = store.state.nodes.filter(y => y.id === urls[i].nodeID)[0]
        if (n === undefined) {
          continue
        }
        const stack = Array<Node>()
        stack.push(n)
        const visitedArray = Array<string>()
        while (stack.length !== 0) {
          const parent = stack.pop()
          if (parent !== undefined) {
            if (parent.id === ROOT_ID) {
              continue
            }
            if (parent.parents === null) {
              continue
            }
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
              if (layerArray.filter(p => p.id === parent.id).length === 0) {
                const n: ArrowData = {
                  id: parent.id,
                  label: urls[i].name,
                  word: urls[i].mapBy
                }
                layerArray.push(n)
              }
            }
          }
        }
      }
      return layerArray
    }

    public repaintArrows (position: Position, ids: Array<MappingNode>): void {
      const queue = Array<Node>()
      const screenLevel = Array<Node>()
      queue.push(this.root)
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

      if (ids !== null && ids !== undefined) {
        this.viewDepthLevel = this.createLayer(ids)
        this.packArrows(position)
      }
    }

    public packArrows (position: Position): void {
      let counter = 0
      const array = new Array<Arrow>()
      for (let i = 0; i < this.viewDepthLevel.length; i++) {
        const targetNode = this.circles.filter(x => x.id === this.viewDepthLevel[i].id)[0]
        const arrow: Arrow = {
          id: counter,
          word: this.viewDepthLevel[i].word,
          mapTo: this.viewDepthLevel[i].label,
          lx: position === Position.Left ? 0 : this.width,
          ly: this.height / 2,
          rx: position === Position.Left ? targetNode.x - targetNode.r * 10 / 10 : targetNode.x + targetNode.r * 10 / 10,
          ry: targetNode.y,
          r: targetNode.r
        }
        counter++
        array.push(arrow)
      }

      switch (position) {
        case Position.Left:
          this.leftArrows = array
          break
        case Position.Right:
          this.rightArrows = array
          break
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
      const root = new Node(tmpRoot.label, tmpRoot.parents, Array<Node>(), tmpRoot.id, tmpRoot.depth, tmpRoot.color)
      let maxDepth = 0
      root.depth = 0
      tmpRoot.depth = 0
      const queue = Array<Node>()
      queue.push(root)
      while (queue.length !== 0) {
        const node = queue.shift()
        const children = nodes.filter(x => x.id === node?.id)[0].children
        if (node !== undefined && children !== undefined) {
          if (children.length !== 0) {
            for (let i = 0; i < children.length; i++) {
              const tmpChild = nodes.filter(x => x.id === children[i].id)[0]
              const child = new Node(tmpChild.label, tmpChild.parents, Array<Node>(), tmpChild.id, tmpChild.depth, tmpChild.color)
              node.children.push(child)
              if (node.depth !== null) {
                const newLevelDepth = node.depth + 1
                child.depth = newLevelDepth
                tmpChild.depth = newLevelDepth
                if (maxDepth < newLevelDepth) {
                  maxDepth = newLevelDepth
                }
                if (newLevelDepth < depth) {
                  queue.push(node.children[i])
                } else {
                  if (newLevelDepth === depth) {
                    child.children = []
                    child.value = 1
                    child.isLeaf = true
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
      const margin = 0
      const packChart = d3.pack()
      packChart.size([this.width - margin, this.height - margin])
      packChart.padding(10)
      const treeRoot = d3.hierarchy(root)
        .sum(d => Math.sqrt(d.value))

      const output = packChart(treeRoot).descendants()
      const interpolate = d3.scaleSequential([1, 0], d3.interpolateMagma)

      this.circles = new Array<Circle>()
      for (let i = 0; i < output.length; i++) {
        const color = interpolate(output[i].data.depth / this.maxDepth)
        const n: Circle = {
          fill: color,
          parent: output[i].parent !== null ? output[i].parent : null,
          id: output[i].data.id,
          label: output[i].data.label,
          isLeaf: output[i].data.isLeaf,
          x: output[i].x,
          y: output[i].y,
          r: output[i].r,
          depth: output[i].data.depth
        }
        this.circles.push(n)
      }
    }
}
