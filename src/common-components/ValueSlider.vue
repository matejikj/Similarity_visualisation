<template>
  <v-container>
    <v-slider
      v-bind:min="minimum"
      v-bind:value="depth"
      v-bind:max="maximum"
      @change="handleDepthChange"
      :thumb-size="24"
      thumb-label="always"
      :color=color
    >
    </v-slider>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { Mutations, Actions, Getters } from '@/visualisation/Visualisation.store'

export default Vue.extend({
  name: 'ValueSlider',

  data: () => ({
    minimum: 1,
    color: '#009DFF'
  }),
  computed: {
    ...mapGetters('visualisation', {
      maximum: Getters.GET_MAX_DEPTH,
      depth: Getters.GET_DEPTH
    })
  },
  methods: {
    ...mapMutations('visualisation', {
      changeDepth: Mutations.CHANGE_DEPTH
    }),
    ...mapActions('visualisation', {
      createHierarchyForCircles: Actions.CREATE_HIERARCHY_FOR_CIRCLES,
      updateCircleCanvas: Actions.UPDATE_CIRCLE_CANVAS
    }),
    // eslint-disable-next-line
    handleDepthChange: function (data: any) {
      this.changeDepth(data)
      this.createHierarchyForCircles()
      this.updateCircleCanvas()
    }
  }
})
</script>
