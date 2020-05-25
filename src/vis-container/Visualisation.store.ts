import axios from 'axios'
import { ROOT_LABEL, ROOT_ID, MAX_DEPTH, Link, MappingNode, Label, Node, Circle, Arrow, Position, Path, ComboboxItem, MAX_TREE_DEPTH } from '@/models'
import { createTree, createLayer, getMaxTreeDepth, packMappingArrows, appendNode, createArrayFromHierarchy, highlightTreeMapping } from '@/utils/hierarchyUtils'
import { packNodes, createNodes, packTreeHierarchy, getNodeByKey } from '@/utils/nodesUtils'
import { highlightPaths, createPathNodes, createPaths } from '@/utils/pathUtils'

export const STORE_NAME = 'Visualisation'

export const Actions = {
  UPDATE_DATASET: 'UPDATE_DATASET',
  UPDATE_PATHS_DATASET: 'UPDATE_PATHS_DATASET',
  INITIALIZE_NODES: 'INITIALIZE_NODES',
  RESIZE_CANVAS: 'RESIZE_CANVAS',
  CREATE_HIERARCHY_FOR_CIRCLES: 'CREATE_HIERARCHY_FOR_CIRCLES',
  CREATE_HIERARCHY_FOR_TREE: 'CREATE_HIERARCHY_FOR_TREE',
  UPDATE_CIRCLE_CANVAS: 'UPDATE_CIRCLE_CANVAS',
  UPDATE_TREE_CANVAS: 'UPDATE_TREE_CANVAS',
  ADD_NODE_TO_VISITED_NODES: 'ADD_NODE_TO_VISITED_NODES',
  UPDATE_PATH: 'UPDATE_PATH',
  SELECT_PATH: 'SELECT_PATH',
  APPEND_NODE_TREE: 'APPEND_NODE_TREE',
  CUT_NODE_TREE_CHILDREN: 'CUT_NODE_TREE_CHILDREN'
}

export const Mutations = {
  CHANGE_WINDOW: 'CHANGE_WINDOW',
  CHANGE_LEFT_DATASET: 'CHANGE_LEFT_DATASET',
  CHANGE_RIGHT_DATASET: 'CHANGE_RIGHT_DATASET',
  CHANGE_LEFT_MAPPING_LIST: 'CHANGE_LEFT_MAPPING_LIST',
  CHANGE_LEFT_MAPPING: 'CHANGE_LEFT_MAPPING',
  CHANGE_RIGHT_MAPPING_LIST: 'CHANGE_RIGHT_MAPPING_LIST',
  CHANGE_RIGHT_MAPPING: 'CHANGE_RIGHT_MAPPING',
  CHANGE_DEPTH: 'CHANGE_DEPTH',
  CHANGE_MAX_DEPTH: 'CHANGE_MAX_DEPTH',
  CHANGE_LABELS: 'CHANGE_LABELS',
  CHANGE_NODES: 'CHANGE_NODES',
  CHANGE_VISITED_NODES: 'CHANGE_VISITED_NODES',
  CHANGE_CIRCLES: 'CHANGE_CIRCLES',
  CHANGE_LINKS: 'CHANGE_LINKS',
  CHANGE_LEFT_ARROWS: 'CHANGE_LEFT_ARROWS',
  CHANGE_RIGHT_ARROWS: 'CHANGE_RIGHT_ARROWS',
  CHANGE_CIRCLE_HIERARCHY: 'CHANGE_CIRCLE_HIERARCHY',
  CHANGE_ROOT_ID: 'CHANGE_ROOT_ID',
  CHANGE_PATHS_DATASET: 'CHANGE_PATHS_DATASET',
  CHANGE_PATHS: 'CHANGE_PATHS',
  CHANGE_ACTIVE_PATH: 'CHANGE_ACTIVE_PATH',
  CHANGE_PATH_NODES: 'CHANGE_PATH_NODES',
  CHANGE_TREE_HIERARCHY: 'CHANGE_TREE_HIERARCHY',
  CHANGE_TREE_NODES: 'CHANGE_TREE_NODES',
  CHANGE_TREE_LINKS: 'CHANGE_TREE_LINKS',
  CHANGE_TREE_HEIGHT: 'CHANGE_TREE_HEIGHT'
}

