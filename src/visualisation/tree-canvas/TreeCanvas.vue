<template>
    <svg id="svg" ref="svg" width="100%" height="50vh">
    </svg>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { Circle } from '@/models'
import { Actions } from '../Visualisation.store'

export default Vue.extend({
  name: 'CircleCanvas',
  components: {
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters('circles', {
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
      resizeCanvas: Actions.RESIZE_CANVAS
    }),
    handleResize () {
      this.resizeCanvas({
        // @ts-ignore
        height: this.$refs.svg.clientHeight,
        // @ts-ignore
        width: this.$refs.svg.clientWidth
      })
    },
    nodeClicked (data) {
      console.log(data)
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
