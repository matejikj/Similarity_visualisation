// Import `shallowMount` from Vue Test Utils and the component being tested
import { shallowMount, createLocalVue } from '@vue/test-utils'
import TreeNode from '../../src/visualisation/TreeVisualisation/TreeNode.vue'
import Vue from 'vue'
import VueTippy from 'vue-tippy'
import Vuex from 'vuex'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(VueTippy)

// Mount the component
const wrapper = shallowMount(TreeNode, {
  propsData: {
    nodeData: {
      id: 'Q1',
      key: 1,
      fill: 'red',
      pathNr: 1,
      strokewidth: 1,
      stroke: 'blue',
      label: 'a',
      isLeaf: true,
      depth: 1,
      x: 10,
      y: 10,
      r: 5
    }
  }
})

// Here are some Jest tests, though you can
// use any test runner/assertion library combo you prefer
describe('TreeNode.vue', () => {
  it('sets the correct default data', () => {
    console.log(wrapper.html())
  })
})
