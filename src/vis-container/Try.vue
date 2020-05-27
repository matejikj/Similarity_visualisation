<template>
  <v-content>
    <v-container fluid fill-height>
      <v-row height="100px">
        pppp
      </v-row>
      <v-row height="100px">
        pppp
      </v-row>
      <v-row height="100px">
        pppp
      </v-row>
      <v-row height="100px">
        pppp
      </v-row>
      <v-row height="100px">
        pppp
      </v-row>
      <v-row height="100px">
        pppp
      </v-row>
      <v-row height="100px">
        pppp
      </v-row>
      <v-row height="100px">
        pppp
      </v-row>
      <v-row height="100px">
        pppp
      </v-row>
      <v-row height="100px">
        pppp
      </v-row>
      <v-row height="100px">
        pppp
      </v-row>
      <v-row height="100px">
        pppp
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
          @click="toggleView"
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
      </v-speed-dial>
    </v-container>
  </v-content>
</template>

<script>
import Vue from 'vue'
import { Position } from '../models/Position'
import AddPathDialog from '../common-components/AddPathDialog.vue'
import { Actions } from './Visualisation.store'
import { mapActions } from 'vuex'
import AddDatasetForm from '../common-components/AddDatasetForm.vue'

export default Vue.extend({
  name: 'VisContainer',
  components: {
    AddPathDialog,
    AddDatasetForm
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
  methods: {
    ...mapActions('visualisation', {
      createHierarchyForCircles: Actions.CREATE_HIERARCHY_FOR_CIRCLES,
      createHierarchyForTree: Actions.CREATE_HIERARCHY_FOR_TREE,
      updateCircleCanvas: Actions.UPDATE_CIRCLE_CANVAS,
      updateTreeCanvas: Actions.UPDATE_TREE_CANVAS
    }),
    pathsChanged: function (url) {
      this.$emit('pathsChanged', url)
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
      this.$emit('toggleView')
    },
    dialogClosed: function () {
      this.rightDialogDisplay = false
      this.leftDialogDisplay = false
    }
  }
})
</script>

<style>
.btn-nodes {
  font-size: 8;
}
</style>
