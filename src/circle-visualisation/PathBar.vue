<template>
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
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Getters, Mutations, Actions } from './CircleVisualisation.store'
import { Path } from '../models'
import store from '../app/store'

export default Vue.extend({
  name: 'PathBar',

  data: () => ({
  }),
  computed: {
    ...mapGetters('circleVisualisation', {
      paths: Getters.GET_PATHS
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
  methods: {
    ...mapActions('circleVisualisation', {
      showPath: Actions.SHOW_PATH
    }),
    updatePath: function () {
      this.showPath()
    }
  }
})
</script>
