import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import storeVisualisation, { Mutations, Getters } from '../../src/visualisation/Visualisation.store'
import { cloneDeep } from 'lodash'

test('increments count value when increment is commited', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  const store = new Vuex.Store(cloneDeep(storeVisualisation))
  expect(store.getters[Getters.GET_DEPTH]).toBe(1)
  store.commit(Mutations.CHANGE_DEPTH, 2)
  expect(store.getters[Getters.GET_DEPTH]).toBe(2)
})

// describe('store/data/ADD_NODE', () => {
//   it('adds one node', () => {
//     let node = { name: 'test' }
//     const state = { nodes: [] }

//     mutations.ADD_NODE(state, node)

//     expect(state).toEqual({ nodes: [{ id: 0, name: 'test' }] })
//   })
// })

// describe('HelloWorld.vue', () => {
//   it('renders props.msg when passed', () => {
//     const msg = 'new message'
//     const wrapper = shallowMount(HelloWorld, {
//       propsData: { msg }
//     })
//     expect(wrapper.text()).toMatch(msg)
//   })
// })

// const state = {
//   leftMappingList: Array<ComboboxItem>,
//   leftMapping: Array<MappingNode>,
//   rightMappingList: Array<ComboboxItem>,
//   rightMapping: Array<MappingNode>,
//   nodes: Array<Node>,
//   activePath: undefined,
//   pathNodes: Array<Node>,
//   circles: Array<Circle>,
//   leftArrows: Array<Arrow>,
//   rightArrows: Array<Arrow>,
//   rootId: string,
//   hierarchy: Array<[string, string, string]>,
//   circleHierarchy: Node,
//   treeHierarchy: Node,
//   treeNodes: Array<Circle>,
//   treeLinks: Array<Arrow>,
//   treeHeight: 1,
//   visitedNodes: Array<VisitedNode>,
//   depth: 1,
//   maxDepth: number,
//   window: {
//     width: number,
//     height: number
//   },
//   error: Error
// }
