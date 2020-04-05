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
          <circle-node v-bind:key="index" v-bind:circleNode="c"></circle-node>
        </template>
        <template v-for="(c, index) in circles">
          <circle-label v-bind:key="index" v-bind:circleLabel="c"></circle-label>
        </template>
        <template v-for="(c, index) in leftArrows">
          <circle-link v-bind:key="index" v-bind:circleLink="c"></circle-link>
        </template>
        <template v-for="(c, index) in leftArrows">
          <circle-link v-bind:key="index" v-bind:circleLink="c"></circle-link>
        </template>
      </g>
    </svg>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '../../store'
import CircleNode from './CircleNode.vue'
import CircleLink from './CircleLink.vue'
import CircleLabel from './CircleLabel.vue'

export default Vue.extend({
  name: 'CircleVisualisation',
  components: {
    CircleNode,
    CircleLink,
    CircleLabel
  },
  data: () => ({
    window: {
      width: 0,
      height: 0
    }
  }),
  computed: {
    circles () {
      return store.getters.getCircles
    },
    leftArrows () {
      return store.getters.getLeftArrows
    },
    rightArrows () {
      return store.getters.getRightArrows
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
    this.$store.commit('changeVisHeight', this.$refs.svg.clientHeight)
    // @ts-ignore
    this.$store.commit('changeVisWidth', this.$refs.svg.clientWidth)
  },
  methods: {
    handleResize () {
      // @ts-ignore
      this.$store.commit('changeVisHeight', this.$refs.svg.clientHeight)
      // @ts-ignore
      this.$store.commit('changeVisWidth', this.$refs.svg.clientWidth)
      this.$store.dispatch('repackCircles')
    },
    // eslint-disable-next-line
    clickCircle: function (data: any) {
      this.$store.dispatch('circleClicked', data)
      this.$store.dispatch('repaintArrows')
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
