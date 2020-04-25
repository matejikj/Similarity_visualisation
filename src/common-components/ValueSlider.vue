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
import store from '@/app/store'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { Mutations, Actions, Getters } from '@/circle-visualisation/CircleVisualisation.store'

export default Vue.extend({
  name: 'ValueSlider',

  data: () => ({
    minimum: 1,
    color: '#009DFF'
  }),
  computed: {
    ...mapGetters('circleVisualisation', {
      maximum: Getters.GET_MAX_DEPTH,
      depth: Getters.GET_DEPTH
    })
  },
  methods: {
    ...mapMutations('circleVisualisation', {
      changeDepth: Mutations.CHANGE_DEPTH
    }),
    ...mapActions('circleVisualisation', {
      buildTree: Actions.BUILD_TREE,
      updateCanvas: Actions.UPDATE_CANVAS
    }),
    // eslint-disable-next-line
    handleDepthChange: function (data: any) {
      this.changeDepth(data)
      this.buildTree()
      this.updateCanvas()
    }
  }
})
</script>
