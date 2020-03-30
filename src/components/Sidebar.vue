<template>
  <v-container>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn v-if="display" color="primary" dark v-on="on">Add dataset</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Add dataset</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-autocomplete
                  :items=collectionItems
                  label="Collection"
                ></v-autocomplete>
              </v-row>
              <v-row>
                <v-col cols="12" sm="8" md="12">
                  <v-text-field v-model="datasetUrl" label="URL" hint="Url of dataset"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="addDataset">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
        class="overflow-y-auto"
        :items="this.mappingItems"
        selectable
        @input="selectedTreeItemsHandle"
        />
  </v-container>
</template>

<script lang='ts'>
import Vue from 'vue'
import { ComboboxItem, Position, MappingNode } from '../models/types'
import axios from 'axios'
import store from '../store'

export default Vue.extend({
  name: 'Sidebar',

  props: {
    sidebarPosition: {
    }
  },
  data: () => ({
    collectionItems: ['hierarchy.v1', 'hierarchy.v2', 'hierarchy.v3', 'hierarchy.v3.reduced'],
    selectedMappingItems: [],
    comboboxItems: Array<ComboboxItem>(),
    datasetUrl: 'example.json',
    error: Error(),
    dialog: false,
    display: true
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
      const array = Array<MappingNode>()
      if (this.$props.sidebarPosition === Position.Left) {
        data.forEach(element => {
          const node = store.state.leftMapping.itemsList.filter(x => x.id === element)[0]
          if (node !== undefined) {
            array.push(node)
          }
        })
        this.$store.commit('changeLeftSelectedMappingNodes', array)
      }
      if (this.$props.sidebarPosition === Position.Right) {
        data.forEach(element => {
          const node = store.state.rightMapping.itemsList.filter(x => x.id === element)[0]
          if (node !== undefined) {
            array.push(node)
          }
        })
        this.$store.commit('changeRightSelectedMappingNodes', array)
      }
      this.$store.dispatch('paintArrows', this.$props.sidebarPosition)
    },
    addDataset: function (): void {
      this.dialog = false
      this.display = false
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
          store.dispatch('resetMapping', this.$props.sidebarPosition)
          this.$store.dispatch('createHierarchy')
          this.$store.dispatch('createLabels')
          this.$store.dispatch('initializeNodes')
          this.$store.dispatch('paintCircles')
          this.$store.dispatch('resetActivePath')
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
      store.dispatch('resetMapping', this.$props.sidebarPosition)
      store.dispatch('createMapping', this.$props.sidebarPosition)
    }
  }
})
</script>
