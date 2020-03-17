<template>
    <v-container>
        <v-slider v-bind:min="minimum" v-bind:max="maximum" @change="changeDepth"></v-slider>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '../store'

export default Vue.extend({
  name: 'SliderBar',

  data: () => ({
    minimum: 1
  }),
  computed: {
    maximum () {
      return store.getters.getMaxDepth
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