export const Getters = {
  GET_TREE_HEIGHT: 'GET_TREE_HEIGHT',
  GET_LEFT_DATASET: 'GET_LEFT_DATASET',
  GET_RIGHT_DATASET: 'GET_RIGHT_DATASET',
  GET_LEFT_MAPPING_LIST: 'GET_LEFT_MAPPING_LIST',
  GET_LEFT_MAPPING: 'GET_LEFT_MAPPING',
  GET_RIGHT_MAPPING_LIST: 'GET_RIGHT_MAPPING_LIST',
  GET_RIGHT_MAPPING: 'GET_RIGHT_MAPPING',
  GET_DEPTH: 'GET_DEPTH',
  GET_ACTIVE_PATH: 'GET_ACTIVE_PATH',
  GET_MAX_DEPTH: 'GET_MAX_DEPTH',
  GET_LABELS: 'GET_LABELS',
  GET_NODES: 'GET_NODES',
  GET_PATHS: 'GET_PATHS',
  GET_VISITED_NODES: 'GET_VISITED_NODES',
  GET_CIRCLE_HIERARCHY: 'GET_HIERARCHY',
  GET_ROOT_ID: 'GET_ROOT_ID',
  GET_CIRCLES: 'GET_CIRCLES',
  GET_RIGHT_ARROWS: 'GET_RIGHT_ARROWS',
  GET_LEFT_ARROWS: 'GET_LEFT_ARROWS',
  GET_NODE_BY_ID: 'GET_NODE_BY_ID',
  GET_PATH_NODES: 'GET_PATH_NODES',
  GET_TREE_HIERARCHY: 'GET_TREE_HIERARCHY',
  GET_TREE_NODES: 'GET_TREE_NODES',
  GET_TREE_LINKS: 'GET_TREE_LINKS'
}

