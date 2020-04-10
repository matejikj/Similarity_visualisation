import store from '../store'
import { ROOT_ID, ROOT_LABEL } from '@/static/constants'
import { MappingNode, Node, ArrowData, Label, Link, Circle, Position, MappingData } from '@/models'
import { packArrows } from './pack'

export function createNodes (links: Array<Link>, labels: Array<Label>): Array<Node> {
  const array = new Array<Node>()
  const visitedNodesArray = new Array<string>()
  if (links !== undefined) {
    for (let i = 0; i < links.length; i++) {
      if (!visitedNodesArray.includes(links[i].child)) {
        visitedNodesArray.push(links[i].child)
        const node = new Node(labels.filter(x => x.id === links[i].child)[0].label, new Array<Node>(), new Array<Node>(), links[i].child, undefined, undefined)
        array.push(node)
      }
      if (!visitedNodesArray.includes(links[i].parent)) {
        visitedNodesArray.push(links[i].parent)
        const node = new Node(labels.filter(x => x.id === links[i].parent)[0].label, new Array<Node>(), new Array<Node>(), links[i].parent, undefined, undefined)
        array.push(node)
      }
    }
  }

  for (let i = 0; i < array.length; i++) {
    const id = array[i].id

    for (let j = 0; j < links.length; j++) {
      if (links[j].child === id) {
        array[i].parents.push(array.filter(x => x.id === links[j].parent)[0])
      }
      if (links[j].parent === id) {
        array[i].children.push(array.filter(x => x.id === links[j].child)[0])
      }
    }
  }

  const noParentsNodes = array.filter(x => x.parents.length === 0)

  let root = array.filter(x => x.id === ROOT_ID)[0]

  if (root === undefined) {
    root = new Node(ROOT_LABEL, new Array<Node>(), new Array<Node>(), ROOT_ID, undefined, undefined)
    noParentsNodes.forEach(element => {
      element.parents.push(root)
      root.children.push(element)
    })
    array.splice(0, 0, root)
    const rootsArray = array.filter(x => x.parents.length === 0)
    for (let i = 0; i < rootsArray.length; i++) {
      if (rootsArray[i].id !== ROOT_ID) {
        rootsArray[i].parents.push(root)
        root.children.push(rootsArray[i])
      }
    }
  } else {
    noParentsNodes.forEach(element => {
      element.parents.push(root)
      root.children.push(element)
    })
  }
  return array
}

// eslint-disable-next-line
export function createLinks (leftDataset: any, rightDataset: any): Array<Link> {
  const array = Array<Link>()
  if (leftDataset.hierarchy !== undefined) {
    for (let i = 0; i < leftDataset.hierarchy.length; i++) {
      const newLink = new Link(leftDataset.hierarchy[i][2], leftDataset.hierarchy[i][0])
      array.push(newLink)
    }
  }
  if (rightDataset.hierarchy !== undefined) {
    for (let i = 0; i < rightDataset.hierarchy.length; i++) {
      const newLink = new Link(rightDataset.hierarchy[i][2], rightDataset.hierarchy[i][0])
      if (array.filter(x => x.parent === newLink.parent && x.child === newLink.child).length === 0) {
        array.push(newLink)
      }
    }
  }
  return array
}

// eslint-disable-next-line
export function createLabels (leftDataset: any, rightDataset: any): Array<Label> {
  const array = Array<Label>()
  if (leftDataset.labels !== undefined) {
    for (const key in leftDataset.labels) {
      const value = leftDataset.labels[key]
      const newLabel = new Label(key, value)
      array.push(newLabel)
    }
  }
  if (rightDataset.labels !== undefined) {
    for (const key in rightDataset.labels) {
      const newLabel = new Label(key, rightDataset.labels[key])
      if (array.filter(x => x.id === newLabel.id && x.label === newLabel.label).length === 0) {
        array.push(newLabel)
      }
    }
  }
  return array
}

export function createLayer (urls: Array<MappingNode>): Array<ArrowData> {
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

export function createArrows (position: Position, ids: Array<MappingNode>): void {
  const queue = Array<Node>()
  let viewDepthLevel = Array<ArrowData>()
  const screenLevel = Array<Node>()
  queue.push(store.state.hierarchy)
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
    viewDepthLevel = createLayer(ids)
    packArrows(1000, 1000, Array<Circle>(), viewDepthLevel, position)
  }
}

export function createTree (nodes: Array<Node>, depth: number): Node {
  nodes.forEach(element => {
    element.depth = undefined
  })
  const tmpRoot = nodes.filter(x => x.id === store.getters.getRootId)[0]
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
          if (node.depth !== undefined) {
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
  store.commit('changeMaxDepth', maxDepth)
  return root
}

// eslint-disable-next-line
export function createMapping (labels: Array<Label>, mapping: any, mappingID: number): Array<MappingNode> {
  const array = Array<MappingNode>()
  const mappingDataArray = Array<MappingData>()
  for (let i = 0; i < mapping.mappings[mappingID].data.length; i++) {
    const newNode: MappingData = {
      id: mapping.mappings[mappingID].data[i].id,
      group: mapping.mappings[mappingID].data[i].metadata.group,
      size: mapping.mappings[mappingID].data[i].metadata.target_size,
      shared: mapping.mappings[mappingID].data[i].metadata.shared_size
    }
    mappingDataArray.push(newNode)
  }
  let counter = 1
  mappingDataArray.forEach(element => {
    if (array.filter(x => x.name === element.group[0]).length === 0) {
      const label = labels.filter(x => x.id === element.id)[0]
      const name = label === undefined ? element.id : label.label
      const newChildren: MappingNode = {
        id: counter,
        nodeID: element.id,
        name: name,
        mapBy: element.group[0]
      }
      counter++
      const newNode: MappingNode = {
        id: counter,
        name: element.group[0],
        children: [newChildren]
      }
      counter++
      array.push(newNode)
    } else {
      const node = array.filter(x => x.name === element.group[0])[0]
      const label = labels.filter(x => x.id === element.id)[0]
      const name = label === undefined ? element.id : label.label
      const newChildren: MappingNode = {
        id: counter,
        nodeID: element.id,
        name: name,
        mapBy: element.group[0]
      }
      counter++
      if (node.children !== undefined) {
        node.children.push(newChildren)
      }
    }
  })
  return array
}

export function refreshPath (leaf: Circle): void {
  const array = Array<string>()
  array.push(leaf.id)
  let parent = leaf.parent
  while (parent !== null) {
    if (parent.data.id !== ROOT_ID && parent.parent != null) {
      array.push(parent.data.id)
    }
    parent = parent.parent
  }
  while (array.length !== 0) {
    const element = array.pop()
    if (element !== undefined) {
      store.state.circlesPath.push(element)
    }
  }
}
