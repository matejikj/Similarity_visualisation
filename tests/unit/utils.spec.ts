import { createVisitedNode, prepareLabels, mapLinks, getNodeLabel } from '@/utils/nodesUtils'
import { Labels } from '@/models'

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
