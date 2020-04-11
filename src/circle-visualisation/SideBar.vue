<template>
  <v-container>
    <add-dataset-dialog @changeDataset="setDataset" ></add-dataset-dialog>
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
import axios from 'axios'
import store from '../app/store'
import AddDatasetDialog from '@/components/ui/AddDatasetDialog.vue'
import TreeViewList from '@/components/ui/TreeViewList.vue'
import { ComboboxItem } from '@/models/ComboboxItem'
import { Position } from '@/models/Position'
import { MappingNode } from '@/models/MappingNode'
import { createMapping } from '../services/create'

export default Vue.extend({
  name: 'SideBar',
  components: {
    AddDatasetDialog,
    TreeViewList
  },
  props: {
    sidebarPosition: {
    }
  },
  data: () => ({
    collectionItems: ['hierarchy.v1', 'hierarchy.v2', 'hierarchy.v3', 'hierarchy.v3.reduced'],
    mappingList: Array<MappingNode>(),
    selectList: Array<ComboboxItem>(),
    error: Error()
  }),
  computed: {
  },
  methods: {
    setDataset: function (url: string) {
      axios.get(url).then(
        response => {
          switch (this.$props.sidebarPosition) {
            case Position.Left:
              this.$store.commit('changeLeftDataset', response.data)
              break
            case Position.Right:
              this.$store.commit('changeRightDataset', response.data)
              break
          }
          this.selectList = []
          for (let i = 0; i < response.data.mappings.length; i++) {
            const node: ComboboxItem = {
              id: i,
              name: response.data.mappings[i].metadata.from
            }
            this.selectList.push(node)
          }
          this.$store.dispatch('initialize')
          this.$store.dispatch('buildTree')
        },
        error => {
          this.error = error
        }
      )
    },
    // eslint-disable-next-line
    changeMapping: function (data: ComboboxItem) {
      this.mappingList = []
      switch (this.$props.sidebarPosition) {
        case Position.Left:
          this.mappingList = createMapping(store.getters.getLabels, store.getters.getLeftDataset, data.id)
          break
        case Position.Right:
          this.mappingList = createMapping(store.getters.getLabels, store.getters.getRightDataset, data.id)
          break
      }
    },
    selectedChanged: function (array: Array<MappingNode>) {
      switch (this.$props.sidebarPosition) {
        case Position.Left:
          store.commit('changeLeftMapping', array)
          break
        case Position.Right:
          store.commit('changeRightMapping', array)
          break
      }
    }
  }
})
</script>
