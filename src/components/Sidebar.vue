<template>
  <v-container>
    <v-text-field v-model="datasetUrl" @keyup.enter="addDataset" @blur="addDataset"></v-text-field>
    <v-select
      :items="comboboxItems"
      item-text="name"
      label="add url"
      single-line
      return-object
      @change="changeMapping"
      >
    </v-select>
    <v-treeview
      v-model="selectedTreeItems"
      :items="this.treeItems"
      selectable
      @input="selectedTreeItemsHandle"
      />
  </v-container>
</template>

<script lang='ts'>
import Vue from 'vue'
import { MappingData, MappingNode, ComboboxItem, Position } from '../models/types'
import { Link } from '../models/Link'
import { Label } from '../models/Label'
import axios from 'axios'
import store from '../store'

export default Vue.extend({
  name: 'Sidebar',

  props: {
    sidebarPosition: {
    }
  },
  data: () => ({
    treeItems: Array<MappingNode>(),
    treeItemsArray: Array<MappingNode>(),
    selectedTreeItems: [],
    comboboxItems: Array<ComboboxItem>(),
    datasetUrl: 'example.json',
    error: Error()
  }),
  methods: {
    selectedTreeItemsHandle: function (data: any) {
      const array = Array<string>()
      data.forEach(element => {
        array.push(this.treeItemsArray.filter(x => x.id === element)[0].name)
      })
      if (this.$props.sidebarPosition === Position.Left) {
        this.$store.commit('changeLeftArrowsId', array)
      }
      if (this.$props.sidebarPosition === Position.Right) {
        this.$store.commit('changeRightArrowsId', array)
      }
    },
    addDataset: function () {
      axios.get(this.datasetUrl).then(
        response => {
          if (this.$props.sidebarPosition === Position.Left) {
            this.$store.commit('changeLeftDataset', response.data)
          }
          if (this.$props.sidebarPosition === Position.Right) {
            this.$store.commit('changeRightDataset', response.data)
          }
          const array = Array<ComboboxItem>()
          for (let i = 0; i < response.data.mappings.length; i++) {
            const node: ComboboxItem = {
              id: i,
              name: response.data.mappings[i].metadata.from
            }
            array.push(node)
          }
          this.comboboxItems = array
          console.log('RRRRRRRRRRRRRRRRRRRRRR')
          // create hierarchy
          this.$store.dispatch('createHierarchy')
          console.log('AAAAAAAAAAAAAAAAAAAAAAA')
          this.$store.dispatch('createLabels')
          console.log('BBBBBBBBBBBBBBBBBBBBBBB')
          this.$store.dispatch('initializeNodes')
          console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRT')
          this.$store.dispatch('paintCircles')
          console.log('CCCCCCCCCCCCCCCCCCCCCCCC')
        },
        error => {
          this.error = error
        }
      )
    },
    // eslint-disable-next-line
    changeMapping: function (data: ComboboxItem) {
      // create structure for mapping

      const mappingArray = store.dispatch('createMappingArray', this.$props.sidebarPosition)
      // if (this.$props.sidebarPosition === 'left') {
      //   this.$store.commit('changeLeftMapping', mappingArray)
      // } else {
      //   this.$store.commit('changeRightMapping', mappingArray)
      // }

      // this.createMappingArray(data.id)

      // this.selectedTreeItems = []
      // this.treeItemsArray = Array<MappingNode>()
      // this.treeItems = this.createTree(mappingArray)
    }
  }
})
</script>
