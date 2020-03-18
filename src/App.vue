<template>
  <v-app>
    <v-content>
      <v-row class="text-center">
        <v-col cols="2">
          <sidebar v-bind:sidebarPosition="left"></sidebar>
        </v-col>
        <v-col cols="8">
          <visualisation></visualisation>
        </v-col>
        <v-col cols="2">
          <sidebar v-bind:sidebarPosition="right"></sidebar>
        </v-col>
      </v-row>
      <v-row class="text-center">
        <v-col cols="3">
        </v-col>
        <v-col cols="6">
          <path-bar></path-bar>
        </v-col>
        <v-col cols="3">
        </v-col>
      </v-row>
      <v-row class="text-center">
        <v-col cols="3">
        </v-col>
        <v-col cols="6">
          <sliderBar></sliderBar>
        </v-col>
        <v-col cols="3">
        </v-col>
      </v-row>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Sidebar from './components/Sidebar.vue'
import SliderBar from './components/SliderBar.vue'
import PathBar from './components/PathBar.vue'
import Visualisation from './components/Visualisation.vue'
import { Position } from './models/types'

export default Vue.extend({
  name: 'App',
  components: {
    SliderBar,
    Sidebar,
    Visualisation,
    PathBar
  },
  data: () => ({
    left: Position.Left,
    right: Position.Right
  })
})
</script>
