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
    </v-container>
  </v-content>
</template>

<script>
import SideBar from './SideBar.vue'
import ValueSlider from '../components/ui/ValueSlider.vue'
import HistoryBar from './HistoryBar.vue'
import CircleCanvas from './CircleCanvas.vue'
import { Position } from '../models/Position'

export default {
  name: 'CircleVisualisation',
  components: {
    ValueSlider,
    SideBar,
    HistoryBar,
    CircleCanvas
  },
  data: () => ({
    left: Position.Left,
    right: Position.Right
  }),
  methods: {
  }
}
</script>
