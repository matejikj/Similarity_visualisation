<template>
    <v-select
      :items="comboboxItems"
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

export default Vue.extend({
  name: 'SelectList',

  data: () => ({
  }),
  computed: {
  },
  methods: {
  }
})
</script>
