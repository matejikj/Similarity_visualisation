<template>
    <v-container>
        <v-slider @change="addDataset"></v-slider>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
// import store from '../store'

export default Vue.extend({
  name: 'SliderBar',

  data: () => ({
  }),
  methods: {
    addDataset: function (data: any) {
      this.$store.commit('changeViewDepth', data)
    }
  }
})
</script>
