<template>
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
    </v-container>
</template>

<script>
import Vue from 'vue'
import SideBar from './SideBar.vue'
import ValueSlider from '../common-components/ValueSlider.vue'
import HistoryBar from './HistoryBar.vue'
import PathBar from '../vis-container/PathBar.vue'
import CircleCanvas from './CircleVisualisation/CircleCanvas'
import TreeCanvas from './TreeVisualisation/TreeCanvas'
import { Position } from '../models/Position'
import { Actions, Mutations, Getters } from './Visualisation.store'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { ROOT_LABEL, ROOT_ID } from '../models'
import { addMappingItemToArray, createNodes, createLabel } from '../utils/nodesUtils'
import { createMapping } from '../utils/hierarchyUtils'
import { createPaths } from '../utils/pathUtils'

export default Vue.extend({
  name: 'VisContainer',
  components: {
    ValueSlider,
    SideBar,
    HistoryBar,
    CircleCanvas,
    PathBar,
    TreeCanvas
  },
  props: {
    leftDataset: undefined,
    rightDataset: undefined,
    pathsDataset: undefined,
    labels: {
      type: Object
    },
    hierarchy: undefined,
    isCirclesViewActive: undefined
  },
  data: () => ({
    left: Position.Left,
    right: Position.Right,
    paths: undefined,
    pathsVisible: false,
    leftMappingTree: undefined,
    rightMappingTree: undefined
  }),
  computed: {
    ...mapGetters('visualisation', {
      nodes: Getters.GET_NODES
    })
  },
  watch: {
    leftDataset () {
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
    rightDataset () {
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
    pathsDataset () {
      this.updatePaths()
    },
    hierarchy () {
      this.initializeNodes()
      if (this.isCirclesViewActive) {
        this.createHierarchyForCircles()
        this.updateCircleCanvas()
      } else {
        this.createHierarchyForTree()
        this.updateTreeCanvas()
      }
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
    if (this.hierarchy !== undefined) {
      this.initializeNodes()
      if (this.isCirclesViewActive) {
        this.createHierarchyForCircles()
        this.updateCircleCanvas()
      } else {
        this.createHierarchyForTree()
        this.updateTreeCanvas()
      }
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
    toggleView: function () {
      if (this.isCirclesViewActive) {
        this.createHierarchyForCircles()
        this.updateCircleCanvas()
      } else {
        this.createHierarchyForTree()
        this.updateTreeCanvas()
      }
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
