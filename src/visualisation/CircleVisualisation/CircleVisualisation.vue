<template>
  <svg id="svg" ref="svg" width="100%" height="50vh">
    <defs>
      <!-- arrowhead marker definition -->
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
          markerWidth="6" markerHeight="6"
          orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g>
      <template v-for="(c, index) in circles">
        <circle-node @nodeClicked='circleClicked' v-bind:key="index" v-bind:nodeData="c"></circle-node>
      </template>
    </g>
    <g>
      <template v-for="(c, index) in circles">
        <circle-label @labelClicked='circleClicked' v-bind:key="index" v-bind:labelData="c"></circle-label>
      </template>
    </g>
    <g>
      <template v-for="(c, index) in leftArrows">
        <circle-link v-bind:key="index" v-bind:linkData="c"></circle-link>
      </template>
    </g>
    <g>
      <template v-for="(c, index) in rightArrows">
        <circle-link v-bind:key="index" v-bind:linkData="c"></circle-link>
      </template>
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'
import * as d3 from 'd3'
import CircleNode from './CircleNode.vue'
import CircleLabel from './CircleLabel.vue'
import CircleLink from './CircleLink.vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { ROOT_ID, ROOT_LABEL, Position } from '../../models'
import { Getters, Actions, Mutations, STORE_NAME } from '../Visualisation.store'
import { createNodes, createLabel } from '../../utils/nodesUtils'

export default Vue.extend({
  name: 'CircleVisualisation',
  components: {
    CircleNode,
    CircleLabel,
    CircleLink
  },
  props: ['rightDataset', 'leftDataset'],
  data: () => ({
    left: Position.Left,
    right: Position.Right
  }),
  computed: {
    ...mapGetters(STORE_NAME, {
      circles: Getters.GET_CIRCLES,
      leftArrows: Getters.GET_LEFT_ARROWS,
      rightArrows: Getters.GET_RIGHT_ARROWS,
      labels: Getters.GET_LABELS,
      hierarchy: Getters.GET_HIERARCHY
    })
  },
  created () {
    window.addEventListener('resize', this.handleResize)
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  mounted () {
    this.resizeCanvas({
      // @ts-ignore
      height: this.$refs.svg.clientHeight,
      // @ts-ignore
      width: this.$refs.svg.clientWidth
    })

    this.updateVisualisation()

    const g = d3.selectAll('g')

    /* eslint-disable no-undef */
    // @ts-ignore
    d3.select('#svg')
      .call(d3.zoom().on('zoom', function () {
        g.attr('transform', d3.event.transform)
      }))
    /* eslint-enable no-undef */
  },
  watch: {
    rightDataset () {
      this.initializeNodes()
      this.updateVisualisation()
    },
    leftDataset () {
      this.initializeNodes()
      this.updateVisualisation()
    }
  },
  methods: {
    ...mapActions(STORE_NAME, {
      updateCircleCanvas: Actions.UPDATE_CIRCLE_CANVAS,
      resizeCanvas: Actions.RESIZE_CANVAS,
      createHierarchyForCircles: Actions.CREATE_HIERARCHY_FOR_CIRCLES,
      initPathNodes: Actions.INIT_PATH_NODES,
      addNodeToVisitedNodes: Actions.ADD_NODE_TO_VISITED_NODES
    }),
    ...mapMutations(STORE_NAME, {
      changeRootId: Mutations.CHANGE_ROOT_ID,
      changeActivePath: Mutations.CHANGE_ACTIVE_PATH,
      changeNodes: Mutations.CHANGE_NODES,
      changeVisitedNodes: Mutations.CHANGE_VISITED_NODES,
      changeLeftMappingList: Mutations.CHANGE_LEFT_MAPPING_LIST,
      changeRightMappingList: Mutations.CHANGE_RIGHT_MAPPING_LIST,
      changeLeftMapping: Mutations.CHANGE_LEFT_MAPPING,
      changeRightMapping: Mutations.CHANGE_RIGHT_MAPPING
    }),
    updateVisualisation: function () {
      this.createHierarchyForCircles()
      this.updateCircleCanvas()
    },
    handleResize () {
      this.resizeCanvas({
        // @ts-ignore
        height: this.$refs.svg.clientHeight,
        // @ts-ignore
        width: this.$refs.svg.clientWidth
      })
      this.updateCircleCanvas()
    },
    initializeNodes: function () {
      this.changeRootId(ROOT_ID)
      this.changeActivePath(undefined)
      this.changeNodes(createNodes(this.hierarchy, this.labels))
      this.changeVisitedNodes([createLabel(ROOT_ID, ROOT_LABEL)])
      this.initPathNodes()
    },
    circleClicked: function (leaf) {
      const labels = this.labels
      this.addNodeToVisitedNodes({ labels, leaf })
      this.createHierarchyForCircles()
      this.updateCircleCanvas()
    }
  }
})
</script>

<style>
.circle {
  cursor: pointer;
  text-decoration: underline;
}
.labels {
  cursor: pointer;
  text-anchor: middle;
  pointer-events: none;
}
</style>
