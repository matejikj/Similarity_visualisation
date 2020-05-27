<template>
  <v-container>
      <try
        v-if="ano"
        @leftDatasetChanged="leftDatasetChanged"
        @rightDatasetChanged="rightDatasetChanged"
        @pathsChanged="pathsDatasetChanged"
        v-bind:leftDataset="leftDataset"
        v-bind:rightDataset="rightDataset"
        v-bind:paths="paths"
        @toggleView="toggleView"
      ></try>
      <vis-container
        v-if="!ano"
        @leftDatasetChanged="leftDatasetChanged"
        @rightDatasetChanged="rightDatasetChanged"
        @pathsDatasetChanged="pathsDatasetChanged"
        v-bind:leftDataset="leftDataset"
        v-bind:rightDataset="rightDataset"
        v-bind:pathsDataset="paths"
        v-bind:hierarchy="hierarchy"
        v-bind:labels="labels"
      >
      </vis-container>
  </v-container>
</template>

<script lang='ts'>
import Vue from 'vue'
import VisContainer from './VisContainer.vue'
import axios from 'axios'
import Try from './Try.vue'

export default Vue.extend({
  name: 'Root',
  components: {
    VisContainer,
    Try
  },
  created () {
    axios.get('hierarchy.json').then(
      response => {
        this.hierarchy = response.data.hierarchy
      },
      error => {
        this.error = error
      }
    )
    axios.get('labels.json').then(
      response => {
        this.labels = response.data.labels
      },
      error => {
        this.error = error
      }
    )
    // axios.get('dataset1.json').then(
    //   response => {
    //     this.leftDataset = response.data
    //   },
    //   error => {
    //     this.error = error
    //   }
    // )
    // axios.get('dataset1.json').then(
    //   response => {
    //     this.rightDataset = response.data
    //   },
    //   error => {
    //     this.error = error
    //   }
    // )
    // axios.get('paths-shortest.json').then(
    //   response => {
    //     this.paths = response.data.paths
    //   },
    //   error => {
    //     this.error = error
    //   }
    // )
  },
  data: () => ({
    error: Error(),
    leftDataset: undefined,
    rightDataset: undefined,
    paths: undefined,
    hierarchy: undefined,
    labels: undefined,
    ano: true
  }),
  methods: {
    toggleView: function () {
      this.ano = !this.ano
    },
    leftDatasetChanged: function (url) {
      axios.get(url).then(
        response => {
          this.leftDataset = response.data
        },
        error => {
          this.error = error
        }
      )
    },
    rightDatasetChanged: function (url) {
      axios.get(url).then(
        response => {
          this.rightDataset = response.data
        },
        error => {
          this.error = error
        }
      )
    },
    pathsDatasetChanged: function (url: string) {
      axios.get(url).then(
        response => {
          this.paths = response.data.paths
        },
        error => {
          this.error = error
        }
      )
    }
  }
})
</script>
