<template>
  <v-content>
    <template v-for="(c, index) in circles">
      <v-btn v-bind:key="index" class="ma-2" @click="click(index)" outlined large fab color="black">
        {{ c }}
      </v-btn>
    </template>
  </v-content>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/app/store'

export default Vue.extend({
  name: 'HistoryBar',

  data: () => ({
  }),
  computed: {
    circles () {
      return store.getters.getCirclesPath
    }
  },
  methods: {
    zoomCircle () {
      const i = 1
    },
    // eslint-disable-next-line
    click: function (data) {
      console.log('AA')
    }
  }
})
</script>

<style>
.circle {
  cursor: pointer;
}
.labels {
  cursor: pointer;
  text-anchor: middle;
  pointer-events: none;
}
</style>
