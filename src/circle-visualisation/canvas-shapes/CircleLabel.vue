<template>
    <text class="labels"
        fill="white"
        :x="labelData.x"
        v-if="labelData.isLeaf && labelData.r > 12"
        :font-size="labelData.r / 2"
        :y="labelData.y"
        dy=".35em"
        @click.exact="emit(labelData)"
        @click.ctrl="openWiki(labelData)"
        >{{labelData.label.substring(0, 4)}}...
     </text>
</template>

<script lang="ts">
import Vue from 'vue'
import { Circle } from '@/models'

export default Vue.extend({
  name: 'CircleLabel',
  props: {
    labelData: {
      type: Object
    }
  },
  data: () => ({
  }),
  computed: {
  },
  methods: {
    /** @param {MouseEvent} event */
    emit (event) {
      this.$emit('labelClicked', event)
    },
    // eslint-disable-next-line
    openWiki: function (data: any) {
      const win = window.open('https://www.wikidata.org/wiki/' + data.id, '_blank')
      if (win !== null) {
        win.focus()
      }
    }
  }
})
</script>
