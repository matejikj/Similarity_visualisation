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
        v-bind:pathsDataset="selectedPath"
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
      @pathsChanged="pathsDatasetChanged"
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
import { datasets } from '../../data/'

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
    paths: {
      defaultPath: undefined,
      rulePath: undefined,
      directedPath: undefined,
      finalPath: undefined
    },
    selectedPath: undefined,
    activeView: 1,
    labels: {},
    datasetAdded: false,
    pathsChoice: 'default'
  }),
  methods: {
    datasetChanged: function (label: string) {
      const dataset = datasets.filter(x => x.label === label)[0].data
      // @ts-ignore
      this.labels = prepareLabels(dataset.labels.labels)
      // @ts-ignore
      this.leftDataset = dataset.left
      // @ts-ignore
      this.rightDataset = dataset.right
      this.paths = {
        // @ts-ignore
        defaultPath: dataset.default.paths,
        // @ts-ignore
        rulePath: dataset.rule.paths,
        // @ts-ignore
        directedPath: dataset.directed.paths,
        // @ts-ignore
        finalPath: dataset.final.paths
      }
      this.changePath()
      this.datasetAdded = true
    },
    pathsDatasetChanged: function (label: string) {
      this.pathsChoice = label
      if (this.datasetAdded) {
        this.changePath()
      }
    },
    setTreeView: function () {
      this.activeView = 2
    },
    setCircleView: function () {
      this.activeView = 1
    },
    changePath: function () {
      switch (this.pathsChoice) {
        case 'default':
          this.selectedPath = this.paths.defaultPath
          break
        case 'default + rule':
          this.selectedPath = this.paths.rulePath
          break
        case 'default + rule + directed':
          this.selectedPath = this.paths.directedPath
          break
        case 'default + rule + directed + max length':
          this.selectedPath = this.paths.finalPath
          break
      }
    }
  }
})
</script>
