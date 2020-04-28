import { ROOT_LABEL, ROOT_ID, MAX_DEPTH, Link, MappingNode, Label, Node, Circle, Arrow, Position, Path } from '@/models'
import { createLabels, createLinks, createNodes, createTree, createLayer, getMaxTreeDepth } from '@/services/create'
import { packCircles, packArrows } from '@/services/pack'
import axios from 'axios'
import * as d3 from 'd3'

export const STORE_NAME = 'circleVisualisation'

export const Actions = {
  INITIALIZE_NODES: 'INITIALIZE_NODES',
  BUILD_TREE: 'BUILD_TREE',
  ADD_NODE_TO_PATH: 'ADD_NODE_TO_PATH',
  UPDATE_CANVAS: 'UPDATE_CANVAS',
  RESIZE_CANVAS: 'RESIZE_CANVAS',
  UPDATE_PATH: 'UPDATE_PATH',
  FETCH_PATHS_DATASET: 'FETCH_PATHS_DATASET',
  SELECT_PATH: 'SELECT_PATHZ'
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
  CHANGE_VISITED_NODES: 'CHANGE_VISITED_NODES',
  CHANGE_CIRCLES: 'CHANGE_CIRCLES',
  CHANGE_LINKS: 'CHANGE_LINKS',
  CHANGE_LEFT_ARROWS: 'CHANGE_LEFT_ARROWS',
  CHANGE_RIGHT_ARROWS: 'CHANGE_RIGHT_ARROWS',
  CHANGE_HIERARCHY: 'CHANGE_HIERARCHY',
  CHANGE_ROOT_ID: 'CHANGE_ROOT_ID',
  CHANGE_PATHS_DATASET: 'CHANGE_PATHS_DATASET',
  CHANGE_PATHS: 'CHANGE_PATHS',
  CHANGE_ACTIVE_PATH: 'CHANGE_ACTIVE_PATH',
  CHANGE_PATH_NODES: 'CHANGE_PATH_NODES'
}

export const Getters = {
  GET_LEFT_DATASET: 'GET_LEFT_DATASET',
  GET_RIGHT_DATASET: 'GET_RIGHT_DATASET',
  GET_LEFT_MAPPING: 'GET_LEFT_MAPPING',
  GET_RIGHT_MAPPING: 'GET_RIGHT_MAPPING',
  GET_DEPTH: 'GET_DEPTH',
  GET_ACTIVE_PATH: 'GET_ACTIVE_PATH',
  GET_MAX_DEPTH: 'GET_MAX_DEPTH',
  GET_LABELS: 'GET_LABELS',
  GET_NODES: 'GET_NODES',
  GET_PATHS: 'GET_PATHS',
  GET_VISITED_NODES: 'GET_VISITED_NODES',
  GET_HIERARCHY: 'GET_HIERARCHY',
  GET_ROOT_ID: 'GET_ROOT_ID',
  GET_CIRCLES: 'GET_CIRCLES',
  GET_RIGHT_ARROWS: 'GET_RIGHT_ARROWS',
  GET_LEFT_ARROWS: 'GET_LEFT_ARROWS',
  GET_NODE_BY_ID: 'GET_NODE_BY_ID',
  GET_PATH_NODES: 'GET_PATH_NODES'
}

