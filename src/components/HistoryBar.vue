<template>
  <svg id="svg" ref="svg" width="100%">
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'HistoryBar',

  data: () => ({
  }),
  computed: {
    // circles () {
    //   return store.getters.getPath
    // }
  },
  mounted () {
    // // @ts-ignore
    // this.$store.commit('changePathVisWidth', this.$refs.svg.clientWidth)
  },
  methods: {
    // // eslint-disable-next-line
    // openWiki: function (data: any) {
    //   const win = window.open('https://www.wikidata.org/wiki/' + data.id, '_blank')
    //   if (win !== null) {
    //     win.focus()
    //   }
    // },
    // // eslint-disable-next-line
    // clickCircle: function (data: Circle) {
    //   this.$store.dispatch('cutPath', data.pathNr)
    //   this.$store.dispatch('pathClicked', data)
    //   this.$store.dispatch('repaintArrows')
    // }
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
