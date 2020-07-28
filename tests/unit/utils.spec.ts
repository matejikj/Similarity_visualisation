import { createVisitedNode, prepareLabels, mapLinks, getNodeLabel, createNode, containsNode, getNodeById, getUniqueNodes, getNodeByKey, createNodesWithRelationships, initalizeNodes, treeDataToCircles } from '@/utils/nodesUtils'
import { Labels, Circle, Node, Link, MappingNode, ArrowData, Arrow, Position } from '@/models'
import { createHierarchy, copyNode, resetNodeDepths, createTree, appendNode, findNodePredecesorsInActualView, setNodeAsLeaf, getCircleById, visitChildren, mapUrlsToActiveView, createArrayFromHierarchy, collapseIrrelevantSubtrees, packMappingArrows, mappingsIntersection, highlightTreeMapping, createMappingNodeWithChildren, createMappingNodeWithMap, createPathLabels, createMapping, chooseItemFromMapping } from '@/utils/hierarchyUtils'

describe('Create visited node', () => {
  test('it should create node', () => {
    const id = 'id'
    const label = 'label'

    const output = { id: 'id', label: 'label' }

    expect(createVisitedNode(id, label)).toEqual(output)
  })
})

describe('Map labels from input to labels object', () => {
  test('it should transform labels', () => {
    const labels = [{ id: 'Q35120', label: 'entity' }, { id: 'Q1', label: 'something' }]

    const output = { Q35120: 'entity', Q1: 'something' }

    expect(prepareLabels(labels)).toEqual(output)
  })
})

describe('Map links to array of child and parents objects', () => {
  test('it should create array of child and parents', () => {
    const input: Array<[string, string, string]> = [
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
        'E4',
        'subclass',
        'E2'
      ]
    ]

    const output = [
      {
        parent: 'E1',
        child: 'E2'
      },
      {
        parent: 'E1',
        child: 'E3'
      },
      {
        parent: 'E2',
        child: 'E4'
      }
    ]

    expect(mapLinks(input)).toEqual(output)
  })
})

describe('Map emtpy links to array of child and parents objects', () => {
  test('it should create empty array', () => {
    const input: Array<[string, string, string]> = [
    ]

    const output = [
    ]

    expect(mapLinks(input)).toEqual(output)
  })
})

describe('Get node labels', () => {
  test('it should return node label', () => {
    const input: Labels = {
      Q35120: 'entity'
    }

    const output = 'entity'

    expect(getNodeLabel(input, 'Q35120')).toEqual(output)
  })
})

describe('Get node labels', () => {
  test('it should return', () => {
    const input: Labels = {
      Q35120: 'entity'
    }

    const output = 'Q3510'

    expect(getNodeLabel(input, output)).toEqual(output)
  })
})

describe('Get node labels', () => {
  test('it should return', () => {
    const input: Labels = {
    }

    const output = 'Q3510'

    expect(getNodeLabel(input, output)).toEqual(output)
  })
})

describe('Create Node', () => {
  test('it should return new node with label', () => {
    const nodeLabel = 'entity'
    const nodeId = 'Q35120'
    const labels: Labels = {
      Q35120: nodeLabel
    }
    const output: Node = new Node(nodeLabel, [], [], nodeId, 0, undefined, undefined)

    expect(createNode(labels, nodeId)).toEqual(output)
  })
})

describe('Create Node', () => {
  test('it should return new node with label as id', () => {
    const nodeLabel = 'entity'
    const nodeId = 'Q35120'
    const labels: Labels = {
      Q3512: nodeLabel
    }
    const output: Node = new Node(nodeId, [], [], nodeId, 0, undefined, undefined)

    expect(createNode(labels, nodeId)).toEqual(output)
  })
})

describe('Array contain node', () => {
  test('it contains', () => {
    const nodeLabel = 'entity'
    const nodeId = 'Q35120'
    const labels: Labels = {
      Q35120: nodeLabel
    }
    const node: Node = new Node(nodeId, [], [], nodeId, 0, undefined, undefined)
    const nodes: Array<Node> = [node]
    expect(containsNode(nodes, nodeId)).toEqual(true)
  })
})

describe('Array contain node', () => {
  test('it doesn\'t contains', () => {
    const nodeLabel = 'entity'
    const nodeId = 'Q35120'
    const labels: Labels = {
      Q35120: nodeLabel
    }
    const node: Node = new Node(nodeId, [], [], nodeId, 0, undefined, undefined)
    const nodes: Array<Node> = [node]
    expect(containsNode(nodes, 'Q10')).toEqual(false)
  })
})

describe('Array contain node', () => {
  test('it doesn\'t contains', () => {
    const nodeId = 'Q35120'
    const nodes: Array<Node> = []
    expect(containsNode(nodes, nodeId)).toEqual(false)
  })
})

describe('Get node', () => {
  test('it doesn\'t contains', () => {
    const nodeId = 'Q35120'
    const node: Node = new Node(nodeId, [], [], nodeId, 0, undefined, undefined)
    const nodes: Array<Node> = [node]
    expect(getNodeById(nodes, 'Q10')).toEqual(undefined)
  })
})

describe('Get node', () => {
  test('it doesn\'t contains', () => {
    const nodeId = 'Q35120'
    const node: Node = new Node(nodeId, [], [], nodeId, 0, undefined, undefined)
    const nodes: Array<Node> = [node]
    expect(getNodeById(nodes, nodeId)).toEqual(node)
  })
})

describe('Get key', () => {
  test('it doesn\'t contains', () => {
    const nodeId = 'Q35120'
    const node: Node = new Node(nodeId, [], [], nodeId, 0, undefined, undefined)
    const nodes: Array<Node> = [node]
    expect(getNodeByKey(nodes, 1)).toEqual(undefined)
  })
})

