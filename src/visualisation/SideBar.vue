<template>
  <v-container>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn v-if="display" color="primary" v-on="on">Add dataset</v-btn>
      </template>
      <add-dataset-form @datasetChanged="datasetChanged" @dialogClosed="dialogClosed"></add-dataset-form>
    </v-dialog>
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
import AddDatasetForm from '@/common-components/AddDatasetForm.vue'
import TreeViewList from '@/common-components/TreeViewList.vue'
import { ComboboxItem } from '@/models/ComboboxItem'
import { Position } from '@/models/Position'
import { MappingNode } from '@/models/MappingNode'
import { createMapping } from '../utils/hierarchyUtils'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { Actions, Mutations, Getters } from './Visualisation.store'
import store from '../app/store'

export default Vue.extend({
  name: 'SideBar',
  components: {
    AddDatasetForm,
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
    addDatasetVisibility: true,
    dialog: false,
    display: true
  }),
  mounted: function () {
    if (this.url !== undefined && this.collection !== undefined) {
      this.addDatasetVisibility = false
      this.datasetChanged(this.url, this.collection)
    }
  },
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
    ...mapActions('visualisation', {
      fetchDataset: Actions.FETCH_DATASET
    }),
    ...mapMutations('visualisation', {
      changeLeftDataset: Mutations.CHANGE_LEFT_DATASET,
      changeRightDataset: Mutations.CHANGE_RIGHT_DATASET,
      changeLeftMapping: Mutations.CHANGE_LEFT_MAPPING,
      changeRightMapping: Mutations.CHANGE_RIGHT_MAPPING
    }),
    ...mapGetters('visualisation', {
      getLeftDataset: Getters.GET_LEFT_DATASET,
      getRightDataset: Getters.GET_RIGHT_DATASET,
      getLabels: Getters.GET_LABELS
    }),
    datasetChanged: function (url: string, collection: string) {
      this.dialog = false
      this.$emit('datasetChanged', url, collection, this.sidebarPosition)
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
    dialogClosed: function () {
      this.dialog = false
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
