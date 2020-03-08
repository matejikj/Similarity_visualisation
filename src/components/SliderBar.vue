<template>
    <v-container>
        <v-slider></v-slider>
        <v-combobox></v-combobox>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '../store'

export default Vue.extend({
  name: 'SliderBar',

  data: () => ({
    myText: ''
  })
})
</script>
