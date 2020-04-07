<template>
  <v-treeview
    v-model="selectedItems"
    class="overflow-y-auto"
    :items="value"
    selectable
    @input="selectedChanged"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { Position } from '@/models'
import store from '@/store'
import { MappingNode } from '@/models/MappingNode'

export default Vue.extend({
  name: 'TreeViewList',

  props: {
    value: {
      type: Array
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data: () => ({
    selectedItems: Array
  }),
  computed: {
  },
  methods: {
    // eslint-disable-next-line
    selectedChanged: function (data: any): void {
      console.log('BBB')
      // const array = Array<MappingNode>()
      // if (this.$props.sidebarPosition === Position.Left) {
      //   data.forEach(element => {
      //     const node = store.state.leftMapping.filter(x => x.id === element)[0]
      //     if (node !== undefined) {
      //       array.push(node)
      //     }
      //   })
      //   // this.$store.commit('changeLeftSelectedMappingNodes', array)
      // }
      // if (this.$props.sidebarPosition === Position.Right) {
      //   data.forEach(element => {
      //     const node = store.state.rightMapping.filter(x => x.id === element)[0]
      //     if (node !== undefined) {
      //       array.push(node)
      //     }
      //   })
      //   // this.$store.commit('changeRightSelectedMappingNodes', array)
      // }
      // // this.$store.dispatch('paintArrows', this.$props.sidebarPosition)
    }
  }
})
</script>
