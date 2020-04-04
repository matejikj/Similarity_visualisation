<template>
    <v-container>
        <v-slider
          v-bind:min="minimum"
          v-bind:value="activeDepth"
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
import store from '../store'

export default Vue.extend({
  name: 'SliderBar',

  data: () => ({
    minimum: 1,
    val: 25,
    color: '#009DFF'
  }),
  computed: {
    maximum () {
      return store.getters.getMaxDepth
    },
    activeDepth () {
      return store.getters.getViewDepth
    }
  },
  methods: {
    // eslint-disable-next-line
    changeDepth: function (data: any) {
      this.$store.dispatch('changeViewDepth', data)
      this.$store.dispatch('repaintArrows')
    }
  }
})
</script>
