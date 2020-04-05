<template>
    <text class="labels"
        :key="labelData.key2"
        :fill="labelData.textColor"
        :x="labelData.x"
        v-if="labelData.isLeaf && labelData.r > 12"
        :font-size="labelData.r / 2"
        :y="labelData.y"
        dy=".35em"
        @click.exact="emit(labelData)"
        @click.ctrl="openWiki(labelData)"
        >{{c.label.substring(0, 4)}}...
     </text>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'CircleLabel',
  props: {
    labelData: {
      type: Object,
      required: true
    }
  },
  data: () => ({
  }),
  computed: {
  },
  methods: {
    /** @param {MouseEvent} event */
    emit (event) {
      this.$emit('circleNodeClicked', event.target.checked)
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
