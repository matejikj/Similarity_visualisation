import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import storeVisualisation, { Mutations, Getters, Actions } from '../../src/visualisation/Visualisation.store'
import { cloneDeep } from 'lodash'
import { Labels, Circle, MappingNode, Path } from '@/models'
import { createHierarchy, createTree, highlightTreeMapping, mapUrlsToActiveView, collapseIrrelevantSubtrees } from '@/utils/hierarchyUtils'
import { initalizeNodes, packNodes, packTreeHierarchy, createVisitedNode } from '@/utils/nodesUtils'
import { VisitedNode } from '@/models/VisitedNode'
import { createPathNodes } from '@/utils/pathUtils'

const hierarchy: any = [
  [
    'E3',
    'subclass',
    'E1'
  ],
  [
    'E2',
    'subclass',
    'E1'
  ]
]

const labels: Labels = {
  E1: 'a',
  E2: 'b',
  E3: 'c',
  Q35120: 'Q35120'
}

const localVue = createLocalVue()
localVue.use(Vuex)

describe('store/actions/CREATE_PATH_HIERARCHY_FOR_TREE', () => {
  const store = new Vuex.Store(cloneDeep(storeVisualisation))
  const labels1: Labels = {
    E1: 'a',
    E2: 'b',
    E3: 'c',
    E4: 'd',
    E5: 'e',
    E6: 'f',
    E7: 'g',
    E8: 'h',
    E9: 'i',
    Q35120: 'Q35120'
  }

  const hierarchy1: any = [
    [
      'E2',
      'subclass',
      'E1'
    ],
    [
      'E3',
      'subclass',
      'E1'
    ],
    [
      'E8',
      'subclass',
      'E1'
    ],
    [
      'E4',
      'subclass',
      'E2'
    ],
    [
      'E5',
      'subclass',
      'E2'
    ],
    [
      'E6',
      'subclass',
      'E2'
    ],
    [
      'E7',
      'subclass',
      'E3'
    ],
    [
      'E9',
      'subclass',
      'E8'
    ]
  ]

  const path: Path = {
    from: 'd',
    to: 'g',
    vertices: ['E4', 'E2', 'E1', 'E3', 'E7'],
    up: 2,
    down: 2,
    height: 2,
    arrows: [
      '▲',
      '▲',
      '▼',
      '▼'
    ],
    leftKeywords: 'word1 ',
    rightKeywords: 'word2, '
  }

  const rootId: string = path.vertices[path.up]

  store.commit(Mutations.CHANGE_ACTIVE_PATH, path)
  store.commit(Mutations.CHANGE_NODES, initalizeNodes(hierarchy1, labels1))
  it('check left', () => {
    return store.dispatch(Actions.SELECT_PATH, labels1)
      .then(() => expect(store.getters[Getters.GET_LEFT_MAPPING])
        .toEqual([{
          id: 0,
          mapBy: 'd',
          name: 'd',
          nodeID: 'E4'
        }])
      )
  })

  it('check right', () => {
    return expect(store.getters[Getters.GET_RIGHT_MAPPING])
      .toEqual([{
        id: 0,
        mapBy: 'g',
        name: 'g',
        nodeID: 'E7'
      }])
  })

  it('check root', () => {
    return expect(store.getters[Getters.GET_ROOT_ID])
      .toEqual('E1')
  })

  it('check visited', () => {
    return expect(store.getters[Getters.GET_VISITED_NODES])
      .toEqual([createVisitedNode(rootId, labels[rootId])])
  })

  it('check path', () => {
    return expect(store.getters[Getters.GET_PATH_NODES])
      .toEqual(createPathNodes(store.getters[Getters.GET_NODES], store.getters[Getters.GET_ACTIVE_PATH]))
  })
})

