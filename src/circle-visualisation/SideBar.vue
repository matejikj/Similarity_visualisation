<template>
  <v-container>
    <add-dataset-dialog @changeDataset="changeDataset" ></add-dataset-dialog>
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
import AddDatasetDialog from '@/common-components/AddDatasetDialog.vue'
import TreeViewList from '@/common-components/TreeViewList.vue'
import { ComboboxItem } from '@/models/ComboboxItem'
import { Position } from '@/models/Position'
import { MappingNode } from '@/models/MappingNode'
import { createMapping } from '../services/create'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { Actions, Mutations, Getters } from './CircleVisualisation.store'

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
    collectionItems:
      ['hierarchy.v1',
        'hierarchy.v2',
        'hierarchy.v3',
        'hierarchy.v3.reduced'
      ],
    mappingList: Array<MappingNode>(),
    selectList: Array<ComboboxItem>(),
    error: Error()
  }),
  computed: {
  },
  methods: {
    ...mapActions('circleVisualisation', {
      initialize: Actions.INITIALIZE_NODES,
      buildTree: Actions.BUILD_TREE,
      updateCanvas: Actions.UPDATE_CANVAS
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
    changeDataset: function (url: string) {
      axios.get(url).then(
        response => {
          switch (this.$props.sidebarPosition) {
            case Position.Left:
              this.changeLeftDataset(response.data)
              break
            case Position.Right:
              this.changeRightDataset(response.data)
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
          this.initialize()
          this.buildTree()
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
