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
          <circle-node @nodeClicked='zoomCircle' v-bind:key="index" v-bind:nodeData="c"></circle-node>
        </template>
      </g>
      <g>
        <template v-for="(c, index) in circles">
          <circle-label @labelClicked='zoomCircle' v-bind:key="index" v-bind:labelData="c"></circle-label>
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
import CircleNode from './CircleNode.vue'
import CircleLabel from './CircleLabel.vue'
import CircleLink from './CircleLink.vue'
import { mapGetters, mapActions } from 'vuex'
import { Circle } from '@/models'
import { Getters, Actions } from '@/visualisation/Visualisation.store'

export default Vue.extend({
  name: 'CircleCanvas',
  components: {
    CircleNode,
    CircleLabel,
    CircleLink
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters('visualisation', {
      circles: Getters.GET_CIRCLES,
      leftArrows: Getters.GET_LEFT_ARROWS,
      rightArrows: Getters.GET_RIGHT_ARROWS
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
  },
  methods: {
    ...mapActions('visualisation', {
      updateCircleCanvas: Actions.UPDATE_CIRCLE_CANVAS,
      resizeCanvas: Actions.RESIZE_CANVAS,
      addNodeToPath: Actions.ADD_NODE_TO_VISITED_NODES,
      createHierarchyForCircles: Actions.CREATE_HIERARCHY_FOR_CIRCLES
    }),
    handleResize () {
      this.resizeCanvas({
        // @ts-ignore
        height: this.$refs.svg.clientHeight,
        // @ts-ignore
        width: this.$refs.svg.clientWidth
      })
    },
    zoomCircle (e: Circle) {
      this.addNodeToPath(e)
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
