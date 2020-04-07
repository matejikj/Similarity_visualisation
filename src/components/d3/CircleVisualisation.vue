<template>
    <svg id="svg" ref="svg" width="100%" height="70vh">
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
          <circle-node @circleClicked='zoomCircle' v-bind:key="index" v-bind:nodeData="c"></circle-node>
        </template>
      </g>
      <g>
        <template v-for="(c, index) in circles">
          <circle-label @circleClicked='zoomCircle' v-bind:key="index" v-bind:labelData="c"></circle-label>
        </template>
      </g>
    </svg>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '../../store'
import CircleNode from './CircleNode.vue'
import CircleLabel from './CircleLabel.vue'
import { packCircles } from '../../utils/pack'
import { createTree } from '@/utils/create'
import { Node } from '../../models/Node'

export default Vue.extend({
  name: 'CircleVisualisation',
  components: {
    CircleNode,
    CircleLabel
  },
  data: () => ({
    width: 0,
    height: 0
  }),
  computed: {
    circles () {
      const nodes: Array<Node> = store.getters.getNodes
      if (nodes.length === 0) {
        return undefined
      }
      // @ts-ignore
      return packCircles(this.height, this.width, createTree(nodes, store.getters.getDepth))
    },
    leftArrows () {
      return undefined
    },
    rightArrows () {
      return undefined
    }
  },
  created () {
    window.addEventListener('resize', this.handleResize)
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  mounted () {
    // @ts-ignore
    this.height = this.$refs.svg.clientHeight
    // @ts-ignore
    this.width = this.$refs.svg.clientWidth
  },
  methods: {
    handleResize () {
      // @ts-ignore
      this.height = this.$refs.svg.clientHeight
      // @ts-ignore
      this.width = this.$refs.svg.clientWidth
    },
    zoomCircle () {
      const a = 1
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
