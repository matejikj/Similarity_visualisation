<template>
  <v-container v-if="isVisible">
    <v-select
      v-model="select"
      :items="paths"
      label="Select"
      return-object
      @change="updatePath"
    >
      <template slot="selection" slot-scope="data">
        {{ data.item.from }} to {{ data.item.to }}
      </template>
      <template slot="item" slot-scope="data">
        {{ data.item.from }} to {{ data.item.to }}
      </template>
    </v-select>
    <p>Path nodes</p>
    <template v-for="(c, index) in pathNodes">
      <v-btn v-bind:key="index" class="ma-2" @click="click(index)" fab v-bind:color="c.color">
        {{ c.label }}
      </v-btn>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { Getters, Actions } from './CircleVisualisation.store'
import store from '../app/store'

export default Vue.extend({
  name: 'PathBar',

  data: () => ({
  }),
  props: {
    url: String,
    isVisible: Boolean
  },
  computed: {
    ...mapGetters('circleVisualisation', {
      paths: Getters.GET_PATHS,
      pathNodes: Getters.GET_PATH_NODES
    }),
    select: {
      get () {
        return store.getters['circleVisualisation/GET_ACTIVE_PATH']
      },
      set (value) {
        store.commit('circleVisualisation/CHANGE_ACTIVE_PATH', value)
      }
    }
  },
  mounted: function () {
    if (this.url !== undefined) {
      store.dispatch('circleVisualisation/FETCH_PATHS_DATASET', this.url)
      this.$emit('pathsChanged')
    }
  },
  methods: {
    ...mapActions('circleVisualisation', {
      showPath: Actions.SELECT_PATH,
      buildTree: Actions.BUILD_TREE,
      updateCanvas: Actions.UPDATE_CANVAS
    }),
    updatePath: function () {
      this.showPath()
      this.buildTree()
      this.updateCanvas()
    }
  }
})
</script>
