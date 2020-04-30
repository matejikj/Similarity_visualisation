import { ROOT_ID, Node, Label, Link, Circle } from '@/models'
import * as d3 from 'd3'

function stringArrayContainsNodeById (array: Array<string>, id: string) {
  if (array.includes(id)) {
    return true
  } else {
    return false
  }
}

function getNodeLabel (labels: Array<Label>, nodeId: string) {
  return labels[nodeId].label
}

function createNode (labels: Array<Label>, nodeId: string): Node {
  return new Node(
    getNodeLabel(labels, nodeId),
    new Array<Node>(),
    new Array<Node>(),
    nodeId,
    undefined,
    undefined
  )
}

function containsNode (nodes: Array<Node>, nodeId: string) {
  let value = false
  nodes.forEach(node => {
    if (node.id === nodeId) {
      value = true
    }
  })
  return value
}

export function getNodeById (nodes: Array<Node>, id: string) {
  return nodes.filter(x => x.id === id)[0]
}

export function createNodes (links: Array<Link>, labels: Array<Label>) {
  const result = new Array<Node>()
  const visitedNodes = new Array<string>()
  links.forEach(link => {
    if (!stringArrayContainsNodeById(visitedNodes, link.child)) {
      visitedNodes.push(link.child)
      result.push(createNode(labels, link.child))
    }
    if (!stringArrayContainsNodeById(visitedNodes, link.parent)) {
      visitedNodes.push(link.parent)
      result.push(createNode(labels, link.parent))
    }
  })
  links.forEach(link => {
    const child = getNodeById(result, link.child)
    if (!containsNode(child.parents, link.parent)) {
      child.parents.push(getNodeById(result, link.parent))
    }
    const parent = getNodeById(result, link.parent)
    if (!containsNode(parent.children, link.child)) {
      parent.children.push(getNodeById(result, link.child))
    }
  })

  const NodesWithNoParent = result.filter(x => x.parents.length === 0)
  let root
  if (!containsNode(result, ROOT_ID)) {
    root = createNode(labels, ROOT_ID)
  } else {
    root = getNodeById(result, ROOT_ID)
  }
  result.splice(0, 0, root)

  NodesWithNoParent.forEach(node => {
    node.parents.push(root)
    root.children.push(node)
  })
  return result
}

export function packNodes (height: number, width: number, root: Node, maxDepth: number): Array<Circle> {
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
