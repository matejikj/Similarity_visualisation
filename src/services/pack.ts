import { Circle, Position, Arrow, ArrowData } from '@/models'
import * as d3 from 'd3'

export function packArrows (height: number, width: number, circles: Array<Circle>, viewDepthLevel: Array<ArrowData>, position: Position): Array<Arrow> {
  let counter = 0
  const array = new Array<Arrow>()
  for (let i = 0; i < viewDepthLevel.length; i++) {
    const targetNode = circles.filter(x => x.id === viewDepthLevel[i].id)[0]
    const arrow: Arrow = {
      id: counter,
      word: viewDepthLevel[i].word,
      mapTo: viewDepthLevel[i].label,
      lx: position === Position.Left ? 0 : width,
      ly: height / 2,
      rx: position === Position.Left ? targetNode.x - targetNode.r * 10 / 10 : targetNode.x + targetNode.r * 10 / 10,
      ry: targetNode.y,
      r: targetNode.r
    }
    counter++
    array.push(arrow)
  }
  return array
}

export function packCircles (height: number, width: number, root: Node, maxDepth: number): Array<Circle> {
  const circles = new Array<Circle>()
  const margin = 0
  const packChart = d3.pack()
  packChart.size([width - margin, height - margin])
  packChart.padding(2)
  const treeRoot = d3.hierarchy(root)
    .sum(d => Math.sqrt(d.value))

  const output = packChart(treeRoot).descendants()
  const interpolate = d3.scaleSequential([1, 0], d3.interpolateCool)

  for (let i = 0; i < output.length; i++) {
    const color = interpolate(output[i].data.depth / maxDepth)
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
    circles.push(n)
  }
  return circles
}
