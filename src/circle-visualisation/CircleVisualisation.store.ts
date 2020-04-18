import { ROOT_LABEL, ROOT_ID, MAX_DEPTH, Link, MappingNode, Label, Node, Circle, Arrow, Position } from '@/models'
import { createLabels, createLinks, createNodes, createTree, createLayer, getMaxTreeDepth } from '@/services/create'
import { packCircles, packArrows } from '@/services/pack'

export const STORE_NAME = 'circleVisualisation'

export const Actions = {
  INITIALIZE_NODES: 'INITIALIZE_NODES',
  BUILD_TREE: 'BUILD_TREE',
  ADD_NODE_TO_PATH: 'ADD_NODE_TO_PATH',
  UPDATE_CANVAS: 'UPDATE_CANVAS',
  RESIZE_CANVAS: 'RESIZE_CANVAS',
  UPDATE_PATH: 'UPDATE_PATH'
}

export const Mutations = {
  CHANGE_WINDOW: 'CHANGE_WINDOW',
  CHANGE_LEFT_DATASET: 'CHANGE_LEFT_DATASET',
  CHANGE_RIGHT_DATASET: 'CHANGE_RIGHT_DATASET',
  CHANGE_LEFT_MAPPING: 'CHANGE_LEFT_MAPPING',
  CHANGE_RIGHT_MAPPING: 'CHANGE_RIGHT_MAPPING',
  CHANGE_DEPTH: 'CHANGE_DEPTH',
  CHANGE_MAX_DEPTH: 'CHANGE_MAX_DEPTH',
  CHANGE_LABELS: 'CHANGE_LABELS',
  CHANGE_NODES: 'CHANGE_NODES',
  CHANGE_CIRCLES_PATH: 'CHANGE_CIRCLES_PATH',
  CHANGE_CIRCLES: 'CHANGE_CIRCLES',
  CHANGE_LINKS: 'CHANGE_LINKS',
  CHANGE_LEFT_ARROWS: 'CHANGE_LEFT_ARROWS',
  CHANGE_RIGHT_ARROWS: 'CHANGE_RIGHT_ARROWS',
  CHANGE_HIERARCHY: 'CHANGE_HIERARCHY',
  CHANGE_ROOT_ID: 'CHANGE_ROOT_ID'
}

export const Getters = {
  GET_LEFT_DATASET: 'GET_LEFT_DATASET',
  GET_RIGHT_DATASET: 'GET_RIGHT_DATASET',
  GET_LEFT_MAPPING: 'GET_LEFT_MAPPING',
  GET_RIGHT_MAPPING: 'GET_RIGHT_MAPPING',
  GET_DEPTH: 'GET_DEPTH',
  GET_MAX_DEPTH: 'GET_MAX_DEPTH',
  GET_LABELS: 'GET_LABELS',
  GET_NODES: 'GET_NODES',
  GET_CIRCLES_PATH: 'GET_CIRCLES_PATH',
  GET_HIERARCHY: 'GET_HIERARCHY',
  GET_ROOT_ID: 'GET_ROOT_ID',
  GET_CIRCLES: 'GET_CIRCLES',
  GET_RIGHT_ARROWS: 'GET_RIGHT_ARROWS',
  GET_LEFT_ARROWS: 'GET_LEFT_ARROWS',
  GET_NODE_BY_ID: 'GET_NODE_BY_ID'
}

