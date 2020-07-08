import { createVisitedNode, prepareLabels, mapLinks, getNodeLabel, createNode, containsNode, getNodeById, getUniqueNodes, getNodeByKey, createNodesWithRelationships, initalizeNodes } from '@/utils/nodesUtils'
import { Labels, Node, Link } from '@/models'
import { createHierarchy, copyNode, resetNodeDepths, setNodeAsLeaf, visitChildren } from '@/utils/hierarchyUtils'

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
