<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn
        v-bind:content="`Change paths`"
        v-tippy='{interactive : true, animateFill: false, placement:"right", animation:"shift-toward", delay:100, arrow : true}'
        fab
        dark
        small
        v-on="on"
        color="indigo"
      >
        <v-icon>mdi-graphql</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Add paths</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-combobox
              v-model="collection"
              :items="collectionItems"
              label="Collection"
            />
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="changePaths">Change</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AddPathsDialog',

  data: () => ({
    selectedMappingItems: [],
    dialog: false,
    display: true,
    collectionItems:
      [
        'default',
        'default + rule',
        'default + rule + directed',
        'default + rule + directed + max length'
      ],
    collection: ''
  }),
  computed: {
  },
  methods: {
    changePaths: function () {
      this.dialog = false
      this.$emit('pathsDatasetChanged', this.collection)
    }
  }
})
</script>
