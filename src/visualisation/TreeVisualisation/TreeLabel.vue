<template>
    <text class="tree-labels"
        fill="black"
        :x="labelData.x"
        :y="labelData.y - 2 * radius"
        dy=".35em"
        @click.exact="emit(labelData)"
        @click.ctrl="openWiki(labelData)"
        >{{ labelData.label }}
     </text>
</template>

<script lang="ts">
import Vue from 'vue'
import { TREE_CIRCLE_RADIUS, Circle } from '../../models'

export default Vue.extend({
  name: 'TreeLabel',
  props: {
    labelData: {
      type: Object
    }
  },
  data: () => ({
    radius: TREE_CIRCLE_RADIUS
  }),
  computed: {
  },
  methods: {
    /**
     * @param {MouseEvent} Node was clicked to zoom
     */
    emit (event: Circle) {
      this.$emit('labelClicked', event)
    },
    /**
     * @param {MouseEvent} Node was clicked with ctrl to show Wikipage
     */
    // eslint-disable-next-line
    openWiki: function (data: Circle) {
      const win = window.open('https://www.wikidata.org/wiki/' + data.id, '_blank')
      if (win !== null) {
        win.focus()
      }
    }
  }
})
</script>