describe('store/actions/CREATE_PATH_HIERARCHY_FOR_TREE', () => {
  const store = new Vuex.Store(cloneDeep(storeVisualisation))

  const hierarchy1: any = [
    [
      'E2',
      'subclass',
      'E1'
    ],
    [
      'E3',
      'subclass',
      'E1'
    ],
    [
      'E8',
      'subclass',
      'E1'
    ],
    [
      'E4',
      'subclass',
      'E2'
    ],
    [
      'E5',
      'subclass',
      'E2'
    ],
    [
      'E6',
      'subclass',
      'E2'
    ],
    [
      'E7',
      'subclass',
      'E3'
    ],
    [
      'E9',
      'subclass',
      'E8'
    ]
  ]
  const labels1: Labels = {
    E1: 'a',
    E2: 'b',
    E3: 'c',
    E4: 'd',
    E5: 'e',
    E6: 'f',
    E7: 'g',
    E8: 'h',
    E9: 'i',
    Q35120: 'Q35120'
  }

  store.commit(Mutations.CHANGE_ROOT_ID, 'E1')
  const nodes = initalizeNodes(hierarchy1, labels1)
  store.commit(Mutations.CHANGE_NODES, nodes)
  let tree = createTree('E1', nodes, 2).root
  tree = collapseIrrelevantSubtrees(tree, ['E1', 'E2', 'E4', 'E3', 'E7'])

  const path = {
    from: 'E4',
    to: 'E7',
    vertices: ['E1', 'E2', 'E4', 'E3', 'E7'],
    up: 2,
    down: 2,
    height: 2,
    arrows: [
      '▲',
      '▲',
      '▼',
      '▼'
    ],
    leftKeywords: 'word1',
    rightKeywords: 'word2'
  }

  store.dispatch(Actions.CREATE_HIERARCHY_FOR_TREE, 4)
  store.commit(Mutations.CHANGE_ACTIVE_PATH, path)
  it('check nodes', () => {
    return store.dispatch(Actions.CREATE_PATH_HIERARCHY_FOR_TREE)
      .then(() => expect(store.getters[Getters.GET_TREE_HIERARCHY])
        .toEqual(tree)
      )
  })

  it('check id', () => {
    expect(store.getters[Getters.GET_TREE_HEIGHT])
      .toEqual(2)
  })
})

describe('store/actions/INIT_PATH_NODES', () => {
  const store = new Vuex.Store(cloneDeep(storeVisualisation))
  it('check empty nodes', () => {
    return store.dispatch(Actions.INIT_PATH_NODES)
      .then(() => expect(store.getters[Getters.GET_PATH_NODES])
        .toEqual([])
      )
  })
})

describe('store/actions/UPDATE_PATH', () => {
  const store = new Vuex.Store(cloneDeep(storeVisualisation))

  const visitedNodes: VisitedNode[] = [
    {
      id: 'Q35120',
      label: 'Q35120'
    },
    {
      id: 'E1',
      label: 'a'
    }
  ]

  const result: VisitedNode[] = [
    {
      id: 'Q35120',
      label: 'Q35120'
    }
  ]

  store.commit(Mutations.CHANGE_ROOT_ID, 'E1')
  store.commit(Mutations.CHANGE_VISITED_NODES, visitedNodes)

  it('check nodes', () => {
    return store.dispatch(Actions.UPDATE_PATH, 0)
      .then(() => expect(store.getters[Getters.GET_VISITED_NODES])
        .toEqual(result)
      )
  })

  it('check id', () => {
    expect(store.getters[Getters.GET_ROOT_ID])
      .toEqual('Q35120')
  })
})

