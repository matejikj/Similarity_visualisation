<template>
    <v-container>
        <v-slider v-bind:max="maximum" @change="addDataset"></v-slider>
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
    maximum: Number()
  }),
  mounted () {
    this.$store.subscribe((mutation) => {
      switch (mutation.type) {
        case 'changeMaximalViewDepth':
          this.maximum = store.state.maximalViewDepth
          break
      }
    })
  },
  methods: {
    addDataset: function (data: any) {
      this.$store.commit('changeActiveViewDepth', data + 1)
    }
  }
})
</script>
