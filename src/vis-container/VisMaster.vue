<template>
  <v-container>
    <vis-container
      v-bind:leftDataset="leftDataset"
      v-bind:rightDataset="rightDataset"
      v-bind:pathsDataset="paths"
      v-bind:hierarchy="hierarchy"
      v-bind:labels="labels"
      v-bind:isCirclesViewActive="isCirclesViewActive"
    >
    </vis-container>
    <v-speed-dial
      v-model="floatingActionBtnVisible"
      absolute
      right
      bottom
    >
      <template v-slot:activator>
        <v-btn
          v-model="floatingActionBtnVisible"
          color="blue darken-2"
          dark
          fab
        >
          <v-icon v-if="floatingActionBtnVisible">mdi-close</v-icon>
          <v-icon v-else>mdi-menu</v-icon>
        </v-btn>
      </template>
      <add-path-dialog @pathsDatasetChanged="pathsDatasetChanged"></add-path-dialog>
      <v-dialog v-model="leftDialogDisplay" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            small
            color="primary"
            v-on="on"
            v-bind:content="`Change left dataset`"
            v-tippy='{interactive : true, animateFill: false, placement:"right", animation:"shift-toward", delay:100, arrow : true}'
          >
            <v-icon>mdi-set-left</v-icon>
        </v-btn>
        </template>
        <add-dataset-form
          @datasetChanged="leftDatasetChanged"
          @dialogClosed="dialogClosed"
        >
        </add-dataset-form>
      </v-dialog>
      <v-dialog v-model="rightDialogDisplay" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            small
            color="primary"
            v-on="on"
            v-bind:content="`Change right dataset`"
            v-tippy='{interactive : true, animateFill: false, placement:"right", animation:"shift-toward", delay:100, arrow : true}'
          >
            <v-icon>mdi-set-right</v-icon>
        </v-btn>
        </template>
        <add-dataset-form @datasetChanged="rightDatasetChanged" @dialogClosed="dialogClosed"></add-dataset-form>
      </v-dialog>
      <v-btn
        v-bind:content="`Switch to tree view`"
        v-tippy='{interactive : true, animateFill: false, placement:"right", animation:"shift-toward", delay:100, arrow : true}'
        v-if="isCirclesViewActive"
        fab
        dark
        small
        @click="viewTree"
      >
        <v-icon>mdi-graph</v-icon>
      </v-btn>
      <v-btn
        v-if="!isCirclesViewActive"
        v-bind:content="`Switch to circle view`"
        v-tippy='{interactive : true, animateFill: false, placement:"right", animation:"shift-toward", delay:100, arrow : true}'
        fab
        dark
        small
        @click="viewCircles"
      >
        <v-icon>mdi-chart-bubble</v-icon>
      </v-btn>
      <tutorial></tutorial>
    </v-speed-dial>
  </v-container>
</template>

<script lang='ts'>
import Vue from 'vue'
import VisContainer from './VisContainer.vue'
import axios from 'axios'
import AddPathDialog from '../common-components/AddPathDialog.vue'
import AddDatasetForm from '../common-components/AddDatasetForm.vue'
import Tutorial from '../tutorial/TutorialDialog.vue'

export default Vue.extend({
  name: 'Root',
  components: {
    VisContainer,
    AddPathDialog,
    AddDatasetForm,
    Tutorial
  },
  // created () {
  //   axios.get('hierarchy.json').then(
  //     response => {
  //       this.hierarchy = response.data.hierarchy
  //     },
  //     error => {
  //       this.error = error
  //     }
  //   )
  //   axios.get('labels.json').then(
  //     response => {
  //       this.labels = response.data.labels
  //     },
  //     error => {
  //       this.error = error
  //     }
  //   )
  //   axios.get('dataset1.json').then(
  //     response => {
  //       this.leftDataset = response.data
  //     },
  //     error => {
  //       this.error = error
  //     }
  //   )
  //   axios.get('dataset1.json').then(
  //     response => {
  //       this.rightDataset = response.data
  //     },
  //     error => {
  //       this.error = error
  //     }
  //   )
  //   axios.get('paths-shortest.json').then(
  //     response => {
  //       this.paths = response.data.paths
  //     },
  //     error => {
  //       this.error = error
  //     }
  //   )
  // },
  data: () => ({
    error: Error(),
    leftDataset: undefined,
    rightDataset: undefined,
    paths: undefined,
    hierarchy: undefined,
    labels: undefined,
    isCirclesViewActive: true,
    leftDialogDisplay: false,
    rightDialogDisplay: false,
    floatingActionBtnVisible: false
  }),
  methods: {
    leftDatasetChanged: function (url) {
      this.$emit('leftDatasetChanged')
    },
    rightDatasetChanged: function (url) {
      this.$emit('rightDatasetChanged')
    },
    pathsDatasetChanged: function (url: string) {
      this.$emit('pathsDatasetChanged')
    },
    viewCircles: function () {
      this.isCirclesViewActive = true
    },
    viewTree: function () {
      this.isCirclesViewActive = false
    },
    dialogClosed: function () {
      this.rightDialogDisplay = false
      this.leftDialogDisplay = false
    }
  }
})
</script>