export default {
  namespaced: true,
  state: {
    leftDataset: Object(),
    rightDataset: Object(),
    pathsDataset: Object(),
    leftMapping: Array<MappingNode>(),
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
    hierarchy: new Node(ROOT_LABEL, Array<Node>(), Array<Node>(), ROOT_ID, undefined, undefined),
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
    [Getters.GET_DEPTH]: (state) => {
      return state.depth
    },
    [Getters.GET_HIERARCHY]: (state) => {
      return state.hierarchy
    },
    [Getters.GET_PATHS]: (state) => {
      return state.paths
    },
    [Getters.GET_LEFT_DATASET]: (state) => {
      return state.leftDataset
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
    [Mutations.CHANGE_HIERARCHY] (state, value: Node) {
      state.hierarchy = value
    },
    [Mutations.CHANGE_ROOT_ID] (state, value: string) {
      state.rootId = value
    },
    [Mutations.CHANGE_PATH_NODES] (state, value: Array<Node>) {
      state.pathNodes = value
    }
  },
  actions: {
    [Actions.BUILD_TREE]: buildTree,
    [Actions.INITIALIZE_NODES]: initializeNodes,
    [Actions.ADD_NODE_TO_PATH]: addNodeToPath,
    [Actions.RESIZE_CANVAS]: resizeCanvas,
    [Actions.UPDATE_CANVAS]: updateCanvas,
    [Actions.UPDATE_PATH]: updatePath,
    [Actions.FETCH_PATHS_DATASET]: fetchPathsDataset,
    [Actions.SELECT_PATH]: selectPath
  }
}

function selectPath (context) {
  const activePath: Path = context.getters[Getters.GET_ACTIVE_PATH]
  // const nodes: Array<Node> = context.getters[Getters.GET_NODES]
  const rootId = activePath.vertices[activePath.up]
  context.commit(Mutations.CHANGE_ROOT_ID, rootId)
  const visitedNode: Label = context.getters[Getters.GET_LABELS].filter(x => x.id === rootId)[0]
  context.commit(Mutations.CHANGE_VISITED_NODES, [visitedNode])
  const pathNodes = Array<Node>()
  let tmpUp = activePath.up
  let indexLeft = 0
  let indexRight = 0
  const pathColor = d3.scaleLinear()
    .domain([0, activePath.height])
    .range(['#ff8d92', '#ff0000'])
    .interpolate(d3.interpolateCubehelix)

  activePath.vertices.forEach(x => {
    const node: Node = context.getters[Getters.GET_NODES].filter(y => y.id === x)[0]
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
  context.commit(Mutations.CHANGE_PATH_NODES, pathNodes)
}

function updatePath (context, value: number) {
  context.commit(Mutations.CHANGE_ROOT_ID, context.state.visitedNodes[value].id)
  context.commit(Mutations.CHANGE_VISITED_NODES, context.state.visitedNodes.slice(0, value + 1))
  context.dispatch(Actions.BUILD_TREE)
  context.dispatch(Actions.UPDATE_CANVAS)
}

function fetchPathsDataset (context, url: string) {
  axios.get(url).then(
    response => {
      context.commit(Mutations.CHANGE_PATHS_DATASET, response.data.paths)
      createPaths(context, response.data.paths)
    },
    error => {
      context.state.error = error
    }
  )
  context.commit(Mutations.CHANGE_ACTIVE_PATH, undefined)
}

function createPaths (context, paths) {
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
      const node = context.state.nodes.filter(x => x.id === vertices[j])[0]
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
  context.commit(Mutations.CHANGE_PATHS, array)
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
  if (context.state.activePath !== undefined) {
    context.commit(Mutations.CHANGE_CIRCLES, highlightPaths(context))
  }
}

function highlightPaths (context): Array<Circle> {
  const circles: Array<Circle> = context.getters[Getters.GET_CIRCLES]
  const activePath: Path = context.getters[Getters.GET_ACTIVE_PATH]
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

function initializeNodes (context) {
  context.commit(Mutations.CHANGE_ACTIVE_PATH, undefined)
  context.commit(Mutations.CHANGE_LABELS, createLabels(context.state.leftDataset, context.state.rightDataset))
  context.commit(Mutations.CHANGE_LINKS, createLinks(context.state.leftDataset, context.state.rightDataset))
  context.commit(Mutations.CHANGE_NODES, createNodes(context.state.links, context.state.labels))
  let rootLabel = context.state.labels.filter(x => x.id === ROOT_ID)[0]
  if (rootLabel === undefined) {
    rootLabel = new Label(ROOT_ID, ROOT_LABEL)
  }
  context.commit(Mutations.CHANGE_VISITED_NODES, [rootLabel])
  context.commit(Mutations.CHANGE_PATH_NODES, Array<Node>())
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
      context.state.visitedNodes.push(element)
    }
  }
}