describe('Get key', () => {
  test('it doesn\'t contains', () => {
    const nodeId = 'Q35120'
    const node: Node = new Node(nodeId, [], [], nodeId, 0, undefined, undefined)
    const nodes: Array<Node> = [node]
    expect(getNodeByKey(nodes, 0)).toEqual(node)
  })
})

describe('Create array of unique nodes', () => {
  test('create unique nodes from nodes with same id in links', () => {
    const links: Array<Link> = [
      {
        parent: 'E1',
        child: 'E2'
      },
      {
        parent: 'E2',
        child: 'E3'
      },
      {
        parent: 'E1',
        child: 'E4'
      },
      {
        parent: 'E4',
        child: 'E5'
      },
      {
        parent: 'E3',
        child: 'E6'
      }
    ]
    const labels: Labels = {
      E1: 'a',
      E2: 'b',
      E3: 'c',
      E4: 'd',
      E5: 'e',
      E6: 'f'
    }
    const output: Array<Node> = [
      {
        children: [],
        color: undefined,
        depth: undefined,
        id: 'E2',
        isLeaf: false,
        key: 0,
        label: 'b',
        parents: []
      },
      {
        children: [],
        color: undefined,
        depth: undefined,
        id: 'E1',
        isLeaf:
          false,
        key: 0,
        label: 'a',
        parents: []
      },
      {
        children: [],
        color: undefined,
        depth: undefined,
        id: 'E3',
        isLeaf: false,
        key: 0,
        label: 'c',
        parents: []
      },
      {
        children: [],
        color: undefined,
        depth: undefined,
        id: 'E4',
        isLeaf: false,
        key: 0,
        label: 'd',
        parents: []
      },
      {
        children: [],
        color: undefined,
        depth: undefined,
        id: 'E5',
        isLeaf: false,
        key: 0,
        label: 'e',
        parents: []
      },
      {
        children: [],
        color: undefined,
        depth: undefined,
        id: 'E6',
        isLeaf: false,
        key: 0,
        label: 'f',
        parents: []
      }
    ]
    expect(getUniqueNodes(links, labels)).toEqual(output)
  })
})

describe('Create relationships', () => {
  test('it doesn\'t contains', () => {
    const links: Array<Link> = [
      {
        parent: 'E1',
        child: 'E2'
      }
    ]
    const labels: Labels = {
      E1: 'a',
      E2: 'b'
    }
    const node1 = new Node('a', [], [], 'E1', 0, undefined, undefined)
    const node2 = new Node('b', [], [], 'E2', 0, undefined, undefined)
    node1.children.push(node2)
    node2.parents.push(node1)
    expect(createNodesWithRelationships(links, getUniqueNodes(links, labels))).toEqual([node2, node1])
  })
})

describe('Initialize nodes', () => {
  test('it doesn\'t contains', () => {
    const hierarchy: any = [
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
      ]
    ]
    const labels: Labels = {
      E1: 'a',
      E2: 'b',
      E3: 'c',
      E4: 'd',
      E5: 'e',
      E6: 'f',
      E7: 'g',
      Q35120: 'Q35120'
    }
    const node1 = new Node('a', [], [], 'E1', 0, undefined, undefined)
    const node2 = new Node('b', [], [], 'E2', 0, undefined, undefined)
    const node3 = new Node('c', [], [], 'E3', 0, undefined, undefined)
    const node4 = new Node('d', [], [], 'E4', 0, undefined, undefined)
    const node5 = new Node('e', [], [], 'E5', 0, undefined, undefined)
    const node6 = new Node('f', [], [], 'E6', 0, undefined, undefined)
    const node7 = new Node('g', [], [], 'E7', 0, undefined, undefined)
    const node0 = new Node('Q35120', [], [], 'Q35120', 0, undefined, undefined)
    node1.children.push(node2)
    node2.parents.push(node1)

    node1.children.push(node3)
    node3.parents.push(node1)

    node2.children.push(node4)
    node4.parents.push(node2)

    node2.children.push(node5)
    node5.parents.push(node2)

    node2.children.push(node6)
    node6.parents.push(node2)

    node3.children.push(node7)
    node7.parents.push(node3)

    node0.children.push(node1)
    node1.parents.push(node0)

    expect(initalizeNodes(hierarchy, labels)).toEqual([node0, node2, node1, node3, node4, node5, node6, node7])
  })
})

