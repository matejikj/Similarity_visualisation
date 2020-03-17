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
      v-model="selectedMappingItems"
      :items="this.mappingItems"
      selectable
      @input="selectedTreeItemsHandle"
      />
  </v-container>
</template>

<script lang='ts'>
import Vue from 'vue'
import { ComboboxItem, Position } from '../models/types'
import axios from 'axios'
import store from '../store'

export default Vue.extend({
  name: 'Sidebar',

  props: {
    sidebarPosition: {
    }
  },
  data: () => ({
    selectedMappingItems: [],
    comboboxItems: Array<ComboboxItem>(),
    datasetUrl: 'example.json',
    error: Error()
  }),
  computed: {
    mappingItems () {
      if (this.$props.sidebarPosition === Position.Left) {
        return store.getters.getLeftMapping
      } else {
        return store.getters.getRightMapping
      }
    }
  },
  methods: {
    // eslint-disable-next-line
    selectedTreeItemsHandle: function (data: any): void {
      const array = Array<string>()
      if (this.$props.sidebarPosition === Position.Left) {
        data.forEach(element => {
          array.push(store.state.leftMapping.itemsList.filter(x => x.id === element)[0].name)
        })
        this.$store.commit('changeLeftSelectedMappingNodes', array)
      }
      if (this.$props.sidebarPosition === Position.Right) {
        data.forEach(element => {
          array.push(store.state.rightMapping.itemsList.filter(x => x.id === element)[0].name)
        })
        this.$store.commit('changeRightSelectedMappingNodes', array)
      }
      this.$store.dispatch('paintArrows', this.$props.sidebarPosition)
    },
    addDataset: function (): void {
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
          this.$store.dispatch('resetRootId')
          this.$store.dispatch('createHierarchy')
          this.$store.dispatch('createLabels')
          this.$store.dispatch('initializeNodes')
          this.$store.dispatch('paintCircles')
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
          this.$store.commit('changeLeftSelectedMapping', data.id)
          break
        case Position.Right:
          this.$store.commit('changeRightSelectedMapping', data.id)
          break
      }
      store.dispatch('createMapping', this.$props.sidebarPosition)
    }
  }
})
</script>
