<template>
    <svg id="svg" ref="svg" width="100%" height="80vh">
      <g>
        <template v-for="c in circles">
          <circle class="circle"
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
          <text class="text"
            :key="c.key2"
            :x="c.x-12*(c.id.length)/3"
            v-if="c.isLeaf"
            :font-size="12"
            :y="c.y+6"
          >{{c.id}}
          </text>
        </template>
        <template v-for="c in leftArrows">
          <line class="link"
            :key="c.id"
            :id="c.id"
            :x1="c.lx"
            :y1="c.ly"
            :x2="c.rx"
            :y2="c.ry"
            :stroke="c.color"
          >
          </line>
        </template>
        <template v-for="c in rightArrows">
          <line class="link"
            :key="c.id"
            :id="c.id"
            :x1="c.lx"
            :y1="c.ly"
            :x2="c.rx"
            :y2="c.ry"
            :stroke="c.color"
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
import { Node } from '../models/Node'
import { Label } from '../models/Label'
import { Link } from '../models/Link'
import { Arrow } from '../models/Arrow'
import { Visualisation } from '../models/Visualisation'
import store from '../store'

export default Vue.extend({
  name: 'Visualisation',
  data: () => ({
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
  mounted () {
    // @ts-ignore
    this.$store.commit('changeVisHeight', this.$refs.svg.clientHeight)
    // @ts-ignore
    this.$store.commit('changeVisWidth', this.$refs.svg.clientWidth)
    // store.subscribe((mutation) => {
    //   switch (mutation.type) {
    //     case 'changeActiveViewDepth':
    //       // this.visualise(store.state.activeId, store.state.activeViewDepth)
    //       // this.repaintArrows(store.state.leftArrowsId, store.state.rightArrowsId)
    //       break
    //     case 'changeLeftArrowsId':
    //       // this.repaintArrows(store.state.leftArrowsId, store.state.rightArrowsId)
    //       break
    //     case 'changeRightArrowsId':
    //       // this.repaintArrows(store.state.leftArrowsId, store.state.rightArrowsId)
    //       break
    //   }
    // })
  },
  methods: {
    openWiki: function (data: any) {
      const win = window.open('https://www.wikidata.org/wiki/' + data.id, '_blank')
      if (win !== null) {
        win.focus()
      }
    },
    clickCircle: function (data: any) {
      // this.$store.commit('changeActiveViewDepth', 0)
      // this.$store.commit('changeActiveId', data.id)
      // this.visualise(store.state.activeId, store.state.activeViewDepth)
    }
  }
})
</script>
