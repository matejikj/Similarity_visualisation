<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-row class="text-center">
          <v-col cols="2">
            <side-bar v-bind:sidebarPosition="left"></side-bar>
          </v-col>
          <v-col cols="8">
            <circle-visualisation></circle-visualisation>
          </v-col>
          <v-col cols="2">
            <side-bar v-bind:sidebarPosition="right"></side-bar>
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col cols="12">
            <history-bar></history-bar>
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
  </v-app>
</template>

<script>
import SideBar from '@/components/SideBar.vue'
import ValueSlider from '../components/base/ValueSlider.vue'
import HistoryBar from '../components/HistoryBar'
import CircleVisualisation from '@/components/d3/CircleVisualisation'
import { Position } from '../models/Position'

export default {
  name: 'CircleVisualisationView',
  components: {
    ValueSlider,
    SideBar,
    HistoryBar,
    CircleVisualisation
  },
  data: () => ({
    left: Position.Left,
    right: Position.Right
  }),
  methods: {
  }
}
</script>