export default {
  namespaced: true,
  state: {
    leftDataset: Object(),
    rightDataset: Object(),
    pathsDataset: Object(),
    leftMappingList: Array<ComboboxItem>(),
    leftMapping: Array<MappingNode>(),
    rightMappingList: Array<ComboboxItem>(),
    rightMapping: Array<MappingNode>(),
    labels: Array<Label>(),
    links: Array<Link>(),
    nodes: Array<Node>(),
    paths: Array<Path>(),
    activePath: undefined,
    pathNodes: Array<Node>(),
    circles: Array<Circle>(),
    leftArrows: Array<Arrow>(),
    rightArrows: Array<Arrow>(),
    rootId: ROOT_ID,
    circleHierarchy: new Node(ROOT_LABEL, Array<Node>(), Array<Node>(), ROOT_ID, 0, undefined, undefined),
    treeHierarchy: new Node(ROOT_LABEL, Array<Node>(), Array<Node>(), ROOT_ID, 0, undefined, undefined),
    treeNodes: Array<Circle>(),
    treeLinks: Array<Arrow>(),
    treeHeight: 1,
    visitedNodes: Array<Label>(),
    depth: 1,
    maxDepth: MAX_DEPTH,
    window: {
      width: 0,
      height: 0
    },
    error: Error
  },
  getters: {
    [Getters.GET_MAX_DEPTH]: (state) => {
      return state.maxDepth
    },
    [Getters.GET_TREE_HEIGHT]: (state) => {
      return state.treeHeight
    },
    [Getters.GET_DEPTH]: (state) => {
      return state.depth
    },
    [Getters.GET_CIRCLE_HIERARCHY]: (state) => {
      return state.circleHierarchy
    },
    [Getters.GET_PATHS]: (state) => {
      return state.paths
    },
    [Getters.GET_LEFT_DATASET]: (state) => {
      return state.leftDataset
    },
    [Getters.GET_LEFT_MAPPING_LIST]: (state) => {
      return state.leftMappingList
    },
    [Getters.GET_RIGHT_MAPPING_LIST]: (state) => {
      return state.rightMappingList
    },
    [Getters.GET_ACTIVE_PATH]: (state) => {
      return state.activePath
    },
    [Getters.GET_RIGHT_DATASET]: (state) => {
      return state.rightDataset
    },
    [Getters.GET_LEFT_MAPPING]: (state) => {
      return state.leftMapping
    },
    [Getters.GET_RIGHT_MAPPING]: (state) => {
      return state.rightMapping
    },
    [Getters.GET_VISITED_NODES]: (state) => {
      return state.visitedNodes
    },
    [Getters.GET_NODES]: (state) => {
      return state.nodes
    },
    [Getters.GET_LABELS]: (state) => {
      return state.labels
    },
    [Getters.GET_ROOT_ID]: (state) => {
      return state.rootId
    },
    [Getters.GET_CIRCLES]: (state) => {
      return state.circles
    },
    [Getters.GET_RIGHT_ARROWS]: (state) => {
      return state.rightArrows
    },
    [Getters.GET_LEFT_ARROWS]: (state) => {
      return state.leftArrows
    },
    [Getters.GET_PATH_NODES]: (state) => {
      return state.pathNodes
    },
    [Getters.GET_TREE_HIERARCHY]: (state) => {
      return state.treeHierarchy
    },
    [Getters.GET_TREE_NODES]: (state) => {
      return state.treeNodes
    },
    [Getters.GET_TREE_LINKS]: (state) => {
      return state.treeLinks
    }
  },
  mutations: {
    // eslint-disable-next-line
    [Mutations.CHANGE_LEFT_DATASET] (state, value: any) {
      state.leftDataset = value
    },
    // eslint-disable-next-line
    [Mutations.CHANGE_RIGHT_DATASET] (state, value: any) {
      state.rightDataset = value
    },
    // eslint-disable-next-line
    [Mutations.CHANGE_PATHS_DATASET] (state, value: any) {
      state.pathsDataset = value
    },
    [Mutations.CHANGE_PATHS] (state, value: Array<Path>) {
      state.paths = value
    },
    [Mutations.CHANGE_ACTIVE_PATH] (state, value: Path) {
      state.activePath = value
    },
    [Mutations.CHANGE_LEFT_MAPPING] (state, value: Array<MappingNode>) {
      state.leftMapping = value
    },
    [Mutations.CHANGE_RIGHT_MAPPING] (state, value: Array<MappingNode>) {
      state.rightMapping = value
    },
    [Mutations.CHANGE_LEFT_MAPPING_LIST] (state, value: Array<ComboboxItem>) {
      state.leftMappingList = value
    },
    [Mutations.CHANGE_RIGHT_MAPPING_LIST] (state, value: Array<ComboboxItem>) {
      state.rightMappingList = value
    },
    [Mutations.CHANGE_DEPTH] (state, value: number) {
      state.depth = value
    },
    [Mutations.CHANGE_MAX_DEPTH] (state, value: number) {
      state.maxDepth = value
    },
    [Mutations.CHANGE_LABELS] (state, value: Array<Label>) {
      state.labels = value
    },
    [Mutations.CHANGE_NODES] (state, value: Array<Node>) {
      state.nodes = value
    },
    [Mutations.CHANGE_VISITED_NODES] (state, value: Array<Label>) {
      state.visitedNodes = value
    },
    [Mutations.CHANGE_WINDOW] (state, value: {width: number; height: number}) {
      state.window.height = value.height
      state.window.width = value.width
    },
    [Mutations.CHANGE_CIRCLES] (state, value: Array<Circle>) {
      state.circles = value
    },
    [Mutations.CHANGE_LINKS] (state, value: Array<Link>) {
      state.links = value
    },
    [Mutations.CHANGE_LABELS] (state, value: Array<Label>) {
      state.labels = value
    },
    [Mutations.CHANGE_LEFT_ARROWS] (state, value: Array<Arrow>) {
      state.leftArrows = value
    },
    [Mutations.CHANGE_RIGHT_ARROWS] (state, value: Array<Arrow>) {
      state.rightArrows = value
    },
    [Mutations.CHANGE_CIRCLE_HIERARCHY] (state, value: Node) {
      state.circleHierarchy = value
    },
    [Mutations.CHANGE_ROOT_ID] (state, value: string) {
      state.rootId = value
    },
    [Mutations.CHANGE_PATH_NODES] (state, value: Array<Node>) {
      state.pathNodes = value
    },
    [Mutations.CHANGE_TREE_HIERARCHY] (state, value: Node) {
      state.treeHierarchy = value
    },
    [Mutations.CHANGE_TREE_NODES] (state, value: Array<Circle>) {
      state.treeNodes = value
    },
    [Mutations.CHANGE_TREE_LINKS] (state, value: Array<Link>) {
      state.treeLinks = value
    },
    [Mutations.CHANGE_TREE_HEIGHT] (state, value: number) {
      state.treeHeight = value
    }
  },
  actions: {
    [Actions.CREATE_HIERARCHY_FOR_CIRCLES]: createHierarchyForCircles,
    [Actions.CREATE_HIERARCHY_FOR_TREE]: createHierarchyForTree,
    [Actions.INITIALIZE_NODES]: initializeNodes,
    [Actions.ADD_NODE_TO_VISITED_NODES]: addNodeToVisitedNodes,
    [Actions.RESIZE_CANVAS]: resizeCanvas,
    [Actions.UPDATE_CIRCLE_CANVAS]: updateCircleCanvas,
    [Actions.UPDATE_TREE_CANVAS]: updateTreeCanvas,
    [Actions.UPDATE_PATH]: updatePath,
    [Actions.UPDATE_PATHS_DATASET]: updatePathsDataset,
    [Actions.SELECT_PATH]: selectPath,
    [Actions.UPDATE_DATASET]: updateDataset,
    [Actions.APPEND_NODE_TREE]: appendNodeTree,
    [Actions.CUT_NODE_TREE_CHILDREN]: cutNodeTreeChildren
  }
}

