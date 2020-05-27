import * as d3 from 'd3'
import { Node, Circle, Path, Label } from '../models'
import { getNodeById } from './nodesUtils'

export function createPathNodes (nodes: Array<Node>, activePath: Path) {
  const pathNodes = Array<Node>()
  const pathColor = d3.scaleLinear()
    .domain([0, activePath.height])
    .range(['#ff8d92', '#ff0000'])
    .interpolate(d3.interpolateCubehelix)

  for (let i = 0; i < activePath.vertices.length; i++) {
    const node: Node = getNodeById(nodes, activePath.vertices[i])
    const number = Math.abs(i - activePath.up)
    if (node !== undefined) {
      node.color = pathColor(number)
    }
    pathNodes.push(node)
  }
  return pathNodes
}

// eslint-disable-next-line
export function createPaths (nodes: Array<Node>, paths: any, labels: Set<Label>): Array<Path> {
  const array = new Array<Path>()
  for (let i = 0; i < paths.length; i++) {
    const from = labels[paths[i].nodes[0]]
    const to = labels[paths[i].nodes[paths[i].nodes.length - 1]]
    const vertices = Array<string>()
    for (let j = 0; j < paths[i].nodes.length; j++) {
      vertices.push(paths[i].nodes[j])
    }
    let up = 0
    let down = 0
    const root = paths[i].shared
    let rootVisited = true
    for (let j = 0; j < paths[i].nodes.length; j++) {
      if (paths[i].nodes[j] !== root && rootVisited) {
        up++
      } else {
        if (paths[i].nodes[j] === root) {
          rootVisited = false
        } else {
          down++
        }
      }
    }
    let height = 0
    if (up > down) {
      height = up
    } else {
      height = down
    }
    array.push(new Path(from, to, vertices, up, down, height))
  }
  return array
}

export function highlightPaths (circles: Array<Circle>, activePath: Path) {
  if (activePath !== undefined) {
    const pathColor = d3.scaleLinear()
      .domain([0, activePath.height])
      .range(['#ff8d92', '#ff0000'])
      .interpolate(d3.interpolateCubehelix)
    for (let i = 0; i < activePath.vertices.length; i++) {
      const circle: Circle = circles.filter(y => y.id === activePath.vertices[i])[0]
      const number = Math.abs(i - activePath.up)
      if (circle !== undefined) {
        circle.fill = pathColor(number)
      }
    }
  }
  return circles
}
