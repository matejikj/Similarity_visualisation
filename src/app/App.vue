<template>
  <div id="app">
    <app-nav-bar/>
    <router-view/>
  </div>
</template>

<script>
import AppNavBar from '@/components/common/AppNavBar.vue'

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