function selectPath (context) {
  const activePath: Path = context.getters[Getters.GET_ACTIVE_PATH]
  // const nodes: Array<Node> = context.getters[Getters.GET_NODES]
  const rootId = activePath.vertices[activePath.up]
  let leftLabel = context.state.labels[activePath.vertices[0]]
  if (leftLabel.label === undefined) {
    leftLabel = activePath.vertices[0]
  } else {
    leftLabel = leftLabel.label
  }
  const leftMapping = new MappingNode(0, leftLabel)
  leftMapping.nodeID = activePath.vertices[0]
  leftMapping.mapBy = leftLabel
  let rightLabel = context.state.labels[activePath.vertices[activePath.vertices.length - 1]]
  if (rightLabel.label === undefined) {
    rightLabel = activePath.vertices[activePath.vertices.length - 1]
  } else {
    rightLabel = rightLabel.label
  }
  const rightMapping = new MappingNode(0, rightLabel)
  rightMapping.nodeID = activePath.vertices[activePath.vertices.length - 1]
  rightMapping.mapBy = rightLabel
  context.commit(Mutations.CHANGE_LEFT_MAPPING, [leftMapping])
  context.commit(Mutations.CHANGE_RIGHT_MAPPING, [rightMapping])
  context.commit(Mutations.CHANGE_ROOT_ID, rootId)
  const visitedNode: Label = context.state.labels[rootId]
  context.commit(Mutations.CHANGE_VISITED_NODES, [visitedNode])
  context.commit(Mutations.CHANGE_PATH_NODES, createPathNodes(context.state.nodes, context.state.activePath))
  // context.commit(Mutations.)
}

function updatePath (context, value: number) {
  context.commit(Mutations.CHANGE_ROOT_ID, context.state.visitedNodes[value].id)
  context.commit(Mutations.CHANGE_VISITED_NODES, context.state.visitedNodes.slice(0, value + 1))
  context.dispatch(Actions.CREATE_HIERARCHY_FOR_CIRCLES)
  context.dispatch(Actions.UPDATE_CIRCLE_CANVAS)
}

