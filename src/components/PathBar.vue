<template>
  <svg id="path-svg" ref="path-svg" >
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
        <text class="labels"
          :key="c.key2"
          :x="c.x-12*(c.id.length)/3"
          :font-size="12"
          :y="c.y+6"
          @click.exact="clickCircle(c)"
          @click.ctrl="openWiki(c)"
        >{{c.id}}
        </text>
      </template>
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '../store'

export default Vue.extend({
  name: 'SliderBar',

  data: () => ({
  }),
  computed: {
    circles () {
      return store.getters.getPath
    }
  },
  methods: {
  }
})
</script>
