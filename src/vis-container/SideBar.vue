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
import TreeViewList from '@/common-components/TreeViewList.vue'
import { ComboboxItem } from '@/models/ComboboxItem'
import { Position } from '@/models/Position'
import { MappingNode } from '@/models/MappingNode'
import { createMapping } from '../utils/hierarchyUtils'
import { mapMutations, mapGetters } from 'vuex'
import { Actions, Mutations, Getters } from './Visualisation.store'
import store from '../app/store'

export default Vue.extend({
  name: 'SideBar',
  components: {
    TreeViewList
  },
  props: {
    sidebarPosition: {},
    url: String,
    collection: String
  },
  data: () => ({
    mappingList: Array<MappingNode>(),
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
    ...mapMutations('visualisation', {
      changeLeftMapping: Mutations.CHANGE_LEFT_MAPPING,
      changeRightMapping: Mutations.CHANGE_RIGHT_MAPPING
    }),
    ...mapGetters('visualisation', {
      getLeftDataset: Getters.GET_LEFT_DATASET,
      getRightDataset: Getters.GET_RIGHT_DATASET,
      getLabels: Getters.GET_LABELS
    }),
    changeMapping: function (data: ComboboxItem) {
      this.mappingList = []
      switch (this.$props.sidebarPosition) {
        case Position.Left:
          this.mappingList = createMapping(this.getLabels(), this.getLeftDataset(), data.id)
          break
        case Position.Right:
          this.mappingList = createMapping(this.getLabels(), this.getRightDataset(), data.id)
          break
      }
    },
    selectedChanged: function (array: Array<MappingNode>) {
      switch (this.$props.sidebarPosition) {
        case Position.Left:
          this.changeLeftMapping(array)
          break
        case Position.Right:
          this.changeRightMapping(array)
          break
      }
      this.$emit('mappingChanged')
    }
  }
})
</script>
