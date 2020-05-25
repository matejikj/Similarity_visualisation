<template>
  <v-content>
    <v-container fluid fill-height>
      <v-row class="text-center">
        <v-col cols="2">
          <side-bar
            @mappingChanged='mappingChanged'
            v-bind:sidebarPosition="left"
            @datasetChanged="leftDatasetChanged"
            v-bind:url="leftDatasetUrl"
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
            v-bind:url="rightDatasetUrl"
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
          <path-bar v-bind:url="paths"
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
  </v-content>
</template>

<script>
import Vue from 'vue'
import SideBar from './SideBar.vue'
import ValueSlider from '@/common-components/ValueSlider.vue'
import HistoryBar from './HistoryBar.vue'
import PathBar from '@/vis-container/PathBar.vue'
import CircleCanvas from './CircleVisualisation/CircleCanvas'
import TreeCanvas from './TreeVisualisation/TreeCanvas'
import { Position } from '../models/Position'
import AddPathDialog from '@/common-components/AddPathDialog.vue'
import { Actions, Mutations, createLabel } from './Visualisation.store'
import { mapActions, mapMutations } from 'vuex'
import AddDatasetForm from '@/common-components/AddDatasetForm.vue'
import { ROOT_LABEL, ROOT_ID } from '../models'
import Tutorial from '@/tutorial/TutorialDialog.vue'

export default Vue.extend({
  name: 'VisContainer',
  components: {
    ValueSlider,
    SideBar,
    HistoryBar,
    CircleCanvas,
    AddPathDialog,
    PathBar,
    AddDatasetForm,
    TreeCanvas,
    Tutorial
  },
  props: {
    leftDataset: undefined,
    rightDataset: undefined,
    paths: undefined
  },
  data: () => ({
    left: Position.Left,
    right: Position.Right,
    pathsVisible: false,
    leftDatasetUrl: '',
    rightDatasetUrl: '',
    leftDialogDisplay: false,
    rightDialogDisplay: false,
    fab: false,
    isCirclesViewActive: true
  }),
  watch: {
    leftDataset (newValue) {
      const position = Position.Left
      const dataset = this.leftDataset
      this.updateDataset({ dataset, position })
      if (this.isCirclesViewActive) {
        this.createHierarchyForCircles()
        this.updateCircleCanvas()
      } else {
        this.createHierarchyForTree()
        this.updateTreeCanvas()
      }
    },
    rightDataset (newValue) {
      const position = Position.Right
      const dataset = this.rightDataset
      this.updateDataset({ dataset, position })
      if (this.isCirclesViewActive) {
        this.createHierarchyForCircles()
        this.updateCircleCanvas()
      } else {
        this.createHierarchyForTree()
        this.updateTreeCanvas()
      }
    },
    paths (newValue) {
      this.updatePathsDataset(this.paths)
    }
  },
  mounted () {
    if (this.leftDataset !== undefined) {
      const position = Position.Left
      const dataset = this.leftDataset
      this.updateDataset({ dataset, position })
      if (this.isCirclesViewActive) {
        this.createHierarchyForCircles()
        this.updateCircleCanvas()
      } else {
        this.createHierarchyForTree()
        this.updateTreeCanvas()
      }
    }
    if (this.rightDataset !== undefined) {
      const position = Position.Right
      const dataset = this.rightDataset
      this.updateDataset({ dataset, position })
      if (this.isCirclesViewActive) {
        this.createHierarchyForCircles()
        this.updateCircleCanvas()
      } else {
        this.createHierarchyForTree()
        this.updateTreeCanvas()
      }
    }
    if (this.paths !== undefined) {
      this.updatePathsDataset(this.paths)
    }
  },
  methods: {
    ...mapActions('visualisation', {
      updatePathsDataset: Actions.UPDATE_PATHS_DATASET,
      updateDataset: Actions.UPDATE_DATASET,
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
    pathsChanged: function (url) {
      this.$emit('pathsChanged', url)
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
      this.$emit('leftDatasetChanged', url, collection)
    },
    rightDatasetChanged: async function (url, collection) {
      this.fab = false
      this.rightDialogDisplay = false
      this.$emit('rightDatasetChanged', url, collection)
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
})
</script>

<style>
.btn-nodes {
  font-size: 8;
}
</style>
