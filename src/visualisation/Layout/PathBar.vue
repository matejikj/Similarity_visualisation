<template>
  <v-container>
    <v-row>
      <v-select
        v-model="select"
        :items="paths"
        label="Select"
        return-object
        @change="pathUpdated"
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
        class="btn-help ma-2"
        fab
        v-bind:color="c.color"
      >
        {{ c.label.length > 5 ? c.label.substring(0, 5) + ".." : c.label }}
      </v-btn>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { Getters, Actions } from '../Visualisation.store'
import store from '../../app/store'

export default Vue.extend({
  name: 'PathBar',

  data: () => ({
  }),
  props: {
    paths: {}
  },
  computed: {
    ...mapGetters('visualisation', {
      pathNodes: Getters.GET_PATH_NODES
    }),
    select: {
      get () {
        return store.getters['visualisation/GET_ACTIVE_PATH']
      },
      set (value) {
        store.commit('visualisation/CHANGE_ACTIVE_PATH', value)
      }
    }
  },
  methods: {
    ...mapActions('visualisation', {
    }),
    pathUpdated: function () {
      this.$emit('pathUpdated')
    },
    cancelClicked: function () {
      this.$emit('cancelClicked')
    }
  }
})
</script>

<style>
.btn-help {
  text-transform: none;
}
</style>
