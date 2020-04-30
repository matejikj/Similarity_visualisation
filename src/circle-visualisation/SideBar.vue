<template>
  <v-container>
    <add-dataset-dialog v-if="addDatasetVisibility" @changeDataset="changeDataset" ></add-dataset-dialog>
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
import AddDatasetDialog from '@/common-components/AddDatasetDialog.vue'
import TreeViewList from '@/common-components/TreeViewList.vue'
import { ComboboxItem } from '@/models/ComboboxItem'
import { Position } from '@/models/Position'
import { MappingNode } from '@/models/MappingNode'
import { createMapping } from '../utils/hierarchyUtils'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { Actions, Mutations, Getters } from './CircleVisualisation.store'
import store from '../app/store'

export default Vue.extend({
  name: 'SideBar',
  components: {
    AddDatasetDialog,
    TreeViewList
  },
  props: {
    sidebarPosition: {},
    url: String,
    collection: String
  },
  data: () => ({
    mappingList: Array<MappingNode>(),
    error: Error(),
    addDatasetVisibility: true
  }),
  mounted: function () {
    if (this.url !== undefined && this.collection !== undefined) {
      this.addDatasetVisibility = false
      this.changeDataset(this.url, this.collection)
    }
  },
  computed: {
    selectList: function () {
      if (this.$props.sidebarPosition === Position.Left) {
        return store.getters['circleVisualisation/GET_LEFT_MAPPING_LIST']
      } else {
        return store.getters['circleVisualisation/GET_RIGHT_MAPPING_LIST']
      }
    }
  },
  methods: {
    ...mapActions('circleVisualisation', {
      updateCanvas: Actions.UPDATE_CANVAS,
      fetchDataset: Actions.FETCH_DATASET
    }),
    ...mapMutations('circleVisualisation', {
      changeLeftDataset: Mutations.CHANGE_LEFT_DATASET,
      changeRightDataset: Mutations.CHANGE_RIGHT_DATASET,
      changeLeftMapping: Mutations.CHANGE_LEFT_MAPPING,
      changeRightMapping: Mutations.CHANGE_RIGHT_MAPPING
    }),
    ...mapGetters('circleVisualisation', {
      getLeftDataset: Getters.GET_LEFT_DATASET,
      getRightDataset: Getters.GET_RIGHT_DATASET,
      getLabels: Getters.GET_LABELS
    }),
    changeDataset: function (url: string, collection: string) {
      const position = this.sidebarPosition
      this.fetchDataset({ url, collection, position })
    },
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
      this.updateCanvas()
    }
  }
})
</script>
