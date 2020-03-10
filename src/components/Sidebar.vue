<template>
  <v-container>
    <v-text-field v-model="datasetUrl"></v-text-field>
    <v-btn color="red" @click="addDataset">Confirm</v-btn>
    <v-select
      :items="comboboxItems"
      item-text="name"
      label="add url"
      single-line
      return-object
      @change="changeMapping"
      >
    </v-select>
    <v-treeview selectable :items="this.treeItems" v-model="selectedTreeItems" />
  </v-container>
</template>

<script lang='ts'>
import Vue from 'vue'
import { MappingData, MappingNode, ComboboxItem, Link, Label } from '../models/types'
import axios from 'axios'
import store from '../store'

export default Vue.extend({
  name: 'Sidebar',

  props: {
    sidebarPosition: {
      type: String
    }
  },
  data: () => ({
    treeItems: Array<MappingNode>(),
    selectedTreeItems: [],
    comboboxItems: Array<ComboboxItem>(),
    datasetUrl: 'example.json',
    error: Error()
  }),
  methods: {
    addDataset: function () {
      axios.get(this.datasetUrl).then(
        response => {
          if (this.$props.sidebarPosition === 'left') {
            this.$store.commit('changeLeftDataset', response.data)
          } else {
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
        },
        error => {
          this.error = error
        }
      )
    },
    // eslint-disable-next-line
    changeMapping: function (data: ComboboxItem) {
      // create structure for mapping
      const mappingArray = this.createMappingArray(data.id)
      if (this.$props.sidebarPosition === 'left') {
        this.$store.commit('changeLeftMapping', mappingArray)
      } else {
        this.$store.commit('changeRightMapping', mappingArray)
      }
      this.treeItems = this.createTree(mappingArray)

      // create hierarchy
      const hierarchyArray = this.createHierarchy()
      this.$store.commit('changeHierarchy', hierarchyArray)

      const labelsArray = this.createLabels()
      this.$store.commit('changeLabels', labelsArray)
    },
    createLabels: function (): Array<Label> {
      const leftDataset = store.state.leftDataset
      const rightDataset = store.state.rightDataset
      const array = Array<Label>()
      if (leftDataset.labels !== undefined) {
        for (const key in leftDataset.labels) {
          const value = leftDataset.labels[key]
          const newLabel = new Label(key, leftDataset.labels[key])
          array.push(newLabel)
        }
      }
      if (rightDataset.labels !== undefined) {
        for (const key in rightDataset.labels) {
          const newLabel = new Label(key, rightDataset.labels[key])
          if (array.filter(x => x.id === newLabel.id && x.label === newLabel.label).length === 0) {
            array.push(newLabel)
          }
        }
      }
      return array
    },
    createHierarchy: function (): Array<Link> {
      const leftDataset = store.state.leftDataset
      const rightDataset = store.state.rightDataset
      const array = Array<Link>()
      if (leftDataset.hierarchy !== undefined) {
        for (let i = 0; i < leftDataset.hierarchy.length; i++) {
          const newLink = new Link(leftDataset.hierarchy[i][2], leftDataset.hierarchy[i][0])
          array.push(newLink)
        }
      }
      if (rightDataset.hierarchy !== undefined) {
        for (let i = 0; i < rightDataset.hierarchy.length; i++) {
          const newLink = new Link(rightDataset.hierarchy[i][2], rightDataset.hierarchy[i][0])
          if (array.filter(x => x.source === newLink.source && x.target === newLink.target).length === 0) {
            array.push(newLink)
          }
        }
      }
      return array
    },
    createMappingArray: function (id: number): Array<MappingData> {
      let mapping = Object()
      if (this.$props.sidebarPosition === 'left') {
        mapping = store.state.leftDataset
      } else {
        mapping = store.state.rightDataset
      }
      const array = Array<MappingData>()
      for (let i = 0; i < mapping.mappings[id].data.length; i++) {
        const newNode: MappingData = {
          id: mapping.mappings[id].data[i].id,
          group: mapping.mappings[id].data[i].metadata.group,
          size: mapping.mappings[id].data[i].metadata.target_size,
          shared: mapping.mappings[id].data[i].metadata.shared_size
        }
        array.push(newNode)
      }
      return array
    },
    createTree: function (List: Array<MappingData>): Array<MappingNode> {
      const array: Array<MappingNode> = Array<MappingNode>()
      let counter = 1
      List.forEach(element => {
        if (array.filter(x => x.name === element.group[0]).length === 0) {
          const newChildren: MappingNode = {
            id: counter,
            name: element.id
          }
          counter++
          const newNode: MappingNode = {
            id: counter,
            name: element.group[0],
            children: [newChildren]
          }
          counter++
          array.push(newNode)
        } else {
          const node = array.filter(x => x.name === element.group[0])[0]
          const newChildren: MappingNode = {
            id: counter,
            name: element.id
          }
          counter++
          if (node.children !== undefined) {
            node.children.push(newChildren)
          }
        }
      })
      return array
    }
  }
})
</script>