export default {
  namespaced: true,
  state: {
    leftDataset: Object(),
    rightDataset: Object(),
    pathDataset: Object(),
    leftMapping: Array<MappingNode>(),
    rightMapping: Array<MappingNode>(),
    labels: Array<Label>(),
    links: Array<Link>(),
    nodes: Array<Node>(),
    circles: Array<Circle>(),
    leftArrows: Array<Arrow>(),
    rightArrows: Array<Arrow>(),
    rootId: ROOT_ID,
    hierarchy: new Node(ROOT_LABEL, Array<Node>(), Array<Node>(), ROOT_ID, undefined, undefined),
    circlesPath: Array<Label>(),
    depth: 1,
    maxDepth: MAX_DEPTH,
    window: {
      width: 0,
      height: 0
    }
  },
  getters: {
    [Getters.GET_MAX_DEPTH]: (state) => {
      return state.maxDepth
    },
    [Getters.GET_DEPTH]: (state) => {
      return state.depth
    },
    [Getters.GET_HIERARCHY]: (state) => {
      return state.hierarchy
    },
    [Getters.GET_LEFT_DATASET]: (state) => {
      return state.leftDataset
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
    [Getters.GET_CIRCLES_PATH]: (state) => {
      return state.circlesPath
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
    }
  },
  mutations: {
    [Mutations.CHANGE_LEFT_DATASET] (state, value: any) {
      state.leftDataset = value
    },
    [Mutations.CHANGE_RIGHT_DATASET] (state, value: any) {
      state.rightDataset = value
    },
    [Mutations.CHANGE_LEFT_MAPPING] (state, value: Array<MappingNode>) {
      state.leftMapping = value
    },
    [Mutations.CHANGE_RIGHT_MAPPING] (state, value: Array<MappingNode>) {
      state.rightMapping = value
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
    [Mutations.CHANGE_CIRCLES_PATH] (state, value: Array<Label>) {
      state.circlesPath = value
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
    [Mutations.CHANGE_HIERARCHY] (state, value: Node) {
      state.hierarchy = value
    },
    [Mutations.CHANGE_ROOT_ID] (state, value: string) {
      state.rootId = value
    }
  },
  actions: {
    [Actions.BUILD_TREE]: buildTree,
    [Actions.INITIALIZE_NODES]: initializeNodes,
    [Actions.ADD_NODE_TO_PATH]: addNodeToPath,
    [Actions.RESIZE_CANVAS]: resizeCanvas,
    [Actions.UPDATE_CANVAS]: updateCanvas,
    [Actions.UPDATE_PATH]: updatePath
  }
}

function updatePath (context, value: number) {
  context.commit(Mutations.CHANGE_ROOT_ID, context.state.circlesPath[value].id)
  context.commit(Mutations.CHANGE_CIRCLES_PATH, context.state.circlesPath.slice(0, value + 1))
  context.dispatch(Actions.BUILD_TREE)
  context.dispatch(Actions.UPDATE_CANVAS)
}

function buildTree (context) {
  if (context.state.nodes.length === 0) {
    return undefined
  } else {
    if (context.state.depth === 0) {
      context.state.depth = 1
    }
    const maxDepth = getMaxTreeDepth(context.getters[Getters.GET_ROOT_ID], context.state.nodes, MAX_DEPTH)
    if (maxDepth < context.state.depth) {
      context.commit(Mutations.CHANGE_HIERARCHY, createTree(context.state.rootId, context.state.nodes, maxDepth))
    } else {
      context.commit(Mutations.CHANGE_HIERARCHY, createTree(context.state.rootId, context.state.nodes, context.state.depth))
    }
    context.commit(Mutations.CHANGE_MAX_DEPTH, maxDepth)
  }
}

function resizeCanvas (context, value: {width: number; height: number}) {
  context.commit(Mutations.CHANGE_WINDOW, value)
  context.dispatch(Actions.UPDATE_CANVAS)
}

function createCircles (context): Array<Circle> {
  return packCircles(context.state.window.height, context.state.window.width, context.state.hierarchy, context.state.maxDepth)
}

function updateCanvas (context) {
  context.commit(Mutations.CHANGE_CIRCLES, createCircles(context))
  context.commit(Mutations.CHANGE_LEFT_ARROWS, packArrows(context.state.window.height, context.state.window.width,
    context.state.circles, createLayer(context.getters[Getters.GET_LEFT_MAPPING], context.state.nodes), Position.Left))
  context.commit(Mutations.CHANGE_RIGHT_ARROWS, packArrows(context.state.window.height, context.state.window.width,
    context.state.circles, createLayer(context.getters[Getters.GET_RIGHT_MAPPING], context.state.nodes), Position.Right))
}

function initializeNodes (context) {
  context.commit(Mutations.CHANGE_LABELS, createLabels(context.state.leftDataset, context.state.rightDataset))
  context.commit(Mutations.CHANGE_LINKS, createLinks(context.state.leftDataset, context.state.rightDataset))
  context.commit(Mutations.CHANGE_NODES, createNodes(context.state.links, context.state.labels))
  let rootLabel = context.state.labels.filter(x => x.id === ROOT_ID)[0]
  if (rootLabel === undefined) {
    rootLabel = new Label(ROOT_ID, ROOT_LABEL)
  }
  context.commit(Mutations.CHANGE_CIRCLES_PATH, [rootLabel])
  context.dispatch(Actions.BUILD_TREE, context)
  context.dispatch(Actions.UPDATE_CANVAS, context)
}

function addNodeToPath (context, leaf: Circle) {
  context.commit(Mutations.CHANGE_ROOT_ID, leaf.id)
  const array = Array<Label>()
  array.push(context.state.labels.filter(x => x.id === leaf.id)[0])
  let parent = leaf.parent
  while (parent !== null) {
    if (parent.data.id !== ROOT_ID && parent.parent != null) {
      array.push(context.state.labels.filter(x => x.id === parent.data.id)[0])
    }
    parent = parent.parent
  }
  while (array.length !== 0) {
    const element = array.pop()
    if (element !== undefined) {
      context.state.circlesPath.push(element)
    }
  }
}