describe('Create hierarchy', () => {
  test('it doesn\'t contains', () => {
    const leftDataset: {hierarchy: [string, string, string][]} = {
      hierarchy: [
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
          'E4',
          'subclass',
          'E2'
        ],
        [
          'E2',
          'subclass',
          'E10'
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
          'E8',
          'subclass',
          'E3'
        ],
        [
          'E9',
          'subclass',
          'E3'
        ],
        [
          'E10',
          'subclass',
          'E4'
        ],
        [
          'E11',
          'subclass',
          'E4'
        ],
        [
          'E12',
          'subclass',
          'E4'
        ],
        [
          'E13',
          'subclass',
          'E5'
        ],
        [
          'E14',
          'subclass',
          'E5'
        ],
        [
          'E15',
          'subclass',
          'E6'
        ],
        [
          'E16',
          'subclass',
          'E7'
        ],
        [
          'E17',
          'subclass',
          'E7'
        ]
      ]
    }

    const rightDataset: {hierarchy: [string, string, string][]} = {
      hierarchy: [
        [
          'E18',
          'subclass',
          'E8'
        ],
        [
          'E19',
          'subclass',
          'E9'
        ],
        [
          'E20',
          'subclass',
          'E10'
        ],
        [
          'E21',
          'subclass',
          'E10'
        ],
        [
          'E22',
          'subclass',
          'E11'
        ],
        [
          'E23',
          'subclass',
          'E12'
        ],
        [
          'E24',
          'subclass',
          'E12'
        ],
        [
          'E25',
          'subclass',
          'E12'
        ],
        [
          'E26',
          'subclass',
          'E13'
        ],
        [
          'E27',
          'subclass',
          'E13'
        ],
        [
          'E28',
          'subclass',
          'E14'
        ],
        [
          'E29',
          'subclass',
          'E15'
        ],
        [
          'E30',
          'subclass',
          'E15'
        ],
        [
          'E31',
          'subclass',
          'E16'
        ],
        [
          'E32',
          'subclass',
          'E16'
        ],
        [
          'E33',
          'subclass',
          'E16'
        ],
        [
          'E34',
          'subclass',
          'E17'
        ],
        [
          'E35',
          'subclass',
          'E18'
        ],
        [
          'E36',
          'subclass',
          'E18'
        ],
        [
          'E37',
          'subclass',
          'E19'
        ],
        [
          'E38',
          'subclass',
          'E19'
        ],
        [
          'E39',
          'subclass',
          'E19'
        ],
        [
          'E40',
          'subclass',
          'E19'
        ],
        [
          'E40',
          'subclass',
          'E19'
        ]
      ]
    }

    const output: [string, string, string][] = [
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
        'E4',
        'subclass',
        'E2'
      ],
      [
        'E2',
        'subclass',
        'E10'
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
        'E8',
        'subclass',
        'E3'
      ],
      [
        'E9',
        'subclass',
        'E3'
      ],
      [
        'E10',
        'subclass',
        'E4'
      ],
      [
        'E11',
        'subclass',
        'E4'
      ],
      [
        'E12',
        'subclass',
        'E4'
      ],
      [
        'E13',
        'subclass',
        'E5'
      ],
      [
        'E14',
        'subclass',
        'E5'
      ],
      [
        'E15',
        'subclass',
        'E6'
      ],
      [
        'E16',
        'subclass',
        'E7'
      ],
      [
        'E17',
        'subclass',
        'E7'
      ],
      [
        'E18',
        'subclass',
        'E8'
      ],
      [
        'E19',
        'subclass',
        'E9'
      ],
      [
        'E20',
        'subclass',
        'E10'
      ],
      [
        'E21',
        'subclass',
        'E10'
      ],
      [
        'E22',
        'subclass',
        'E11'
      ],
      [
        'E23',
        'subclass',
        'E12'
      ],
      [
        'E24',
        'subclass',
        'E12'
      ],
      [
        'E25',
        'subclass',
        'E12'
      ],
      [
        'E26',
        'subclass',
        'E13'
      ],
      [
        'E27',
        'subclass',
        'E13'
      ],
      [
        'E28',
        'subclass',
        'E14'
      ],
      [
        'E29',
        'subclass',
        'E15'
      ],
      [
        'E30',
        'subclass',
        'E15'
      ],
      [
        'E31',
        'subclass',
        'E16'
      ],
      [
        'E32',
        'subclass',
        'E16'
      ],
      [
        'E33',
        'subclass',
        'E16'
      ],
      [
        'E34',
        'subclass',
        'E17'
      ],
      [
        'E35',
        'subclass',
        'E18'
      ],
      [
        'E36',
        'subclass',
        'E18'
      ],
      [
        'E37',
        'subclass',
        'E19'
      ],
      [
        'E38',
        'subclass',
        'E19'
      ],
      [
        'E39',
        'subclass',
        'E19'
      ],
      [
        'E40',
        'subclass',
        'E19'
      ],
      [
        'E40',
        'subclass',
        'E19'
      ]
    ]

    expect(createHierarchy(leftDataset, rightDataset)).toEqual(output)
  })
})

describe('Copy node', () => {
  test('copy node', () => {
    const node = new Node('Q35120', [], [], 'Q35120', 0, undefined, undefined)

    expect(copyNode(node)).toEqual(node)
  })
})

describe('Set node as leaf', () => {
  test('node leaf', () => {
    const node = new Node('Q35120', [], [], 'Q35120', 0, undefined, undefined)
    const leaf = setNodeAsLeaf(node)

    expect(setNodeAsLeaf(node)).toEqual(leaf)
  })
})

describe('Reset nodes', () => {
  test('it doesn\'t contains', () => {
    const hierarchy: any = [
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
      ]
    ]
    const labels: Labels = {
      E1: 'a',
      E2: 'b',
      E3: 'c',
      E4: 'd',
      E5: 'e',
      E6: 'f',
      E7: 'g',
      Q35120: 'Q35120'
    }
    const node1 = new Node('a', [], [], 'E1', 0, undefined, undefined)
    const node2 = new Node('b', [], [], 'E2', 0, undefined, undefined)
    const node3 = new Node('c', [], [], 'E3', 0, undefined, undefined)
    const node4 = new Node('d', [], [], 'E4', 0, undefined, undefined)
    const node5 = new Node('e', [], [], 'E5', 0, undefined, undefined)
    const node6 = new Node('f', [], [], 'E6', 0, undefined, undefined)
    const node7 = new Node('g', [], [], 'E7', 0, undefined, undefined)
    const node0 = new Node('Q35120', [], [], 'Q35120', 0, undefined, undefined)
    node1.children.push(node2)
    node2.parents.push(node1)

    node1.children.push(node3)
    node3.parents.push(node1)

    node2.children.push(node4)
    node4.parents.push(node2)

    node2.children.push(node5)
    node5.parents.push(node2)

    node2.children.push(node6)
    node6.parents.push(node2)

    node3.children.push(node7)
    node7.parents.push(node3)

    node0.children.push(node1)
    node1.parents.push(node0)

    node1.depth = 1
    node2.depth = 1
    node3.depth = 1
    node4.depth = 1
    node5.depth = 1
    node6.depth = 1
    node7.depth = 1
    node0.depth = 1

    const resetedNodes = [node0, node2, node1, node3, node4, node5, node6, node7]
    resetNodeDepths(resetedNodes)

    expect(resetedNodes).toEqual(initalizeNodes(hierarchy, labels))
  })
})

