<template>
  <v-content>
    <v-container fluid fill-height>
      <v-row class="text-center">
        <v-col cols="2">
          <side-bar v-bind:sidebarPosition="left"></side-bar>
        </v-col>
        <v-col cols="8">
          <circle-canvas></circle-canvas>
        </v-col>
        <v-col cols="2">
          <side-bar v-bind:sidebarPosition="right"></side-bar>
        </v-col>
      </v-row>
      <v-row class="text-center">
        <v-col cols="12">
          <History-bar></History-bar>
        </v-col>
      </v-row>
      <v-row class="text-center">
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
          <path-bar></path-bar>
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
            <v-icon v-else>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <add-path-dialog></add-path-dialog>
      </v-speed-dial>
    </v-container>
  </v-content>
</template>

<script>
import SideBar from './SideBar.vue'
import ValueSlider from '@/common-components/ValueSlider.vue'
import HistoryBar from './HistoryBar.vue'
import PathBar from '@/circle-visualisation/PathBar.vue'
import CircleCanvas from './CircleCanvas.vue'
import { Position } from '../models/Position'
import AddPathDialog from '@/common-components/AddPathDialog.vue'

export default {
  name: 'CircleVisualisation',
  components: {
    ValueSlider,
    SideBar,
    HistoryBar,
    CircleCanvas,
    AddPathDialog,
    PathBar
  },
  data: () => ({
    left: Position.Left,
    right: Position.Right,
    fab: false
  }),
  methods: {
  }
}
</script>
