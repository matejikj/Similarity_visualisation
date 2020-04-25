<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn v-if="display" color="primary" v-on="on">Add dataset</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Add dataset</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-autocomplete
              :items=collectionItems
              label="Collection"
            ></v-autocomplete>
          </v-row>
          <v-row>
            <v-col cols="12" sm="8" md="12">
              <v-text-field v-model="datasetUrl" label="URL" hint="Url of dataset"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="changeDataset">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AddDatasetDialog',

  data: () => ({
    collectionItems: ['hierarchy.v1', 'hierarchy.v2', 'hierarchy.v3', 'hierarchy.v3.reduced'],
    selectedMappingItems: [],
    datasetUrl: 'example.json',
    dialog: false,
    display: true
  }),
  computed: {
  },
  methods: {
    changeDataset: function (): void {
      this.dialog = false
      this.$emit('changeDataset', this.datasetUrl)
    }
  }
})
</script>
