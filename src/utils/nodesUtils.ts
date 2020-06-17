import { ROOT_ID, Node, Link, Circle, Arrow, TREE_CIRCLE_RADIUS, Labels } from '../models'
import * as d3 from 'd3'

export function prepareLabels (labels: {id: string; label: string}[]) {
  const result: Labels = {}
  labels.forEach((item) => {
    result[item.id] = item.label
  })
  return result
}

export function createVisitedNode (id: string, label: string) {
  return {
    id: id !== undefined ? id : 'Q0',
    label: label !== undefined ? label : 'undefined'
  }
}

export function mapLinks (hierarchy: Array<[string, string, string]>) {
  let result = Array<Link>()
  if (hierarchy !== undefined) {
    result = hierarchy.map((item: [string, string, string]) => ({
      parent: item[2],
      child: item[0]
    }))
  }
  return result
}

export function getNodeLabel (labels: Labels, nodeId: string) {
  if (labels !== undefined) {
    if (labels[nodeId] !== undefined) {
      return labels[nodeId]
    }
  }
  return nodeId
}

export function createNode (labels: Labels, nodeId: string): Node {
  return new Node(
    getNodeLabel(labels, nodeId),
    new Array<Node>(),
    new Array<Node>(),
    nodeId,
    0,
    undefined,
    undefined
  )
}

export function containsNode (nodes: Array<Node>, nodeId: string) {
  let value = false
  if (nodes !== undefined) {
    nodes.forEach(node => {
      if (node.id === nodeId) {
        value = true
      }
    })
  }
  return value
}

export function getNodeById (nodes: Array<Node>, id: string) {
  return nodes.filter(x => x.id === id)[0]
}

export function getNodeByKey (nodes: Array<Node>, key: number) {
  return nodes.filter(x => x.key === key)[0]
}

export function getUniqueNodes (links: Array<Link>, labels: Labels) {
  const visitedNodes = new Array<string>()
  const result = new Array<Node>()
  links.forEach(link => {
    if (!visitedNodes.includes(link.child)) {
      visitedNodes.push(link.child)
      result.push(createNode(labels, link.child))
    }
    if (!visitedNodes.includes(link.parent)) {
      visitedNodes.push(link.parent)
      result.push(createNode(labels, link.parent))
    }
  })
  return result
}

export function createNodesWithRelationships (links: Array<Link>, nodes: Array<Node>) {
  links.forEach(link => {
    const child = getNodeById(nodes, link.child)
    if (!containsNode(child.parents, link.parent)) {
      child.parents.push(getNodeById(nodes, link.parent))
    }
    const parent = getNodeById(nodes, link.parent)
    if (!containsNode(parent.children, link.child)) {
      parent.children.push(getNodeById(nodes, link.child))
    }
  })
  return nodes
}

export function initalizeNodes (hierarchy: any, labels: Labels) {
  const links: Array<Link> = mapLinks(hierarchy)
  const result = createNodesWithRelationships(links, getUniqueNodes(links, labels))

  const NodesWithNoParent = result.filter(x => x.parents.length === 0)
  let root: Node
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

export function treeDataToCircles (chartItems: any, maxDepth: number, constantRadius: boolean) {
  const circles = new Array<Circle>()
  const interpolate = function (i: number) { return d3.interpolateCool(i) }
  chartItems.forEach(element => {
    const color = interpolate(element.data.depth / maxDepth)
    const n: Circle = {
      key: element.data.key,
      fill: color,
      parent: element.parent !== null ? element.parent : null,
      id: element.data.id,
      label: element.data.label,
      isLeaf: element.data.isLeaf,
      x: element.x,
      y: element.y,
      r: constantRadius ? TREE_CIRCLE_RADIUS : element.r,
      depth: element.data.depth
    }
    circles.push(n)
  })
  return circles
}

export function treeDataToLinks (treeData: any) {
  const links = Array<Arrow>()
  treeData.forEach((element: d3.HierarchyPointLink<any>, index: number) => {
    const n: Arrow = {
      id: index,
      r: 10,
      lx: element.source.x,
      ly: element.source.y,
      rx: element.target.x,
      ry: element.target.y
    }
    links.push(n)
  })
  return links
}

export function packNodes (height: number, width: number, root: Node, maxDepth: number): Array<Circle> {
  const margin = 0
  const packChart = d3.pack()
  packChart.size([width - margin, height - margin])
  packChart.padding(7)
  const treeRoot = d3.hierarchy(root)
    .sum((d: any) => Math.sqrt(d.value))
  const chartItems: any = packChart(treeRoot).descendants()
  return treeDataToCircles(chartItems, maxDepth, false)
}

export function maxTreeWidth (root: Node) {
  const levelWidth = [1]
  const childCount = function (level: number, n: Node) {
    if (n.children && n.children.length > 0) {
      if (levelWidth.length <= level + 1) {
        levelWidth.push(0)
      }
      levelWidth[level + 1] += n.children.length
      n.children.forEach(function (d: Node) {
        childCount(level + 1, d)
      })
    }
  }
  childCount(0, root)
  return d3.max(levelWidth)
}

export function packTreeHierarchy (root: Node, width: number, height: number) {
  const maxWidth: number = maxTreeWidth(root)
  const treemap = d3.tree().size([maxWidth * 45, height * 200])
  const hierarchyRoot: any = d3.hierarchy(root, function (d: Node) {
    return d.children
  })
  hierarchyRoot.x0 = 0
  hierarchyRoot.y0 = width / 2
  const treeData = treemap(hierarchyRoot)
  const circles = treeDataToCircles(treeData.descendants(), height, true)
  const links = treeDataToLinks(treeData.links())
  return { circles, links }
}
