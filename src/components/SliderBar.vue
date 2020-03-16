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
  }),
  computed: {
    maximum () {
      return store.getters.getMaxDepth
    }
  },
  mounted () {
    this.$store.subscribe((mutation) => {
      switch (mutation.type) {
        case 'changeMaximalViewDepth':
          this.maximum = store.getters.getMaxDepth
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
