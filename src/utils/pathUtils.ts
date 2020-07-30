import * as d3 from 'd3'
import { Node, Circle, Path, Labels } from '../models'
import { getNodeById, getNodeLabel } from './nodesUtils'

/**
 * Create nodes of paths
 * @param nodes nodes
 * @param activePath active path
 */
export function createPathNodes (nodes: Array<Node>, activePath: Path) {
  const pathNodes = Array<Node>()
  const pathColor = function (i: number) { return d3.interpolateOrRd((i + 1) / (activePath.height + 1)) }

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

/**
 * Create array of pahts with all information about paths from path dataset
 * @param nodes nodes
 * @param paths paths
 * @param labels labels
 * @param leftLabels left labels
 * @param rightLabels right labels
 */
// eslint-disable-next-line
export function createPaths (nodes: Array<Node>, paths: any, labels: Labels,
  leftLabels: {[key: string]: string[]}, rightLabels: {[key: string]: string[]}): Array<Path> {
  const array = new Array<Path>()
  for (let i = 0; i < paths.length; i++) {
    const from = getNodeLabel(labels, paths[i].nodes[0])
    const to = getNodeLabel(labels, paths[i].nodes[paths[i].nodes.length - 1])
    const vertices = Array<string>()
    for (let j = 0; j < paths[i].nodes.length; j++) {
      vertices.push(paths[i].nodes[j])
    }
    const arrows: Array<string> = []
    let up = 0
    let down = 0
    const root = paths[i].shared
    let rootVisited = true
    for (let j = 0; j < paths[i].nodes.length; j++) {
      if (paths[i].nodes[j] !== root && rootVisited) {
        arrows.push('▲')
        up++
      } else {
        if (paths[i].nodes[j] === root) {
          rootVisited = false
        } else {
          arrows.push('▼')
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
    let leftKeywords = ''
    let rightKeywords = ''
    if (leftLabels[paths[i].nodes[0]] !== undefined) {
      leftLabels[paths[i].nodes[0]].forEach((item: string) => {
        leftKeywords += (item + ' ')
      })
    }
    if (rightLabels[paths[i].nodes[paths[i].nodes.length - 1]] !== undefined) {
      rightLabels[paths[i].nodes[paths[i].nodes.length - 1]].forEach((item: string) => {
        rightKeywords += (item + ', ')
      })
    }
    array.push(new Path(from, to, vertices, up,
      down, height, arrows, leftKeywords, rightKeywords))
  }
  return array
}

/**
 * Highlight path
 * @param circles circles
 * @param activePath active path
 */
export function highlightPaths (circles: Array<Circle>, activePath: Path) {
  if (activePath !== undefined) {
    const pathColor = function (i: number) { return d3.interpolateOrRd((i + 1) / (activePath.height + 1)) }
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