describe('Build tree', () => {
  test('test visit root', () => {
    const hierarchy: any = [
      [
        'E2',
        'subclass',
        'E1'
      ],
      [
        'E3',
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

    const node1 = new Node('a', [], Array<Node>(), 'E1', 1, undefined, undefined)
    const node2 = new Node('b', [], Array<Node>(), 'E2', 2, undefined, undefined)
    const node3 = new Node('c', [], Array<Node>(), 'E3', 3, undefined, undefined)
    const node0 = new Node('Q35120', [], Array<Node>(), 'Q35120', 0, undefined, undefined)
    node1.children.push(node2)
    node2.parents.push(node1)

    node1.children.push(node3)
    node3.parents.push(node1)

    node0.children.push(node1)
    node1.parents.push(node0)

    node0.depth = 0
    node1.depth = 1
    node2.depth = 2
    node3.depth = 2

    node1.children = []
    node1.value = 1
    node1.isLeaf = true

    node2.children = []
    node2.value = 1
    node2.isLeaf = true

    node3.children = []
    node3.value = 1
    node3.isLeaf = true

    const nodes = initalizeNodes(hierarchy, labels)
    const rootCopy = copyNode(node0)
    rootCopy.depth = 0
    let keyCounter = 0
    rootCopy.key = keyCounter
    keyCounter++
    const maxDepth = 1

    const children1 = copyNode(node1)
    children1.key = keyCounter
    keyCounter++
    rootCopy.children.push(children1)
    children1.depth = 1

    const children2 = copyNode(node2)
    children2.key = keyCounter
    keyCounter++
    children1.children.push(children2)
    children2.depth = 2
    setNodeAsLeaf(children2)

    const children3 = copyNode(node3)
    children3.key = keyCounter
    keyCounter++
    children1.children.push(children3)
    children3.depth = 2
    setNodeAsLeaf(children3)

    expect(visitChildren(rootCopy, maxDepth, 2, keyCounter, nodes).root).toEqual(rootCopy)
  })
})

describe('Build tree', () => {
  test('test visit maxDepth', () => {
    const hierarchy: any = [
      [
        'E2',
        'subclass',
        'E1'
      ],
      [
        'E3',
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

    const node1 = new Node('a', [], Array<Node>(), 'E1', 1, undefined, undefined)
    const node2 = new Node('b', [], Array<Node>(), 'E2', 2, undefined, undefined)
    const node3 = new Node('c', [], Array<Node>(), 'E3', 3, undefined, undefined)
    const node0 = new Node('Q35120', [], Array<Node>(), 'Q35120', 0, undefined, undefined)
    node1.children.push(node2)
    node2.parents.push(node1)

    node1.children.push(node3)
    node3.parents.push(node1)

    node0.children.push(node1)
    node1.parents.push(node0)

    node0.depth = 0
    node1.depth = 1
    node2.depth = 2
    node3.depth = 2

    node1.children = []
    node1.value = 1
    node1.isLeaf = true

    node2.children = []
    node2.value = 1
    node2.isLeaf = true

    node3.children = []
    node3.value = 1
    node3.isLeaf = true

    const nodes = initalizeNodes(hierarchy, labels)
    const rootCopy = copyNode(node0)
    rootCopy.depth = 0
    let keyCounter = 0
    rootCopy.key = keyCounter
    keyCounter++
    const maxDepth = 1

    const children1 = copyNode(node1)
    children1.key = keyCounter
    keyCounter++
    rootCopy.children.push(children1)
    children1.depth = 1

    const children2 = copyNode(node2)
    children2.key = keyCounter
    keyCounter++
    children1.children.push(children2)
    children2.depth = 2
    setNodeAsLeaf(children2)

    const children3 = copyNode(node3)
    children3.key = keyCounter
    keyCounter++
    children1.children.push(children3)
    children3.depth = 2
    setNodeAsLeaf(children3)

    expect(visitChildren(rootCopy, maxDepth, 4, keyCounter, nodes).maxDepth).toEqual(2)
  })
})

describe('Creating tree', () => {
  test('test root', () => {
    const hierarchy: any = [
      [
        'E2',
        'subclass',
        'E1'
      ],
      [
        'E3',
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

    const node1 = new Node('a', [], Array<Node>(), 'E1', 0, undefined, undefined)
    const node2 = new Node('b', [], Array<Node>(), 'E2', 0, undefined, undefined)
    const node3 = new Node('c', [], Array<Node>(), 'E3', 0, undefined, undefined)
    const node0 = new Node('Q35120', [], Array<Node>(), 'Q35120', 0, undefined, undefined)
    node1.children.push(node2)
    node2.parents.push(node1)

    node1.children.push(node3)
    node3.parents.push(node1)

    node0.children.push(node1)
    node1.parents.push(node0)

    node0.depth = 0
    node1.depth = 1
    node2.depth = 2
    node3.depth = 2

    const nodes = initalizeNodes(hierarchy, labels)
    const rootCopy = copyNode(node0)
    rootCopy.depth = 0
    let keyCounter = 0
    rootCopy.key = keyCounter
    keyCounter++
    const maxDepth = 1

    const children1 = copyNode(node1)
    children1.key = keyCounter
    keyCounter++
    rootCopy.children.push(children1)
    children1.depth = 1

    const children2 = copyNode(node2)
    children2.key = keyCounter
    keyCounter++
    children1.children.push(children2)
    children2.depth = 2
    setNodeAsLeaf(children2)

    const children3 = copyNode(node3)
    children3.key = keyCounter
    keyCounter++
    children1.children.push(children3)
    children3.depth = 2
    setNodeAsLeaf(children3)

    expect(createTree('Q35120', nodes, 2).root).toEqual(rootCopy)
  })
})

describe('Append node', () => {
  test('append node', () => {
    const hierarchy: any = [
      [
        'E2',
        'subclass',
        'E1'
      ],
      [
        'E3',
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

    const root1 = new Node('a', [], Array<Node>(), 'E1', 0, undefined, undefined)
    const root0 = new Node('Q35120', [], Array<Node>(), 'Q35120', 0, undefined, undefined)

    root1.children.push(root0)
    root0.parents.push(root1)

    root0.depth = 0
    root1.depth = 1

    const nodes = initalizeNodes(hierarchy, labels)
    const root = copyNode(root0)
    root.depth = 0
    let keyCounter = 0
    root.key = keyCounter
    keyCounter++

    const children = copyNode(root1)
    children.key = keyCounter
    keyCounter++
    root.children.push(children)
    children.depth = 1
    setNodeAsLeaf(children)

    const node1 = new Node('a', [], Array<Node>(), 'E1', 0, undefined, undefined)
    const node2 = new Node('b', [], Array<Node>(), 'E2', 0, undefined, undefined)
    const node3 = new Node('c', [], Array<Node>(), 'E3', 0, undefined, undefined)
    const node0 = new Node('Q35120', [], Array<Node>(), 'Q35120', 0, undefined, undefined)
    node1.children.push(node2)
    node2.parents.push(node1)

    node1.children.push(node3)
    node3.parents.push(node1)

    node0.children.push(node1)
    node1.parents.push(node0)

    // node0.depth = 0
    // node1.depth = 1
    node2.depth = 2
    node3.depth = 2

    const rootCopy = copyNode(node0)
    rootCopy.depth = 0
    keyCounter = 0
    rootCopy.key = keyCounter
    keyCounter++
    const maxDepth = 1

    const children1 = copyNode(node1)
    children1.parents = Array<Node>()
    children1.key = keyCounter
    keyCounter++
    rootCopy.children.push(children1)
    children1.depth = 1

    const children2 = copyNode(node2)
    children2.key = keyCounter
    keyCounter++
    children1.children.push(children2)
    children2.depth = 2
    setNodeAsLeaf(children2)

    const children3 = copyNode(node3)
    children3.key = keyCounter
    keyCounter++
    children1.children.push(children3)
    children3.depth = 2
    setNodeAsLeaf(children3)

    expect(appendNode(children, nodes, 1, 1).root).toEqual(children1)
  })
})

describe('Creating tree', () => {
  test('test root', () => {
    const hierarchy: any = [
      [
        'E2',
        'subclass',
        'E1'
      ],
      [
        'E3',
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

    const node1 = new Node('a', [], Array<Node>(), 'E1', 0, undefined, undefined)
    const node2 = new Node('b', [], Array<Node>(), 'E2', 0, undefined, undefined)
    const node3 = new Node('c', [], Array<Node>(), 'E3', 0, undefined, undefined)
    const node0 = new Node('Q35120', [], Array<Node>(), 'Q35120', 0, undefined, undefined)
    node1.children.push(node2)
    node2.parents.push(node1)

    node1.children.push(node3)
    node3.parents.push(node1)

    node0.children.push(node1)
    node1.parents.push(node0)

    node0.depth = 0
    node1.depth = 1
    node2.depth = 2
    node3.depth = 2

    const nodes = initalizeNodes(hierarchy, labels)
    const rootCopy = copyNode(node0)
    rootCopy.depth = 0
    let keyCounter = 0
    rootCopy.key = keyCounter
    keyCounter++
    const maxDepth = 1

    const children1 = copyNode(node1)
    children1.key = keyCounter
    keyCounter++
    rootCopy.children.push(children1)
    children1.depth = 1

    const children2 = copyNode(node2)
    children2.key = keyCounter
    keyCounter++
    children1.children.push(children2)
    children2.depth = 2
    setNodeAsLeaf(children2)

    const children3 = copyNode(node3)
    children3.key = keyCounter
    keyCounter++
    children1.children.push(children3)
    children3.depth = 2
    setNodeAsLeaf(children3)

    expect(createTree('Q35120', nodes, 2).root).toEqual(rootCopy)
  })
})

describe('Finding predeccesors', () => {
  test('test root', () => {
    const hierarchy: any = [
      [
        'E2',
        'subclass',
        'E1'
      ],
      [
        'E3',
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

    const newNode: MappingNode = {
      id: 0,
      name: 'c',
      mapBy: 'example',
      nodeID: 'E3'
    }

    const newArrow: ArrowData = {
      id: 'E1',
      label: 'c',
      word: 'example'
    }

    const nodes = initalizeNodes(hierarchy, labels)
    const tree = createTree('Q35120', nodes, 1).root
    const child = tree.children[0]

    expect(findNodePredecesorsInActualView(child, newNode)).toEqual([newArrow])
  })
})

describe('Finding predeccesors', () => {
  test('test root', () => {
    const hierarchy: any = [
      [
        'E2',
        'subclass',
        'E1'
      ],
      [
        'E3',
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

    const newNode1: MappingNode = {
      id: 0,
      name: 'c',
      mapBy: 'example1',
      nodeID: 'E3'
    }

    const newNode2: MappingNode = {
      id: 0,
      name: 'b',
      mapBy: 'example2',
      nodeID: 'E2'
    }

    const newArrow1: ArrowData = {
      id: 'E1',
      label: 'c',
      word: 'example1'
    }

    const newArrow2: ArrowData = {
      id: 'E1',
      label: 'b',
      word: 'example2'
    }

    const nodes = initalizeNodes(hierarchy, labels)
    const tree = createTree('Q35120', nodes, 1).root
    const child = tree.children[0]

    expect(mapUrlsToActiveView([newNode1, newNode2], nodes)).toEqual([newArrow1, newArrow2])
  })
})

describe('Hierarchy to array', () => {
  test('test root', () => {
    const hierarchy: any = [
      [
        'E2',
        'subclass',
        'E1'
      ],
      [
        'E3',
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

    const node1 = new Node('a', [], Array<Node>(), 'E1', 0, undefined, undefined)
    const node2 = new Node('b', [], Array<Node>(), 'E2', 0, undefined, undefined)
    const node3 = new Node('c', [], Array<Node>(), 'E3', 0, undefined, undefined)
    const node0 = new Node('Q35120', [], Array<Node>(), 'Q35120', 0, undefined, undefined)
    node1.children.push(node2)
    node2.parents.push(node1)

    node1.children.push(node3)
    node3.parents.push(node1)

    node0.children.push(node1)
    node1.parents.push(node0)

    node0.depth = 0
    node1.depth = 1
    node2.depth = 2
    node3.depth = 2

    const nodes = initalizeNodes(hierarchy, labels)
    const rootCopy = copyNode(node0)
    rootCopy.depth = 0
    let keyCounter = 0
    rootCopy.key = keyCounter
    keyCounter++
    const maxDepth = 4

    const children1 = copyNode(node1)
    children1.key = keyCounter
    keyCounter++
    rootCopy.children.push(children1)
    children1.depth = 1

    const children2 = copyNode(node2)
    children2.key = keyCounter
    keyCounter++
    children1.children.push(children2)
    children2.depth = 2
    setNodeAsLeaf(children2)

    const children3 = copyNode(node3)
    children3.key = keyCounter
    keyCounter++
    children1.children.push(children3)
    children3.depth = 2
    setNodeAsLeaf(children3)

    const root = createTree('Q35120', nodes, 2).root
    expect(createArrayFromHierarchy(root)).toEqual([rootCopy, children1, children2, children3])
  })
})

describe('Reset nodes', () => {
  test('it doesn\'t contains', () => {
    const hierarchy: any = [
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
    const labels: Labels = {
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
    const node1 = new Node('a', [], [], 'E1', 0, undefined, undefined)
    const node2 = new Node('b', [], [], 'E2', 0, undefined, undefined)
    const node3 = new Node('c', [], [], 'E3', 0, undefined, undefined)
    const node4 = new Node('d', [], [], 'E4', 0, undefined, undefined)
    const node5 = new Node('e', [], [], 'E5', 0, undefined, undefined)
    const node6 = new Node('f', [], [], 'E6', 0, undefined, undefined)
    const node7 = new Node('g', [], [], 'E7', 0, undefined, undefined)
    const node8 = new Node('h', [], [], 'E8', 0, undefined, undefined)
    const node9 = new Node('i', [], [], 'E9', 0, undefined, undefined)
    const node0 = new Node('Q35120', [], [], 'Q35120', 0, undefined, undefined)
    node1.children.push(node2)
    node2.parents.push(node1)

    node1.children.push(node3)
    node3.parents.push(node1)

    node1.children.push(node8)
    node8.parents.push(node1)

    node8.children.push(node9)
    node9.parents.push(node8)

    node2.children.push(node4)
    node4.parents.push(node2)

    node2.children.push(node5)
    node5.parents.push(node2)

    node2.children.push(node6)
    node6.parents.push(node2)

    node3.children.push(node7)
    node7.parents.push(node3)

    node0.children.push(node1)
    node1.parents.push(node0)

    node1.depth = 0
    node2.depth = 1
    node3.depth = 1
    node8.depth = 1
    node4.depth = 2
    node5.depth = 2
    node6.depth = 2
    node7.depth = 2
    node9.depth = 2

    const nodes = initalizeNodes(hierarchy, labels)
    const rootCopy = copyNode(node0)
    rootCopy.depth = 0
    let keyCounter = 0
    const maxDepth = 1

    const children1 = copyNode(node1)
    children1.key = keyCounter
    keyCounter++
    rootCopy.children.push(children1)
    children1.depth = 0

    const children2 = copyNode(node2)
    children2.key = keyCounter
    keyCounter++
    children1.children.push(children2)
    children2.depth = 1

    const children3 = copyNode(node3)
    children3.key = keyCounter
    keyCounter++
    children1.children.push(children3)
    children3.depth = 1

    const children8 = copyNode(node8)
    children8.key = keyCounter
    keyCounter++
    children1.children.push(children8)
    children8.depth = 1

    const children4 = copyNode(node4)
    children4.key = keyCounter
    keyCounter++
    children2.children.push(children4)
    children4.depth = 2
    setNodeAsLeaf(children4)

    const children5 = copyNode(node5)
    children5.key = keyCounter
    keyCounter++
    children2.children.push(children5)
    children5.depth = 2
    setNodeAsLeaf(children5)

    const children6 = copyNode(node6)
    children6.key = keyCounter
    keyCounter++
    children2.children.push(children6)
    children6.depth = 2
    setNodeAsLeaf(children6)

    const children7 = copyNode(node7)
    children7.key = keyCounter
    keyCounter++
    children3.children.push(children7)
    children7.depth = 2
    setNodeAsLeaf(children7)

    const children9 = copyNode(node9)
    children9.key = keyCounter
    keyCounter++
    children8.children.push(children9)
    children9.depth = 2
    setNodeAsLeaf(children9)

    let tree = createTree('E1', nodes, 2).root

    tree = collapseIrrelevantSubtrees(tree, ['E1', 'E2', 'E4', 'E3', 'E7'])
    setNodeAsLeaf(children1.children[2])

    expect(tree).toEqual(children1)
  })
})

describe('Get circle', () => {
  test('it contains', () => {
    const circle1: Circle = new Circle('E1', 'a', false, 2, 20, 20, 10, 0)
    const circle2: Circle = new Circle('E2', 'b', false, 2, 40, 40, 10, 0)
    expect(getCircleById([circle1, circle2], 'E1')).toEqual(circle1)
  })
})

describe('Pack arrows', () => {
  test('packed', () => {
    const circle1: Circle = new Circle('E1', 'a', false, 2, 20, 20, 10, 0)
    const circle2: Circle = new Circle('E2', 'b', false, 2, 40, 40, 10, 0)

    const arrowData1: ArrowData = new ArrowData('E1', 'a')
    const arrowData2: ArrowData = new ArrowData('E2', 'b')
    arrowData1.word = 'foo'
    arrowData2.word = 'bar'

    const arrow1: Arrow = new Arrow(0, 0, 500, 10, 20, 10, 'foo', 'a')
    const arrow2: Arrow = new Arrow(1, 0, 500, 30, 40, 10, 'bar', 'b')

    expect(packMappingArrows(1000, 1000, [circle1, circle2], [arrowData1, arrowData2], Position.Left)).toEqual([arrow1, arrow2])
  })
})

describe('Mappings intersection', () => {
  test('test', () => {
    const arrowData1: ArrowData = new ArrowData('E1', 'a')
    const arrowData2: ArrowData = new ArrowData('E2', 'b')
    const arrowData3: ArrowData = new ArrowData('E3', 'c')
    const arrowData4: ArrowData = new ArrowData('E4', 'd')

    expect(mappingsIntersection([arrowData1, arrowData2, arrowData3], [arrowData1, arrowData4])).toEqual([arrowData1])
  })
})

describe('Highlight tree mapping', () => {
  test('test', () => {
    const circle1: Circle = new Circle('E1', 'a', false, 2, 20, 20, 10, 0)
    const circle2: Circle = new Circle('E2', 'b', false, 2, 40, 40, 10, 0)
    const circle3: Circle = new Circle('E3', 'c', false, 2, 60, 60, 10, 0)
    const circle4: Circle = new Circle('E4', 'd', false, 2, 80, 80, 10, 0)
    const circles = [circle1, circle2, circle3, circle4]

    const arrowData1: ArrowData = new ArrowData('E1', 'a')
    const arrowData2: ArrowData = new ArrowData('E2', 'b')
    const arrowData3: ArrowData = new ArrowData('E3', 'c')
    const arrowsLeft = [arrowData1, arrowData2]
    const arrowsRight = [arrowData1, arrowData3]

    const circle5: Circle = new Circle('E1', 'a', false, 2, 20, 20, 10, 0)
    const circle6: Circle = new Circle('E2', 'b', false, 2, 40, 40, 10, 0)
    const circle7: Circle = new Circle('E3', 'c', false, 2, 60, 60, 10, 0)
    const circle8: Circle = new Circle('E4', 'd', false, 2, 80, 80, 10, 0)
    circle5.fill = 'blue'
    circle5.strokewidth = '7'
    circle5.stroke = 'red'

    circle6.fill = 'red'
    circle7.fill = 'blue'
    const result = [circle5, circle6, circle7, circle8]

    expect(highlightTreeMapping(circles, arrowsLeft, arrowsRight)).toEqual(result)
  })
})

describe('Create mapping node with children', () => {
  test('test', () => {
    const children: MappingNode = {
      id: 1,
      name: 'c',
      mapBy: 'example2',
      nodeID: 'E3'
    }

    const parent: MappingNode = {
      id: 0,
      name: 'a',
      children: [children]
    }

    expect(createMappingNodeWithChildren(0, 'a', [children])).toEqual(parent)
  })
})

describe('Create mapping node with map', () => {
  test('test', () => {
    const children: MappingNode = {
      id: 0,
      name: 'a',
      mapBy: 'example2',
      nodeID: 'E3'
    }

    expect(createMappingNodeWithMap(0, 'a', 'example2', 'E3')).toEqual(children)
  })
})

const testDataset = {
  metadata: {},
  mappings: [
    {
      '@id': 'v1',
      metadata: {
        from: 'title',
        title: 'Wikidata v1',
        input: [
          [
            'aa',
            'ab',
            'ac'
          ]
        ]
      },
      data: [
        {
          '@id': 'M1',
          id: 'E21',
          metadata: {
            shared: 1,
            size: 1,
            group: [
              'aa'
            ]
          }
        },
        {
          '@id': 'M2',
          id: 'E28',
          metadata: {
            shared: 1,
            size: 1,
            group: [
              'aa'
            ]
          }
        },
        {
          '@id': 'M3',
          id: 'E23',
          metadata: {
            shared: 1,
            size: 1,
            group: [
              'ab'
            ]
          }
        },
        {
          '@id': 'M4',
          id: 'E10',
          metadata: {
            shared: 1,
            size: 1,
            group: [
              'ac'
            ]
          }
        }
      ]
    },
    {
      '@id': 'v2',
      metadata: {
        from: 'title',
        title: 'Wikidata v2',
        input: [
          [
            'ba',
            'bb',
            'bc',
            'bd'
          ]
        ]
      },
      data: [
        {
          '@id': 'M5',
          id: 'E38',
          metadata: {
            shared: 1,
            size: 1,
            group: [
              'ba'
            ]
          }
        },
        {
          '@id': 'M6',
          id: 'E33',
          metadata: {
            shared: 1,
            size: 1,
            group: [
              'ba'
            ]
          }
        },
        {
          '@id': 'M7',
          id: 'E28',
          metadata: {
            shared: 1,
            size: 1,
            group: [
              'bb'
            ]
          }
        },
        {
          '@id': 'M8',
          id: 'E23',
          metadata: {
            shared: 1,
            size: 1,
            group: [
              'bc'
            ]
          }
        },
        {
          '@id': 'M9',
          id: '23',
          metadata: {
            shared: 1,
            size: 1,
            group: [
              'bd'
            ]
          }
        }
      ]
    }
  ],
  hierarchy: [
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
      'E3',
      'subclass',
      'E1'
    ],
    [
      'E3',
      'subclass',
      'E1'
    ],
    [
      'E4',
      'subclass',
      'E2'
    ],
    [
      'E2',
      'subclass',
      'E10'
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
      'E8',
      'subclass',
      'E3'
    ],
    [
      'E9',
      'subclass',
      'E3'
    ],
    [
      'E10',
      'subclass',
      'E4'
    ],
    [
      'E11',
      'subclass',
      'E4'
    ],
    [
      'E12',
      'subclass',
      'E4'
    ],
    [
      'E13',
      'subclass',
      'E5'
    ],
    [
      'E14',
      'subclass',
      'E5'
    ],
    [
      'E15',
      'subclass',
      'E6'
    ],
    [
      'E16',
      'subclass',
      'E7'
    ],
    [
      'E17',
      'subclass',
      'E7'
    ],
    [
      'E18',
      'subclass',
      'E8'
    ],
    [
      'E19',
      'subclass',
      'E9'
    ],
    [
      'E20',
      'subclass',
      'E10'
    ],
    [
      'E21',
      'subclass',
      'E10'
    ],
    [
      'E22',
      'subclass',
      'E11'
    ],
    [
      'E23',
      'subclass',
      'E12'
    ],
    [
      'E24',
      'subclass',
      'E12'
    ],
    [
      'E25',
      'subclass',
      'E12'
    ],
    [
      'E26',
      'subclass',
      'E13'
    ],
    [
      'E27',
      'subclass',
      'E13'
    ],
    [
      'E28',
      'subclass',
      'E14'
    ],
    [
      'E29',
      'subclass',
      'E15'
    ],
    [
      'E30',
      'subclass',
      'E15'
    ],
    [
      'E31',
      'subclass',
      'E16'
    ],
    [
      'E32',
      'subclass',
      'E16'
    ],
    [
      'E33',
      'subclass',
      'E16'
    ],
    [
      'E34',
      'subclass',
      'E17'
    ],
    [
      'E35',
      'subclass',
      'E18'
    ],
    [
      'E36',
      'subclass',
      'E18'
    ],
    [
      'E37',
      'subclass',
      'E19'
    ],
    [
      'E38',
      'subclass',
      'E19'
    ],
    [
      'E39',
      'subclass',
      'E19'
    ],
    [
      'E40',
      'subclass',
      'E19'
    ],
    [
      'E40',
      'subclass',
      'E19'
    ]
  ],
  labels: {
    E1: 'a',
    E2: 'b',
    E3: 'c',
    E4: 'd',
    E5: 'e',
    E6: 'f',
    E7: 'g',
    E8: 'h',
    E9: 'i',
    E10: 'j',
    E11: 'k',
    E12: 'l',
    E13: 'm',
    E14: 'n',
    E15: 'o',
    E16: 'p',
    E17: 'q',
    E18: 'r',
    E19: 's',
    E20: 't',
    E21: 'u',
    E22: 'v',
    E23: 'w',
    E24: 'x',
    E25: 'y',
    E26: 'z',
    E27: 'aa',
    E28: 'ab',
    E29: 'ac',
    E30: 'ad',
    E31: 'ae',
    E32: 'af',
    E33: 'ag',
    E34: 'ah',
    E35: 'ai',
    E36: 'aj',
    E37: 'ak',
    E38: 'al',
    E39: 'am',
    E40: 'an'
  }
}

describe('Create labels for path', () => {
  test('test', () => {
    const result: {[key: string]: string[]} = {}
    result.E10 = ['ac']
    result.E38 = ['ba']
    result.E33 = ['ba']
    result['23'] = ['bd']
    result.E21 = ['aa']
    result.E28 = ['aa', 'bb']
    result.E23 = ['ab', 'bc']

    expect(createPathLabels(testDataset)).toEqual(result)
  })
})

describe('Create mapping', () => {
  test('test', () => {
    const child1 = createMappingNodeWithMap(0, 'al', 'ba', 'E38')
    const child2 = createMappingNodeWithMap(1, 'ag', 'ba', 'E33')
    const child3 = createMappingNodeWithMap(3, 'ab', 'bb', 'E28')
    const child4 = createMappingNodeWithMap(5, 'w', 'bc', 'E23')
    const child5 = createMappingNodeWithMap(7, '23', 'bd', '23')

    const parent1 = createMappingNodeWithChildren(2, 'ba', [child1, child2])
    const parent2 = createMappingNodeWithChildren(4, 'bb', [child3])
    const parent3 = createMappingNodeWithChildren(6, 'bc', [child4])
    const parent4 = createMappingNodeWithChildren(8, 'bd', [child5])
    const result = [parent1, parent2, parent3, parent4]
    expect(createMapping(testDataset.labels, testDataset, 1)).toEqual(result)
  })
})

describe('Create mapping', () => {
  test('test', () => {
    const mapping = createMapping(testDataset.labels, testDataset, 1)
    expect(chooseItemFromMapping(mapping, 'E33')).toEqual([1])
  })
})

describe('Create mapping', () => {
  test('test', () => {
    const mapping = createMapping(testDataset.labels, testDataset, 1)
    expect(chooseItemFromMapping(mapping, 'E33')).toEqual([1])
  })
})
