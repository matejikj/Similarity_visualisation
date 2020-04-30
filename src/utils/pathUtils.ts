import * as d3 from 'd3'
import { Node, Circle, Path } from '@/models'
import { getNodeById } from '@/utils/nodesUtils'

export function createPathNodes (nodes: Array<Node>, activePath: Path) {
  const pathNodes = Array<Node>()
  let tmpUp = activePath.up
  let indexLeft = 0
  let indexRight = 0
  const pathColor = d3.scaleLinear()
    .domain([0, activePath.height])
    .range(['#ff8d92', '#ff0000'])
    .interpolate(d3.interpolateCubehelix)

  activePath.vertices.forEach(x => {
    const node: Node = getNodeById(nodes, x)
    let j = 0
    if (tmpUp > 0) {
      j = indexLeft * activePath.height / activePath.up
      indexLeft++
      tmpUp--
    } else {
      j = (activePath.height - indexRight) * activePath.height / activePath.down
      indexRight++
    }
    if (node !== undefined) {
      node.color = pathColor(j)
    }
    pathNodes.push(node)
  })
  return pathNodes
}

// eslint-disable-next-line
export function createPaths (nodes: Array<Node>, paths: any): Array<Path> {
  const array = new Array<Path>()
  for (let i = 0; i < paths.length; i++) {
    const from = paths[i].from[0]
    const to = paths[i].to[0]
    const vertices = Array<string>()
    for (let j = 0; j < paths[i].path.length; j++) {
      vertices.push(paths[i].path[j])
    }
    const directions = Array<boolean>()
    for (let j = 0; j < (vertices.length - 1); j++) {
      const node = getNodeById(nodes, vertices[j])
      const parent = node.parents.filter(x => x.id === vertices[j + 1])[0]
      if (parent === undefined) {
        directions.push(false)
      } else {
        directions.push(true)
      }
    }
    let up = 0
    let down = 0
    for (let j = 0; j < directions.length; j++) {
      if (directions[j]) {
        up++
      } else {
        down++
      }
    }
    let height = 0
    if (up > down) {
      height = up
    } else {
      height = down
    }
    array.push(new Path(from, to, vertices, directions, up, down, height))
  }
  return array
}

export function highlightPaths (circles: Array<Circle>, activePath: Path) {
  if (activePath !== undefined) {
    let tmpUp = activePath.up
    let indexLeft = 0
    let indexRight = 0
    const pathColor = d3.scaleLinear()
      .domain([0, activePath.height])
      .range(['#ff8d92', '#ff0000'])
      .interpolate(d3.interpolateCubehelix)
    activePath.vertices.forEach(x => {
      const circle: Circle = circles.filter(y => y.id === x)[0]
      let j = 0
      if (tmpUp > 0) {
        j = indexLeft * activePath.height / activePath.up
        indexLeft++
        tmpUp--
      } else {
        j = (activePath.height - indexRight) * activePath.height / activePath.down
        indexRight++
      }
      if (circle !== undefined) {
        circle.fill = pathColor(j)
      }
    })
  }
  return circles
}