// eslint-disable-next-line
function addMappingItemToArray (array: Array<ComboboxItem>, item: any, index: number) {
  array.push(new ComboboxItem(item.metadata.title + '/' + item.metadata.from, index))
}

function updateDataset (context, { dataset, position }) {
  const selectList = []
  dataset.mappings.forEach((element, i) => {
    addMappingItemToArray(selectList, element, i)
  })
  switch (position) {
    case Position.Left:
      context.commit(Mutations.CHANGE_LEFT_DATASET, dataset)
      context.commit(Mutations.CHANGE_LEFT_MAPPING_LIST, selectList)
      break
    case Position.Right:
      context.commit(Mutations.CHANGE_RIGHT_DATASET, dataset)
      context.commit(Mutations.CHANGE_RIGHT_MAPPING_LIST, selectList)
      break
  }
  context.dispatch(Actions.INITIALIZE_NODES)
}

function updatePathsDataset (context, dataset) {
  context.commit(Mutations.CHANGE_PATHS_DATASET, dataset.paths)
  context.commit(Mutations.CHANGE_PATHS, createPaths(context.state.nodes, dataset.paths, context.state.labels))
  context.commit(Mutations.CHANGE_ACTIVE_PATH, undefined)
}

function createHierarchyForCircles (context) {
  if (context.state.nodes.length === 0) {
    return undefined
  } else {
    if (context.state.depth === 0) {
      context.state.depth = 1
    }
    const maxDepth = getMaxTreeDepth(context.getters[Getters.GET_ROOT_ID], context.state.nodes, MAX_DEPTH)
    if (maxDepth < context.state.depth) {
      context.commit(Mutations.CHANGE_CIRCLE_HIERARCHY, createTree(context.state.rootId, context.state.nodes, maxDepth))
    } else {
      context.commit(Mutations.CHANGE_CIRCLE_HIERARCHY, createTree(context.state.rootId, context.state.nodes, context.state.depth))
    }
    context.commit(Mutations.CHANGE_MAX_DEPTH, maxDepth)
  }
}

function cutNodeTreeChildren (context, circle: Circle) {
  if (context.state.nodes.length === 0) {
    return undefined
  } else {
    const hierarchyArray = createArrayFromHierarchy(context.state.treeHierarchy)
    const root = getNodeByKey(hierarchyArray, circle.key)
    root.children = []
    root.isLeaf = true
    context.dispatch(Actions.UPDATE_TREE_CANVAS)
  }
}

function appendNodeTree (context, circle: Circle) {
  if (context.state.nodes.length === 0) {
    return undefined
  } else {
    const hierarchyArray = createArrayFromHierarchy(context.state.treeHierarchy)
    const root = getNodeByKey(hierarchyArray, circle.key)
    const result = appendNode(root, context.state.nodes, hierarchyArray.length - 1, context.state.treeHeight)
    root.children = result.rootCopy.children
    root.isLeaf = false
    context.commit(Mutations.CHANGE_TREE_HEIGHT, result.maxDepth)
    context.dispatch(Actions.UPDATE_TREE_CANVAS)
  }
}

function createHierarchyForTree (context) {
  if (context.state.nodes.length === 0) {
    return undefined
  } else {
    context.commit(Mutations.CHANGE_TREE_HIERARCHY, createTree(context.state.rootId, context.state.nodes, MAX_TREE_DEPTH))
    context.commit(Mutations.CHANGE_TREE_HEIGHT, MAX_TREE_DEPTH)
  }
}

function resizeCanvas (context, value: {width: number; height: number}) {
  context.commit(Mutations.CHANGE_WINDOW, value)
}

function createCircles (context): Array<Circle> {
  return packNodes(context.state.window.height, context.state.window.width, context.state.circleHierarchy, context.state.maxDepth)
}