describe('store/actions/UPDATE_TERE_CANVAS', () => {
  const store = new Vuex.Store(cloneDeep(storeVisualisation))

  const nodes = initalizeNodes(hierarchy, labels)
  store.commit(Mutations.CHANGE_NODES, nodes)
  store.commit(Mutations.CHANGE_DEPTH, 2)
  store.dispatch(Actions.CREATE_HIERARCHY_FOR_TREE)

  const leftMapNode: MappingNode = {
    id: 0,
    name: 'b',
    mapBy: 'word1',
    nodeID: 'E2'
  }
  const rightMapNode: MappingNode = {
    id: 1,
    name: 'c',
    mapBy: 'word2',
    nodeID: 'E3'
  }
  store.commit(Mutations.CHANGE_LEFT_MAPPING, [leftMapNode])
  store.commit(Mutations.CHANGE_RIGHT_MAPPING, [rightMapNode])

  store.dispatch(Actions.RESIZE_CANVAS, { height: 720, width: 1024 })

  // @ts-ignore
  const result = packTreeHierarchy(store.state.treeHierarchy, store.state.window.width, store.state.treeHeight)
  // @ts-ignore
  const highlightedCircles = highlightTreeMapping(
    // @ts-ignore
    result.circles,
    // @ts-ignore
    mapUrlsToActiveView(store.getters[Getters.GET_LEFT_MAPPING], store.state.nodes),
    // @ts-ignore
    mapUrlsToActiveView(store.getters[Getters.GET_RIGHT_MAPPING], store.state.nodes)
  )
  it('check circles', () => {
    return store.dispatch(Actions.UPDATE_TREE_CANVAS)
      .then(() => expect(store.getters[Getters.GET_TREE_NODES])
        .toEqual(highlightedCircles)
      )
  })

  it('check links', () => {
    expect(store.getters[Getters.GET_TREE_LINKS])
      .toEqual(result.links)
  })
})

describe('store/actions/UPDATE_CIRCLE_CANVAS', () => {
  const store = new Vuex.Store(cloneDeep(storeVisualisation))

  const nodes = initalizeNodes(hierarchy, labels)
  store.commit(Mutations.CHANGE_NODES, nodes)
  store.commit(Mutations.CHANGE_DEPTH, 2)
  store.dispatch(Actions.CREATE_HIERARCHY_FOR_CIRCLES)

  const leftMapNode: MappingNode = {
    id: 0,
    name: 'b',
    mapBy: 'word1',
    nodeID: 'E2'
  }
  const rightMapNode: MappingNode = {
    id: 1,
    name: 'c',
    mapBy: 'word2',
    nodeID: 'E3'
  }
  store.commit(Mutations.CHANGE_LEFT_MAPPING, [leftMapNode])
  store.commit(Mutations.CHANGE_RIGHT_MAPPING, [rightMapNode])

  store.dispatch(Actions.RESIZE_CANVAS, { height: 720, width: 1024 })

  it('mutate new hierarchy', () => {
    return store.dispatch(Actions.UPDATE_CIRCLE_CANVAS)
      .then(() => expect(store.getters[Getters.GET_CIRCLES])
        // @ts-ignore
        .toEqual(packNodes(store.state.window.height, store.state.window.width, store.state.circleHierarchy, store.state.maxDepth))
      )
  })

  const leftArrow = {
    id: 0,
    lx: 0,
    ly: 360,
    mapTo: 'b',
    r: 140.86956521739128,
    rx: 525.6521739130435,
    ry: 360,
    word: 'word1'
  }

  it('mutate left arrows', () => {
    return expect(store.getters[Getters.GET_LEFT_ARROWS])
      // @ts-ignore
      .toEqual([leftArrow])
  })

  const rightArrow = {
    id: 0,
    lx: 1024,
    ly: 360,
    mapTo: 'c',
    r: 140.86956521739128,
    rx: 498.3478260869565,
    ry: 360,
    word: 'word2'
  }

  it('mutate right arrows', () => {
    return expect(store.getters[Getters.GET_RIGHT_ARROWS])
      // @ts-ignore
      .toEqual([rightArrow])
  })
})

