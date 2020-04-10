<template>
    <svg id="svg" ref="svg" width="100%">
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
import store from '../../store'
import CircleNode from './CircleNode.vue'
import CircleLabel from './CircleLabel.vue'
import CircleLink from './CircleLink.vue'
import { packCircles, packArrows } from '../../utils/pack'
import { createTree, createLayer } from '@/utils/create'
import { Node } from '../../models/Node'
import { Position, Circle } from '../../models'

export default Vue.extend({
  name: 'CircleVisualisation',
  components: {
    CircleNode,
    CircleLabel,
    CircleLink
  },
  data: () => ({
    window: {
      width: 0,
      height: 0
    }
  }),
  computed: {
    circles () {
      return packCircles(this.window.height, this.window.width, store.getters.getHierarchy)
    },
    leftArrows () {
      return store.getters.getLeftMapping === undefined
        ? undefined
        : packArrows(this.window.height, this.window.width,
          packCircles(this.window.height, this.window.width, store.getters.getHierarchy),
          createLayer(store.getters.getLeftMapping), Position.Left
        )
    },
    rightArrows () {
      return store.getters.getRightMapping === undefined
        ? undefined
        : packArrows(this.window.height, this.window.width,
          packCircles(this.window.height, this.window.width, store.getters.getHierarchy),
          createLayer(store.getters.getRightMapping), Position.Right)
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
    this.window.height = this.$refs.svg.clientHeight
    // @ts-ignore
    this.window.width = this.$refs.svg.clientWidth
  },
  methods: {
    handleResize () {
      // @ts-ignore
      this.window.height = this.$refs.svg.clientHeight
      // @ts-ignore
      this.window.width = this.$refs.svg.clientWidth
    },
    zoomCircle () {
      const i = 1
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
