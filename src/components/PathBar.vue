<template>
  <svg id="svg" ref="svg" width="100%">
    <g ref="svg">
      <template v-for="c in circles">
        <circle class="circle"
          v-bind:content="`
            label: ${c.label}</br>
            id: ${c.id}
          `"
          v-tippy='{interactive : true, animateFill: false, placement:"right", animation:"shift-toward", delay:100, arrow : true}'
          :key="c.key1"
          :id="c.id"
          :r="c.r"
          :cx="c.x"
          :cy="c.y"
          fill="steelblue"
          stroke='none'
          @click.exact="clickCircle(c)"
          @click.ctrl="openWiki(c)"
        >
        </circle>
      </template>
      <template v-for="c in circles">
        <text class="labels"
          :key="c.key2"
          :x="c.x"
          :font-size="c.r / 2"
          :y="c.y"
          @click.exact="clickCircle(c)"
          @click.ctrl="openWiki(c)"
        >{{c.label.substring(0, 6)}}..
        </text>
      </template>
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '../store'
import { Circle } from '../models/Circle'

export default Vue.extend({
  name: 'SliderBar',

  data: () => ({
  }),
  computed: {
    circles () {
      return store.getters.getPath
    }
  },
  mounted () {
    // @ts-ignore
    this.$store.commit('changePathVisWidth', this.$refs.svg.clientWidth)
  },
  methods: {
    // eslint-disable-next-line
    openWiki: function (data: any) {
      const win = window.open('https://www.wikidata.org/wiki/' + data.id, '_blank')
      if (win !== null) {
        win.focus()
      }
    },
    // eslint-disable-next-line
    clickCircle: function (data: Circle) {
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
