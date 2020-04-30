import { MappingNode, Node, ArrowData, ROOT_ID, Circle, Arrow, Position, Label, MappingData } from '@/models'

export function createLayer (urls: Array<MappingNode>, nodes: Array<Node>): Array<ArrowData> {
  const layerArray = Array<ArrowData>()
  for (let i = 0; i < urls.length; i++) {
    const n = nodes.filter(y => y.id === urls[i].nodeID)[0]
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

export function createArrows (root: Node, position: Position, ids: Array<MappingNode>, nodes: Array<Node>): void {
  const queue = Array<Node>()
  let viewDepthLevel = Array<ArrowData>()
  const screenLevel = Array<Node>()
  queue.push(root)
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
    viewDepthLevel = createLayer(ids, nodes)
    packMappingArrows(1000, 1000, Array<Circle>(), viewDepthLevel, position)
  }
}

export function createTree (rootId: string, nodes: Array<Node>, depth: number): Node {
  nodes.forEach(element => {
    element.depth = undefined
  })
  const tmpRoot = nodes.filter(x => x.id === rootId)[0]
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
  return root
}

export function getMaxTreeDepth (rootId: string, nodes: Array<Node>, depth: number): number {
  nodes.forEach(element => {
    element.depth = undefined
  })
  const tmpRoot = nodes.filter(x => x.id === rootId)[0]
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
  return maxDepth
}

export function packMappingArrows (height: number, width: number, circles: Array<Circle>, viewDepthLevel: Array<ArrowData>, position: Position): Array<Arrow> {
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

function createMappingData (id: string, group: string, size: number, shared: number) {
  return new MappingData(
    id,
    group,
    shared,
    size
  )
}

function createMappingNodeWithChildren (id: number, name: string, children: MappingNode[]) {
  const newNode: MappingNode = {
    id: id,
    name: name,
    children: children
  }
  return newNode
}

function createMappingNodeWithMap (id: number, name: string, mapBy: string, nodeID: string) {
  const newNode: MappingNode = {
    id: id,
    name: name,
    mapBy: mapBy,
    nodeID: nodeID
  }
  return newNode
}

function existLabel (labels: Array<Label>, id: string) {
  if (labels[id] !== undefined) {
    return true
  } else {
    return false
  }
}
// eslint-disable-next-line
export function createMapping (labels: Array<Label>, mapping: any, mappingID: number): Array<MappingNode> {
  const result = Array<MappingNode>()
  const mappingDataArray = Array<MappingData>()
  mapping.mappings[mappingID].data.forEach(item => {
    mappingDataArray.push(createMappingData(item.id, item.metadata.group, item.metadata.size, item.metadata.shared))
  })
  let counter = 1
  mappingDataArray.forEach(element => {
    let name
    if (existLabel(labels, element.id)) {
      name = labels[element.id].label
    } else {
      name = element.id
    }
    if (result.filter(x => x.name === element.group[0]).length === 0) {
      const newChildren = createMappingNodeWithMap(counter, name, element.group[0], element.id)
      counter++
      const newNode = createMappingNodeWithChildren(counter, element.group[0], [newChildren])
      counter++
      result.push(newNode)
    } else {
      const node = result.filter(x => x.name === element.group[0])[0]
      const newChildren = createMappingNodeWithMap(counter, name, element.group[0], element.id)
      counter++
      if (node.children !== undefined) {
        node.children.push(newChildren)
      }
    }
  })
  return result
}
