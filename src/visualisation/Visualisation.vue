<template>
  <v-content>
    <v-container fluid fill-height>
      <v-row class="text-center">
        <v-col cols="2">
          <side-bar
            @mappingChanged='mappingChanged'
            v-bind:sidebarPosition="left"
            @datasetChanged="leftDatasetChanged"
            v-bind:url="leftDataset"
          >
          </side-bar>
        </v-col>
        <v-col cols="8">
          <circle-canvas v-if="isCirclesViewActive"></circle-canvas>
          <tree-canvas v-if="!isCirclesViewActive"></tree-canvas>
        </v-col>
        <v-col cols="2">
          <side-bar @mappingChanged='mappingChanged'
            v-bind:sidebarPosition="right"
            @datasetChanged="rightDatasetChanged"
            v-bind:url="rightDataset"
          >
          </side-bar>
        </v-col>
      </v-row>
      <v-row v-if="isCirclesViewActive" class="text-center">
        <v-col cols="12">
          <History-bar></History-bar>
        </v-col>
      </v-row>
      <v-row v-if="isCirclesViewActive" class="text-center">
        <v-col cols="3">
        </v-col>
        <v-col cols="6">
          <value-slider></value-slider>
        </v-col>
        <v-col cols="2">
        </v-col>
        <v-col cols="1">
        </v-col>
      </v-row>
      <v-row class="text-center">
        <v-col cols="3">
        </v-col>
        <v-col cols="6">
          <path-bar v-bind:url="pathsDataset"
            @pathsChanged="pathsChanged"
            v-bind:isVisible="pathsVisible"
            @cancelClicked='cancelClicked'
            @pathUpdated='pathUpdated'
          >
          </path-bar>
        </v-col>
        <v-col cols="2">
        </v-col>
        <v-col cols="1">
        </v-col>
      </v-row>
      <v-speed-dial
        v-model="fab"
        absolute
        right
        bottom
      >
        <template v-slot:activator>
          <v-btn
            v-model="fab"
            color="blue darken-2"
            dark
            fab
          >
            <v-icon v-if="fab">mdi-close</v-icon>
            <v-icon v-else>mdi-menu</v-icon>
          </v-btn>
        </template>
        <add-path-dialog @pathsChanged="pathsChanged"></add-path-dialog>
        <v-dialog v-model="leftDialogDisplay" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn fab small color="primary" v-on="on">
              <v-icon>mdi-set-left</v-icon>
          </v-btn>
          </template>
          <add-dataset-form @datasetChanged="leftDatasetChanged" @dialogClosed="dialogClosed"></add-dataset-form>
        </v-dialog>
        <v-dialog v-model="rightDialogDisplay" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn fab small color="primary" v-on="on">
              <v-icon>mdi-set-right</v-icon>
          </v-btn>
          </template>
          <add-dataset-form @datasetChanged="rightDatasetChanged" @dialogClosed="dialogClosed"></add-dataset-form>
        </v-dialog>
        <v-btn
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
          fab
          dark
          small
          @click="viewCircles"
        >
          <v-icon>mdi-chart-bubble</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-container>
  </v-content>
</template>

<script>
import SideBar from './SideBar.vue'
import ValueSlider from '@/common-components/ValueSlider.vue'
import HistoryBar from './HistoryBar.vue'
import PathBar from '@/visualisation/PathBar.vue'
import CircleCanvas from './circle-canvas/CircleCanvas'
import TreeCanvas from './tree-canvas/TreeCanvas'
import { Position } from '../models/Position'
import AddPathDialog from '@/common-components/AddPathDialog.vue'
import { Actions, Mutations, createLabel } from './Visualisation.store'
import { mapActions, mapMutations } from 'vuex'
import AddDatasetForm from '@/common-components/AddDatasetForm.vue'
import { ROOT_LABEL, ROOT_ID } from '../models'

