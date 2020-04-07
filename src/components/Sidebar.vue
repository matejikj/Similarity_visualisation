<template>
  <v-container>
    <dataset-dialog @changeDataset="setDataset" ></dataset-dialog>
    <select-list v-model="selectList" @change="changeMapping"></select-list>
  </v-container>
</template>

<script lang='ts'>
import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import DatasetDialog from './DatasetDialog.vue'
import SelectList from './base/SelectList.vue'
import { ComboboxItem } from '@/models/ComboboxItem'
import { Position } from '@/models/Position'
import { MappingNode } from '@/models/MappingNode'

export default Vue.extend({
  name: 'SideBar',
  components: {
    DatasetDialog,
    SelectList
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
    setDataset: function (url: string): void {
      axios.get(url).then(
        response => {
          console.log(this.$props.sidebarPosition)
          switch (this.$props.sidebarPosition) {
            case Position.Left:
              this.$store.commit('changeLeftDataset', response.data)
              break
            case Position.Right:
              this.$store.commit('changeRightDataset', response.data)
              break
          }
          for (let i = 0; i < response.data.mappings.length; i++) {
            const node: ComboboxItem = {
              id: i,
              name: response.data.mappings[i].metadata.from
            }
            this.selectList.push(node)
          }
          this.$store.dispatch('initialize')
        },
        error => {
          this.error = error
        }
      )
    },
    // eslint-disable-next-line
    changeMapping: function (data: ComboboxItem): void {
      switch (this.$props.sidebarPosition) {
        case Position.Left:
          break
        case Position.Right:
          break
      }
    }
  }
})
</script>
