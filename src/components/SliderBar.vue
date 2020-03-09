<template>
    <v-container>
        <v-slider min="1" v-bind:max="maximum" @change="addDataset"></v-slider>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '../store'
import { mapState } from 'vuex'
// import store from '../store'

export default Vue.extend({
  name: 'SliderBar',

  data: () => ({
    maximum: 10
  }),
  computed: mapState(['maximalViewDepth']),
  watch: {
    maximalViewDepth (newValue, oldValue) {
      this.maximum = newValue
    }
  },
  methods: {
    addDataset: function (data: any) {
      this.$store.commit('changeActiveViewDepth', data)
    }
  }
})
</script>
