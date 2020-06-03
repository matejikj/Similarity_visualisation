import { createVisitedNode } from '@/utils/nodesUtils'

describe('Create visited node', () => {
  test('it should create node', () => {
    const id = 'id'
    const label = 'label'

    const output = { id: 'id', label: 'label' }

    expect(createVisitedNode(id, label)).toEqual(output)
  })
})