describe('store/actions/CREATE_HIERARCHY_FOR_TREE', () => {
  const store = new Vuex.Store(cloneDeep(storeVisualisation))

  const nodes = initalizeNodes(hierarchy, labels)
  store.commit(Mutations.CHANGE_NODES, nodes)

  it('mutate new hierarchy', () => {
    return store.dispatch(Actions.CREATE_HIERARCHY_FOR_TREE, 4)
      // @ts-ignore
      .then(() => expect(store.getters[Getters.GET_TREE_HIERARCHY])
        .toEqual(createTree('Q35120', nodes, 4).root)
      )
  })
  it('set new depth', () => {
    return expect(store.getters[Getters.GET_TREE_HEIGHT])
      .toEqual(2)
  })
})

describe('store/actions/CREATE_HIERARCHY_FOR_CIRCLES', () => {
  const store = new Vuex.Store(cloneDeep(storeVisualisation))

  const nodes = initalizeNodes(hierarchy, labels)
  store.commit(Mutations.CHANGE_NODES, nodes)

  it('mutate new hierarchy', () => {
    return store.dispatch(Actions.CREATE_HIERARCHY_FOR_CIRCLES)
      // @ts-ignore
      .then(() => expect(store.getters[Getters.GET_CIRCLE_HIERARCHY])
        .toEqual(createTree('Q35120', nodes, 1).root)
      )
  })
  it('set new depth', () => {
    return expect(store.getters[Getters.GET_DEPTH])
      .toEqual(1)
  })

  it('set new max depth', () => {
    return expect(store.getters[Getters.GET_MAX_DEPTH])
      .toEqual(2)
  })
})

describe('store/actions/CREATE_HIERARCHY_FOR_CIRCLES', () => {
  const store = new Vuex.Store(cloneDeep(storeVisualisation))

  const nodes = initalizeNodes(hierarchy, labels)
  store.commit(Mutations.CHANGE_NODES, nodes)

  it('mutate new hierarchy', () => {
    return store.dispatch(Actions.CREATE_HIERARCHY_FOR_CIRCLES)
      // @ts-ignore
      .then(() => expect(store.getters[Getters.GET_CIRCLE_HIERARCHY])
        .toEqual(createTree('Q35120', nodes, 1).root)
      )
  })
  it('set new depth', () => {
    return expect(store.getters[Getters.GET_DEPTH])
      .toEqual(1)
  })

  it('set new max depth', () => {
    return expect(store.getters[Getters.GET_MAX_DEPTH])
      .toEqual(2)
  })
})

describe('store/actions/RESIZE_CANVAS', () => {
  const store = new Vuex.Store(cloneDeep(storeVisualisation))

  it('new size', () => {
    return store.dispatch(Actions.RESIZE_CANVAS, { width: 1024, height: 720 })
      // @ts-ignore
      .then(() => expect(store.state.window)
        .toEqual({ width: 1024, height: 720 })
      )
  })
})

describe('store/mutations/CHANGE_VISITED_NODES', () => {
  const store = new Vuex.Store(cloneDeep(storeVisualisation))
  store.commit(Mutations.CHANGE_VISITED_NODES, [{ id: 'E1', label: 'a' }])
  it('mutate visited nodes', () => {
    return expect(store.getters[Getters.GET_VISITED_NODES])
      .toEqual([{ id: 'E1', label: 'a' }])
  })
})

describe('store/actions/ADD_VISITED_NODES', () => {
  const store = new Vuex.Store(cloneDeep(storeVisualisation))

  const circle1: Circle = new Circle('E2', 'b', false, 2, 20, 20, 10, 0)
  circle1.parent = {
    data: {
      id: 'E1'
    },
    parent: {
      data: {
        id: 'Q35120'
      },
      parent: null
    }
  }

  store.dispatch(Actions.ADD_NODE_TO_VISITED_NODES, { labels: labels, leaf: circle1 })
  it('set actual node as root', () => {
    return expect(store.getters[Getters.GET_ROOT_ID])
      .toEqual('E2')
  })

  it('add node to visited nodes', () => {
    return expect(store.getters[Getters.GET_VISITED_NODES])
      .toEqual([
        {
          id: 'E1',
          label: 'a'
        },
        {
          id: 'E2',
          label: 'b'
        }
      ])
  })
})