function updateCircleCanvas (context) {
  context.commit(Mutations.CHANGE_CIRCLES, createCircles(context))
  context.commit(Mutations.CHANGE_LEFT_ARROWS, packMappingArrows(context.state.window.height, context.state.window.width,
    context.state.circles, createLayer(context.getters[Getters.GET_LEFT_MAPPING], context.state.nodes), Position.Left))
  context.commit(Mutations.CHANGE_RIGHT_ARROWS, packMappingArrows(context.state.window.height, context.state.window.width,
    context.state.circles, createLayer(context.getters[Getters.GET_RIGHT_MAPPING], context.state.nodes), Position.Right))
  if (context.state.activePath !== undefined) {
    context.commit(Mutations.CHANGE_CIRCLES, highlightPaths(context.state.circles, context.state.activePath))
  }
}

function updateTreeCanvas (context) {
  const result = packTreeHierarchy(context.state.treeHierarchy, context.state.window.width, context.state.treeHeight)
  context.commit(Mutations.CHANGE_TREE_NODES, result.circles)
  context.commit(Mutations.CHANGE_TREE_LINKS, result.links)
  highlightTreeMapping(context.state.treeNodes,
    createLayer(context.getters[Getters.GET_LEFT_MAPPING], context.state.nodes),
    createLayer(context.getters[Getters.GET_RIGHT_MAPPING], context.state.nodes))
  if (context.state.activePath !== undefined) {
    context.commit(Mutations.CHANGE_TREE_NODES, highlightPaths(context.state.treeNodes, context.state.activePath))
  }
}

function initializeNodes (context) {
  context.commit(Mutations.CHANGE_ROOT_ID, ROOT_ID)
  context.commit(Mutations.CHANGE_ACTIVE_PATH, undefined)
  const labels = createLabels(context.state.leftDataset, context.state.rightDataset)
  context.commit(Mutations.CHANGE_LABELS, labels)
  context.commit(Mutations.CHANGE_LINKS, createLinks(context.state.leftDataset, context.state.rightDataset))
  context.commit(Mutations.CHANGE_NODES, createNodes(context.state.links, context.state.labels))
  context.commit(Mutations.CHANGE_VISITED_NODES, [labels[ROOT_ID]])
  context.commit(Mutations.CHANGE_PATH_NODES, Array<Node>())
}

function addNodeToVisitedNodes (context, leaf: Circle) {
  context.commit(Mutations.CHANGE_ROOT_ID, leaf.id)
  const array = Array<Label>()
  array.push(context.state.labels[leaf.id])
  let parent = leaf.parent
  while (parent !== null) {
    if (parent.data.id !== ROOT_ID && parent.parent != null) {
      array.push(context.state.labels[parent.data.id])
    }
    parent = parent.parent
  }
  while (array.length !== 0) {
    const element = array.pop()
    if (element !== undefined) {
      context.state.visitedNodes.push(element)
    }
  }
}

export function createLabel (id: string, label: string) {
  return new Label(
    id,
    label
  )
}

// eslint-disable-next-line
function createLabels (leftDataset: any, rightDataset: any) {
  const result = new Set<string>()
  for (const key in leftDataset.labels) {
    result[key] = createLabel(key, leftDataset.labels[key])
  }
  for (const key in rightDataset.labels) {
    result[key] = createLabel(key, rightDataset.labels[key])
  }
  result[ROOT_ID] = createLabel(ROOT_ID, ROOT_LABEL)
  return result
}

function containsLink (array: Array<Link>, link: Link) {
  if (array.filter(x => x.parent === link.parent &&
    x.child === link.child && x.relation === link.relation).length === 0
  ) {
    return false
  } else {
    return true
  }
}

function createLink (parent: string, child: string, relation: string) {
  return new Link(parent,
    child,
    relation
  )
}

// eslint-disable-next-line
export function createLinks (leftDataset: any, rightDataset: any) {
  const result = new Array<Link>()
  if (leftDataset.hierarchy !== undefined) {
    leftDataset.hierarchy.forEach(link => {
      result.push(createLink(link[2], link[0], link[1]))
    })
  }
  if (rightDataset.hierarchy !== undefined) {
    rightDataset.hierarchy.forEach(link => {
      const createdLink = createLink(link[2], link[0], link[1])
      if (!containsLink(result, createdLink)) {
        result.push(createdLink)
      }
    })
  }
  return result
}