export default {
  name: 'Visualisation',
  components: {
    ValueSlider,
    SideBar,
    HistoryBar,
    CircleCanvas,
    AddPathDialog,
    PathBar,
    AddDatasetForm,
    TreeCanvas
  },
  data: () => ({
    left: Position.Left,
    right: Position.Right,
    leftDataset: undefined,
    rightDataset: undefined,
    pathsDataset: undefined,
    pathsVisible: false,
    leftDialogDisplay: false,
    rightDialogDisplay: false,
    fab: false,
    isCirclesViewActive: true
  }),
  created: function () {
    if (Array.isArray(this.$route.query.dataset)) {
      this.leftDataset = this.$route.query.dataset[0]
      this.rightDataset = this.$route.query.dataset[1]
    } else {
      if (this.$route.query.dataset !== undefined) {
        this.leftDataset = this.$route.query.dataset
      }
    }
    if (this.$route.query.paths !== undefined) {
      this.pathsDataset = this.$route.query.paths
    }
  },
  methods: {
    ...mapActions('visualisation', {
      fetchDataset: Actions.FETCH_DATASET,
      createHierarchyForCircles: Actions.CREATE_HIERARCHY_FOR_CIRCLES,
      createHierarchyForTree: Actions.CREATE_HIERARCHY_FOR_TREE,
      updateCircleCanvas: Actions.UPDATE_CIRCLE_CANVAS,
      updateTreeCanvas: Actions.UPDATE_TREE_CANVAS,
      selectPath: Actions.SELECT_PATH
    }),
    ...mapMutations('visualisation', {
      changeActivePath: Mutations.CHANGE_ACTIVE_PATH,
      changeRootId: Mutations.CHANGE_ROOT_ID,
      changePathNodes: Mutations.CHANGE_PATH_NODES,
      changeVisitedNodes: Mutations.CHANGE_VISITED_NODES,
      changeLeftMapping: Mutations.CHANGE_LEFT_MAPPING,
      changeRightMapping: Mutations.CHANGE_RIGHT_MAPPING
    }),
    pathsChanged: function () {
      this.fab = false
      this.pathsVisible = true
    },
    viewCircles: function () {
      this.isCirclesViewActive = true
      this.createHierarchyForCircles()
    },
    viewTree: function () {
      this.isCirclesViewActive = false
      this.createHierarchyForTree()
    },
    leftDatasetChanged: async function (url, collection) {
      this.fab = false
      this.leftDialogDisplay = false
      const position = Position.Left
      await this.fetchDataset({ url, collection, position })
      if (this.isCirclesViewActive) {
        this.createHierarchyForCircles()
        this.updateCircleCanvas()
      } else {
        this.createHierarchyForTree()
        this.updateTreeCanvas()
      }
    },
    rightDatasetChanged: async function (url, collection) {
      this.fab = false
      this.rightDialogDisplay = false
      const position = Position.Right
      await this.fetchDataset({ url, collection, position })
      if (this.isCirclesViewActive) {
        this.createHierarchyForCircles()
        this.updateCircleCanvas()
      } else {
        this.createHierarchyForTree()
        this.updateTreeCanvas()
      }
    },
    dialogClosed: function () {
      this.rightDialogDisplay = false
      this.leftDialogDisplay = false
    },
    mappingChanged: function () {
      if (this.isCirclesViewActive) {
        this.updateCircleCanvas()
      } else {
        this.updateTreeCanvas()
      }
    },
    cancelClicked: function () {
      this.changeLeftMapping([])
      this.changeRightMapping([])
      this.changeRootId(ROOT_ID)
      this.changeVisitedNodes([createLabel(ROOT_ID, ROOT_LABEL)])
      this.changePathNodes([])
      this.changeActivePath(undefined)
      if (this.isCirclesViewActive) {
        this.createHierarchyForCircles()
        this.updateCircleCanvas()
      } else {
        this.createHierarchyForTree()
        this.updateTreeCanvas()
      }
    },
    pathUpdated: function () {
      this.selectPath()
      if (this.isCirclesViewActive) {
        this.createHierarchyForCircles()
        this.updateCircleCanvas()
      } else {
        this.createHierarchyForTree()
        this.updateTreeCanvas()
      }
    }
  }
}
</script>

<style>
.btn-nodes {
  font-size: 8;
}
</style>
