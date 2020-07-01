<template>
  <v-container fluid>
    <v-row>
      <vis-container
        v-bind:leftDataset="leftDataset"
        v-bind:rightDataset="rightDataset"
        v-bind:activeView="activeView"
        v-bind:labels="labels"
      >
      </vis-container>
    </v-row>
      <layout
        v-bind:pathsDataset="paths"
        v-bind:leftDataset="leftDataset"
        v-bind:rightDataset="rightDataset"
        v-bind:labels="labels"
        v-bind:activeView="activeView"
      >
    </layout>
    <v-row>
    </v-row>
    <custom-menu
      @datasetChanged="datasetChanged"
      @setTreeView="setTreeView"
      @setCircleView="setCircleView"
    ></custom-menu>
  </v-container>
</template>

<script lang='ts'>
import Vue from 'vue'
import Layout from './Layout.vue'
import VisContainer from './VisContainer.vue'
import axios from 'axios'
import CustomMenu from './CustomMenu.vue'
import { prepareLabels } from '../utils/nodesUtils'
import { Labels } from '@/models'
import { getDataset, datasets } from '../utils/dataset-api'

export default Vue.extend({
  name: 'VisMaster',
  components: {
    CustomMenu,
    Layout,
    VisContainer
  },
  data: () => ({
    leftDataset: undefined,
    rightDataset: undefined,
    paths: undefined,
    activeView: 1,
    labels: {}
  }),
  methods: {
    datasetChanged: async function (label: string) {
      const dataset = await getDataset(label)
      console.log(dataset)
      this.labels = prepareLabels(dataset.labels.labels)
      this.leftDataset = dataset.left
      this.rightDataset = dataset.right
      this.paths = dataset.defaultPath.paths
    },
    pathsDatasetChanged: function () {
      this.$emit('pathsDatasetChanged')
    },
    setTreeView: function () {
      this.activeView = 2
    },
    setCircleView: function () {
      this.activeView = 1
    }
  }
})
</script>
