<template>
  <v-container>
    <v-select
      :items="selectList"
      item-text="name"
      label="Choose map by:"
      return-object
      @change="changeMapping"
      >
    </v-select>
    <tree-view-list v-bind:items="mappingList" @selectedItems="selectedChanged" ></tree-view-list>
  </v-container>
</template>

<script lang='ts'>
import Vue from 'vue'
import TreeViewList from './TreeViewList.vue'
import { ComboboxItem } from '../models/ComboboxItem'
import { Position } from '../models/Position'
import { MappingNode } from '../models/MappingNode'
import store from '../app/store'

export default Vue.extend({
  name: 'SideBar',
  components: {
    TreeViewList
  },
  props: ['sidebarPosition', 'mappingList'],
  data: () => ({
    error: Error()
  }),
  computed: {
    selectList: function () {
      if (this.$props.sidebarPosition === Position.Left) {
        return store.getters['visualisation/GET_LEFT_MAPPING_LIST']
      } else {
        return store.getters['visualisation/GET_RIGHT_MAPPING_LIST']
      }
    }
  },
  methods: {
    changeMapping: function (data: ComboboxItem) {
      this.$emit('mappingChoosed', this.sidebarPosition, data.id)
    },
    selectedChanged: function (array: Array<MappingNode>) {
      this.$emit('mappingChanged', this.sidebarPosition, array)
    }
  }
})
</script>
