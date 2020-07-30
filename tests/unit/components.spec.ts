// Import `shallowMount` from Vue Test Utils and the component being tested
import { shallowMount, createLocalVue } from '@vue/test-utils'
import TreeNode from '../../src/visualisation/TreeVisualisation/TreeNode.vue'
import TreeLink from '../../src/visualisation/TreeVisualisation/TreeLink.vue'
import TreeLabel from '../../src/visualisation/TreeVisualisation/TreeLabel.vue'
import CircleLabel from '../../src/visualisation/CircleVisualisation/CircleLabel.vue'
import CircleNode from '../../src/visualisation/CircleVisualisation/CircleNode.vue'
import CircleLink from '../../src/visualisation/CircleVisualisation/CircleLink.vue'
import Vue from 'vue'
import VueTippy from 'vue-tippy'
import Vuex from 'vuex'
import * as d3 from 'd3'

Vue.use(Vuex)
Vue.use(VueTippy)

it('Tree node', () => {
  const nodeWrapper = shallowMount(TreeNode, {
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

  expect(nodeWrapper.html()).toEqual('<circle content="\n\
      label: a</br>\n\
      id: Q1\n\
    " id="Q1" r="5" cx="10" cy="10" fill="red" stroke="blue" stroke-width="1" class="circle"></circle>')
})

it('tree link', () => {
  const linkWrapper = shallowMount(TreeLink, {
    propsData: {
      linkData: { id: 0, r: 10, lx: 10, ly: 10, rx: 20, ry: 20 }
    },
    computed: {
      pathText () {
        return d3.linkVertical()({
          // @ts-ignore
          source: [10, 10],
          target: [20, 20]
        })
      }
    }
  })
  expect(linkWrapper.html()).toEqual('<path id="0" d="M10,10C10,15,20,15,20,20" stroke="black" fill="none" class="link"></path>')
})

it('tree label', () => {
  const labelWrapper = shallowMount(TreeLabel, {
    propsData: {
      labelData: {
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

  expect(labelWrapper.html()).toEqual('<text fill="black" x="10" y="-14" dy=".35em" class="tree-labels">a\n\
</text>')
})

it('circle node', () => {
  const nodeWrapper = shallowMount(CircleNode, {
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

  expect(nodeWrapper.html()).toEqual('<circle content="\n\
      label: a</br>\n\
      id: Q1\n\
    " id="Q1" r="5" cx="10" cy="10" fill="red" stroke="blue" class="circle"></circle>')
})

it('circle link', () => {
  const linkWrapper = shallowMount(CircleLink, {
    propsData: {
      linkData: { id: 0, word: 'a', mapTo: 'E1', lx: 10, ly: 10, rx: 20, ry: 20, r: 5 }
    }
  })
  expect(linkWrapper.html()).toEqual('<line content="\n\
      map by: a</br>\n\
      map to: E1</br>\n\
      " id="0" x1="10" y1="10" x2="20" y2="20" stroke="black" stroke-width="1" marker-end="url(#arrow)" class="link"></line>')
})

it('circle label', () => {
  const labelWrapper = shallowMount(CircleLabel, {
    propsData: {
      labelData: {
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
        r: 6
      }
    }
  })

  expect(labelWrapper.html()).toEqual('<text fill="white" x="10" font-size="3" y="10" dy=".35em" class="circle-labels">\n\
  <!---->\n\
  <!---->\n\
  <!---->\n\
  <!---->\n\
  <!---->\n\
  <!---->\n\
  <!---->\n\
  <tspan x="10" dy="0.3em">a</tspan>\n\
</text>')
})
