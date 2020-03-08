<template>
    <v-container>
        <v-text-field v-model="datasetUrl"></v-text-field>
        <v-btn color="red" @click="getDataset" >Confirm</v-btn>
        <v-treeview selectable
          :items="this.items"
          v-model="selectedItems"
        />
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { MappingData, MappingNode } from '../models/types'
import axios from 'axios'

export default Vue.extend({
  name: 'Sidebar',

  props: {
    sidebarPosition: {
      type: String
    }
  },
  data: () => ({
    items: Array<MappingNode>(),
    selectedItems: [],
    datasetUrl: 'example.json',
    error: Error()
  }),
  methods: {
    // eslint-disable-next-line
    getDataset: function () {
      axios.get(this.datasetUrl)
        .then((response) => {
          if (this.$props.sidebarPosition === 'left') {
            this.$store.commit('addLeftDataset', response.data)
          } else {
            this.$store.commit('addRightDataset', response.data)
          }
          const array = Array<MappingData>()
          for (let i = 0; i < response.data.mappings[0].data.length; i++) {
            const newNode: MappingData = {
              id: response.data.mappings[0].data[i].id,
              group: response.data.mappings[0].data[i].metadata.group,
              size: response.data.mappings[0].data[i].metadata.size,
              shared: response.data.mappings[0].data[i].metadata.shared
            }
            array.push(newNode)
          }
          this.items = this.createTree(array)
          console.log(this.items)
        }, (error) => {
          this.error = error
        })
    },
    createTree: function (List: Array<MappingData>): Array<MappingNode> {
      const array: Array<MappingNode> = Array<MappingNode>()
      let counter = 1
      List.forEach((element) => {
        if (array.filter(x => x.name === element.group[0]).length === 0) {
          const newChildren: MappingNode = {
            id: counter,
            name: element.id
          }
          counter++
          const newNode: MappingNode = {
            id: counter,
            name: element.group[0],
            children: [
              newChildren
            ]
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
