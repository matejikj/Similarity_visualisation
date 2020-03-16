<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>
    </v-app-bar>
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
import Visualisation from './components/Visualisation.vue'
import { Position } from './models/types'

export default Vue.extend({
  name: 'App',
  components: {
    SliderBar,
    Sidebar,
    Visualisation
  },
  data: () => ({
    left: Position.Left,
    right: Position.Right
  })
})
</script>
