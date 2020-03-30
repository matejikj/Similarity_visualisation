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
        <template v-for="c in circles">
          <circle
            v-bind:content="`
              label: ${c.label}</br>
              id: ${c.id}
            `"
            v-tippy='{interactive : true, animateFill: false, placement:"right", animation:"shift-toward", delay:100, arrow : true}'
            class="circle"
            :key="c.key1"
            :id="c.id"
            :r="c.r"
            :cx="c.x"
            :cy="c.y"
            :fill="c.fill"
            :stroke="c.stroke"
            @click.exact="clickCircle(c)"
            @click.ctrl="openWiki(c)"
          >
          </circle>
        </template>
        <template v-for="c in circles">
          <text class="labels"
            :key="c.key2"
            :fill="c.textColor"
            :x="c.x"
            v-if="c.isLeaf && c.r > 12"
            :font-size="c.r / 2"
            :y="c.y"
            dy=".35em"
            @click.exact="clickCircle(c)"
            @click.ctrl="openWiki(c)"
          >{{c.label.substring(0, 4)}}...
          </text>
        </template>
        <template v-for="c in leftArrows">
          <line class="link"
            v-bind:content="`
              map by: ${c.word}</br>
              map to: ${c.mapTo}</br>
            `"
            v-tippy='{interactive : true, animateFill: false, placement:"left", animation:"shift-toward", delay:20, arrow : true}'
            :key="c.id"
            :id="c.id"
            :x1="c.lx"
            :y1="c.ly"
            :x2="c.rx"
            :y2="c.ry"
            stroke='black'
            stroke-width='2'
            marker-end="url(#arrow)"
          >
          </line>
        </template>
        <template v-for="c in rightArrows">
          <line class="link"
            v-bind:content="`
              map by: ${c.word}</br>
              map to: ${c.mapTo}</br>
            `"
            v-tippy='{interactive : true, animateFill: false, placement:"right", animation:"shift-toward", delay:20, arrow : true}'
            :key="c.id"
            :id="c.id"
            :x1="c.lx"
            :y1="c.ly"
            :x2="c.rx"
            :y2="c.ry"
            stroke='black'
            stroke-width='2'
            marker-end="url(#arrow)"
          >
          </line>
        </template>
      </g>
    </svg>
</template>

<style>
.circle { text-decoration: underline; }
</style>

<script lang="ts">
import Vue from 'vue'
import store from '../store'

export default Vue.extend({
  name: 'Visualisation',
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
    openWiki: function (data: any) {
      const win = window.open('https://www.wikidata.org/wiki/' + data.id, '_blank')
      if (win !== null) {
        win.focus()
      }
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
}
.labels {
  cursor: pointer;
  text-anchor: middle;
  pointer-events: none;
}
</style>
