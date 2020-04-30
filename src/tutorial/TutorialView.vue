<template>
  <v-container>
    <v-card
      flat
      elevation="24"
      max-width="720"
      class="mx-auto"
    >
      <v-carousel
        cycle
        hide-delimiter-background
        show-arrows-on-hover
      >
        <v-carousel-item>
          <v-img
            class="black--text align-end"
            src="@/tutorial/img/AddDataset.png"
          >
          </v-img>

          <v-card-subtitle class="pb-0">Adding dataset</v-card-subtitle>

          <v-card-text class="text--primary">
            <div>Lorem ipsum</div>
          </v-card-text>
        </v-carousel-item>
        <v-carousel-item>
          <v-img
            class="black--text align-end"
            src="@/tutorial/img/ViewHierarchy.png"
          >
          </v-img>

          <v-card-subtitle class="pb-0">View Hierarchy</v-card-subtitle>

          <v-card-text class="text--primary">
            <div>Lorem ipsum</div>
          </v-card-text>
        </v-carousel-item>
        <v-carousel-item>
          <v-img
            class="black--text align-end"
            src="@/tutorial/img/ShowMapping.png"
          >
          </v-img>

          <v-card-subtitle class="pb-0">Show Mapping</v-card-subtitle>

          <v-card-text class="text--primary">
            <div>Lorem ipsum</div>
          </v-card-text>
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Tutorial',

  data: () => ({
  }),
  computed: {
  },
  methods: {
  }
})
</script>
