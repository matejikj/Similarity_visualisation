<template>
  <v-treeview
    v-model="selectedMappingItems"
    class="overflow-y-auto"
    :items="this.mappingItems"
    selectable
    @input="selectedTreeItemsHandle"
  />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: '',

  data: () => ({
  }),
  computed: {
  },
  methods: {
  }
})
</script>
