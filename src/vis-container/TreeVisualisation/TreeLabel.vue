<template>
    <text class="tree-labels"
        fill="black"
        :x="labelData.x"
        :y="labelData.y - 2 * radius"
        dy=".35em"
        @click.exact="emit(labelData)"
        @click.ctrl="openWiki(labelData)"
        >{{ labelData.label.length > 20 ? labelData.label.substring(0, 20) + ".." : labelData.label }}
     </text>
</template>

<script lang="ts">
import Vue from 'vue'
import { TREE_CIRCLE_RADIUS } from '@/models'

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
