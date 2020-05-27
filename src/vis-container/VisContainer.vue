<template>
  <v-content>
    <v-container fluid fill-height>
      <v-row class="text-center">
        <v-col cols="2">
          <side-bar
            @mappingChoosed="mappingChoosed"
            @mappingChanged="mappingChanged"
            v-bind:mappingList="leftMappingTree"
            v-bind:sidebarPosition="left"
          >
          </side-bar>
        </v-col>
        <v-col cols="8">
          <circle-canvas @circleClicked="circleClicked" v-if="isCirclesViewActive"></circle-canvas>
          <tree-canvas v-if="!isCirclesViewActive"></tree-canvas>
        </v-col>
        <v-col cols="2">
          <side-bar
            @mappingChoosed="mappingChoosed"
            @mappingChanged="mappingChanged"
            v-bind:mappingList="rightMappingTree"
            v-bind:sidebarPosition="right"
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
          <path-bar
            v-bind:paths="paths"
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
import { Actions, Mutations, Getters } from './Visualisation.store'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import AddDatasetForm from '@/common-components/AddDatasetForm.vue'
import { ROOT_LABEL, ROOT_ID, Label, Node } from '../models'
import Tutorial from '@/tutorial/TutorialDialog.vue'
import { addMappingItemToArray, createNodes, mapLinks, createLabel } from '@/utils/nodesUtils'
import { createMapping } from '@/utils/hierarchyUtils'
import { createPaths } from '@/utils/pathUtils'

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
    pathsDataset: undefined,
    labels: {
      type: Object
    },
    hierarchy: undefined
  },
  data: () => ({
    left: Position.Left,
    right: Position.Right,
    paths: undefined,
    pathsVisible: false,
    leftDialogDisplay: false,
    rightDialogDisplay: false,
    floatingActionBtnVisible: false,
    isCirclesViewActive: true,
    leftMappingTree: undefined,
    rightMappingTree: undefined
  }),
  computed: {
    ...mapGetters('visualisation', {
      nodes: Getters.GET_NODES
    })
  },
  watch: {
    leftDataset (newValue) {
      const position = Position.Left
      const dataset = this.leftDataset
      this.updateMappingsCombobox(dataset, position)
      this.initializeNodes()
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
      this.updateMappingsCombobox(dataset, position)
      this.initializeNodes()
      if (this.isCirclesViewActive) {
        this.createHierarchyForCircles()
        this.updateCircleCanvas()
      } else {
        this.createHierarchyForTree()
        this.updateTreeCanvas()
      }
    },
    pathsDataset (newValue) {
      this.updatePaths()
    }
  },
  mounted () {
    if (this.leftDataset !== undefined) {
      this.updateMappingsCombobox(this.leftDataset, Position.Left)
      this.initializeNodes()
      if (this.isCirclesViewActive) {
        this.createHierarchyForCircles()
        this.updateCircleCanvas()
      } else {
        this.createHierarchyForTree()
        this.updateTreeCanvas()
      }
    }
    if (this.rightDataset !== undefined) {
      this.updateMappingsCombobox(this.rightDataset, Position.Right)
      this.initializeNodes()
      if (this.isCirclesViewActive) {
        this.createHierarchyForCircles()
        this.updateCircleCanvas()
      } else {
        this.createHierarchyForTree()
        this.updateTreeCanvas()
      }
    }
    if (this.pathsDataset !== undefined) {
      this.updatePaths()
    }
  },
  methods: {
    ...mapActions('visualisation', {
      createHierarchyForCircles: Actions.CREATE_HIERARCHY_FOR_CIRCLES,
      createHierarchyForTree: Actions.CREATE_HIERARCHY_FOR_TREE,
      updateCircleCanvas: Actions.UPDATE_CIRCLE_CANVAS,
      updateTreeCanvas: Actions.UPDATE_TREE_CANVAS,
      selectPath: Actions.SELECT_PATH,
      initPathNodes: Actions.INIT_PATH_NODES,
      addNodeToPath: Actions.ADD_NODE_TO_VISITED_NODES
    }),
    ...mapMutations('visualisation', {
      changeActivePath: Mutations.CHANGE_ACTIVE_PATH,
      changeRootId: Mutations.CHANGE_ROOT_ID,
      changePathNodes: Mutations.CHANGE_PATH_NODES,
      changeVisitedNodes: Mutations.CHANGE_VISITED_NODES,
      changeLeftMapping: Mutations.CHANGE_LEFT_MAPPING,
      changeRightMapping: Mutations.CHANGE_RIGHT_MAPPING,
      changeLeftMappingList: Mutations.CHANGE_LEFT_MAPPING_LIST,
      changeRightMappingList: Mutations.CHANGE_RIGHT_MAPPING_LIST,
      changeNodes: Mutations.CHANGE_NODES
    }),
    updatePaths: function () {
      this.pathsVisible = true
      this.paths = createPaths(this.nodes, this.pathsDataset, this.labels)
      this.changeActivePath(undefined)
    },
    pathsChanged: function (url) {
      this.$emit('pathsDatasetChanged', url)
      this.fab = false
      this.pathsVisible = true
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
    viewCircles: function () {
      this.isCirclesViewActive = true
      this.createHierarchyForCircles()
    },
    viewTree: function () {
      this.isCirclesViewActive = false
      this.createHierarchyForTree()
    },
    dialogClosed: function () {
      this.rightDialogDisplay = false
      this.leftDialogDisplay = false
    },
    mappingChoosed: function (position, id) {
      switch (position) {
        case Position.Left:
          this.leftMappingTree = createMapping(this.labels, this.leftDataset, id)
          break
        case Position.Right:
          this.rightMappingTree = createMapping(this.labels, this.rightDataset, id)
          break
      }
    },
    mappingChanged: function (position, array) {
      switch (position) {
        case Position.Left:
          this.changeLeftMapping(array)
          break
        case Position.Right:
          this.changeRightMapping(array)
          break
      }
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
      this.selectPath(this.labels)
      if (this.isCirclesViewActive) {
        this.createHierarchyForCircles()
        this.updateCircleCanvas()
      } else {
        this.createHierarchyForTree()
        this.updateTreeCanvas()
      }
    },
    updateMappingsCombobox: function (dataset, position) {
      const result = []
      dataset.mappings.forEach((element, i) => {
        addMappingItemToArray(result, element, i)
      })
      switch (position) {
        case Position.Left:
          this.changeLeftMappingList(result)
          break
        case Position.Right:
          this.changeRightMappingList(result)
          break
      }
    },
    initializeNodes: function () {
      this.changeRootId(ROOT_ID)
      this.changeActivePath(undefined)
      if (!this.labels[ROOT_ID]) {
        this.labels[ROOT_ID] = ROOT_LABEL
      }
      this.changeNodes(createNodes(this.hierarchy, this.labels))
      this.changeVisitedNodes([createLabel(ROOT_ID, ROOT_LABEL)])
      this.initPathNodes()
    },
    circleClicked: function (leaf) {
      const labels = this.labels
      this.addNodeToPath({ labels, leaf })
      this.createHierarchyForCircles()
      this.updateCircleCanvas()
    }
  }
})
</script>

<style>
.btn-nodes {
  font-size: 8;
}
</style>
