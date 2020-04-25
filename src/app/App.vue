<template>
  <div id="app">
    <v-app dark>
      <app-nav-bar/>
      <router-view/>
    </v-app>
  </div>
</template>

<script>
import AppNavBar from '@/common-components/AppNavBar.vue'

export default {
  name: 'app',
  components: {
    AppNavBar
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
