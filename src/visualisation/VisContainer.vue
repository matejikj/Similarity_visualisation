<template>
  <v-container>
    <v-row>
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
        <circle-visualisation
          v-bind:leftDataset="leftDataset"
          v-bind:rightDataset="rightDataset"
          v-if="activeView === 1"
        ></circle-visualisation>
        <tree-visualisation
          v-bind:leftDataset="leftDataset"
          v-bind:rightDataset="rightDataset"
          v-if="activeView === 2"
        ></tree-visualisation>
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
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { Position, MappingNode } from '../models'
import { Actions, Mutations, Getters, STORE_NAME } from './Visualisation.store'
import { addMappingItemToArray } from '../utils/nodesUtils'
import { createMapping } from '../utils/hierarchyUtils'
import SideBar from './Layout/SideBar.vue'
import CircleVisualisation from './CircleVisualisation/CircleVisualisation.vue'
import TreeVisualisation from './TreeVisualisation/TreeVisualisation.vue'

export default Vue.extend({
  name: 'VisContainer',
  components: {
    SideBar,
    CircleVisualisation,
    TreeVisualisation
  },
  props: ['rightDataset', 'leftDataset', 'activeView'],
  data: () => ({
    left: Position.Left,
    right: Position.Right,
    leftMappingTree: Array<MappingNode>(),
    rightMappingTree: Array<MappingNode>()
  }),
  computed: {
    ...mapGetters(STORE_NAME, {
      labels: Getters.GET_LABELS
    })
  },
  mounted () {
    this.createLabelsAndHierarchy()
  },
  watch: {
    leftDataset () {
      this.createLabelsAndHierarchy()
      const position = Position.Left
      const dataset = this.leftDataset
      this.updateMappingsCombobox(dataset, position)
    },
    rightDataset () {
      this.createLabelsAndHierarchy()
      const position = Position.Right
      const dataset = this.rightDataset
      this.updateMappingsCombobox(dataset, position)
    }
  },
  methods: {
    ...mapActions(STORE_NAME, {
      updateCircleCanvas: Actions.UPDATE_CIRCLE_CANVAS,
      createHierarchyForCircles: Actions.CREATE_HIERARCHY_FOR_CIRCLES,
      createHierarchyForTree: Actions.CREATE_HIERARCHY_FOR_TREE,
      updateTreeCanvas: Actions.UPDATE_TREE_CANVAS
    }),
    ...mapMutations(STORE_NAME, {
      changeLeftMappingList: Mutations.CHANGE_LEFT_MAPPING_LIST,
      changeRightMappingList: Mutations.CHANGE_RIGHT_MAPPING_LIST,
      changeLeftMapping: Mutations.CHANGE_LEFT_MAPPING,
      changeRightMapping: Mutations.CHANGE_RIGHT_MAPPING,
      changeHierarchy: Mutations.CHANGE_HIERARCHY,
      changeLabels: Mutations.CHANGE_LABELS
    }),
    updateVisualisation: function () {
      if (this.activeView === 1) {
        this.updateCircleCanvas()
      }
      if (this.activeView === 2) {
        this.updateTreeCanvas()
      }
    },
    createLabelsAndHierarchy: function () {
      let hierarchyArray = []
      if (this.leftDataset !== undefined) {
        hierarchyArray = hierarchyArray.concat(this.leftDataset.hierarchy)
      }
      if (this.rightDataset !== undefined) {
        hierarchyArray = hierarchyArray.concat(this.rightDataset.hierarchy)
      }
      let labelsArray = {}
      if (this.leftDataset !== undefined) {
        labelsArray = { ...labelsArray, ...this.leftDataset.labels }
      }
      if (this.rightDataset !== undefined) {
        labelsArray = { ...labelsArray, ...this.rightDataset.labels }
      }
      this.changeHierarchy(hierarchyArray)
      this.changeLabels(labelsArray)
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
      this.updateVisualisation()
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
    }
  }
})
</script>

<style>
.circle {
  cursor: pointer;
  text-decoration: underline;
}
.labels {
  cursor: pointer;
  text-anchor: middle;
  pointer-events: none;
}
</style>
