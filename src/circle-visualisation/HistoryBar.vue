<template>
  <v-content>
    <template v-for="(c, index) in circles">
      <v-btn v-bind:key="index" class="ma-2" @click="click(index)" outlined large fab color="black">
        {{ c.label }}
      </v-btn>
    </template>
  </v-content>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/app/store'
import { Getters, Mutations, Actions } from './CircleVisualisation.store'
import { mapGetters, mapActions } from 'vuex'
import { Label } from '../models'

export default Vue.extend({
  name: 'HistoryBar',

  data: () => ({
  }),
  computed: {
    ...mapGetters('circleVisualisation', {
      circles: Getters.GET_CIRCLES_PATH,
      labels: Getters.GET_LABELS
    })
  },
  methods: {
    ...mapActions('circleVisualisation', {
      updatePath: Actions.UPDATE_PATH
    }),
    click: function (data: Label) {
      this.updatePath(data)
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
