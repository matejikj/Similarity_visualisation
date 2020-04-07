<template>
    <v-select
      :items="value"
      item-text="name"
      label="add url"
      single-line
      return-object
      @change="changeMapping"
      >
    </v-select>
</template>

<script lang="ts">
import Vue from 'vue'
import { MappingNode, Link } from '../../models'

export default Vue.extend({
  name: 'SelectList',

  props: {
    value: {
      type: Array
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data: () => ({
  }),
  computed: {
  },
  methods: {
    changeMapping: function (data: any): void {
      console.log('aAA')
    }
  }
})
</script>
