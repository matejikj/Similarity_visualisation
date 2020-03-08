<template>
    <p></p>
</template>

<script lang="ts">
import Vue from 'vue'
import * as d3 from 'd3'
import store from '../store'

export default Vue.extend({
  name: 'Visualisation',

  data: () => ({
    myText: {}
  }),
  mounted () {
    this.$store.subscribe((mutation) => {
      switch (mutation.type) {
        case 'changeLeftDataset':
          // Update your component with new state data
          //  visualise()
          console.log('LEFT')
          break
        case 'changeRightDataset':
          // ahoj
          console.log('RIGHT')
          break
      }
    })
  },
  methods: {
    // visualise: function (leftData) {

    // }
  }
})
</script>
