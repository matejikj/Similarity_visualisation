<template>
  <v-card>
      <v-card-title>
        <span class="headline">Add dataset</span>
      </v-card-title>
      <p>Choose between two pairs ready for this demo or visit <a href="http://skoda.projekty.ms.mff.cuni.cz/dataset-similarity/#/visualisation">ODIN</a></p>
      <v-card-text>
        <v-container>
          <v-row>
            <v-combobox
              v-model="collection"
              :items="collectionItems"
              label="Collection"
            />
          </v-row>
          <v-row>
            <v-combobox
              v-model="dataset"
              :items="datasetItems"
              label="Collection"
            />
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialogClosed">Close</v-btn>
        <v-btn color="blue darken-1" text @click="datasetChanged">Add</v-btn>
      </v-card-actions>
    </v-card>
</template>

<script>
import { datasets } from '../utils/dataset-api'

export default {
  name: 'AddDatasetForm',

  computed: {
    datasetItems: function () {
      return datasets.map(item => item.label)
    }
  },
  data: () => ({
    collectionItems:
      ['v1'
      ],
    collection: 'v1',
    dataset: ''
  }),
  methods: {
    datasetChanged: function () {
      this.dialog = false
      this.$emit('datasetChanged', this.dataset, this.collection)
    },
    dialogClosed: function () {
      this.$emit('dialogClosed')
    }
  }
}
</script>

<style>

</style>
