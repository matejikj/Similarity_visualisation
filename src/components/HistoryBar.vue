<template>
  <v-content>
    <template v-for="(c, index) in circles">
      <v-btn v-bind:key="index" class="ma-2" outlined large fab color="blue">
        {{ c }}
      </v-btn>
    </template>
  </v-content>
</template>

<script lang="ts">
import Vue from 'vue'
import CircleNode from './CircleNode.vue'
import CircleLabel from './CircleLabel.vue'
import store from '../store'

export default Vue.extend({
  name: 'HistoryBar',

  data: () => ({
    window: {
      width: 0,
      height: 0
    }
  }),
  computed: {
    circles () {
      return store.getters.getCirclesPath
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
    },
    // eslint-disable-next-line
    clickCircle: function (data) {
      this.$store.dispatch('cutPath', data.pathNr)
      this.$store.dispatch('pathClicked', data)
      this.$store.dispatch('repaintArrows')
    }
  }
})
</script>

<style>
.circle {
  cursor: pointer;
}
.labels {
  cursor: pointer;
  text-anchor: middle;
  pointer-events: none;
}
</style>
