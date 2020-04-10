<template>
  <v-container>
    <v-slider
      v-bind:min="minimum"
      v-bind:value="depth"
      v-bind:max="maximum"
      @change="changeDepth"
      :thumb-size="24"
      thumb-label="always"
      :color=color
    >
    </v-slider>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '../../store'

export default Vue.extend({
  name: 'ValueSlider',

  data: () => ({
    minimum: 1,
    color: '#009DFF'
  }),
  computed: {
    maximum () {
      return store.getters.getMaxDepth
    },
    depth () {
      return store.getters.getDepth
    }
  },
  methods: {
    // eslint-disable-next-line
    changeDepth: function (data: any) {
      this.$store.commit('changeDepth', data)
      this.$store.dispatch('buildTree')
    }
  }
})
</script>
