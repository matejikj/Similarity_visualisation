<template>
  <v-container v-if="isVisible">
    <v-row>
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
      <v-btn
        fab
        small
        relative
        bottom
        @click="cancelClicked"
      >
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </v-row>
    <p>Path nodes</p>
    <template v-for="(c, index) in pathNodes">
      <v-btn
        v-bind:content="`
          label: ${c.label}</br>
          id: ${c.id}
        `"
        v-tippy='{interactive : true, animateFill: false, placement:"left", animation:"shift-toward", delay:10, arrow : true}'
        v-bind:key="index"
        class="ma-2"
        @click="click(index)"
        fab
        v-bind:color="c.color"
      >
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
      updateCanvas: Actions.UPDATE_CANVAS,
      resetView: Actions.RESET_VIEW
    }),
    updatePath: function () {
      this.showPath()
      this.buildTree()
      this.updateCanvas()
    },
    cancelClicked: function () {
      store.commit('circleVisualisation/CHANGE_ACTIVE_PATH', '')
      this.resetView()
    }
  }
})
</script>
