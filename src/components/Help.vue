<template>
    <v-container>
      <v-speed-dial
        v-model="fab"
        :top="top"
        :bottom="bottom"
        :right="right"
        :left="left"
        :direction="direction"
        :open-on-hover="hover"
        :transition="transition"
      >
        <template v-slot:activator>
          <v-btn
            v-model="fab"
            color="blue darken-2"
            dark
            fab
          >
            <v-icon v-if="fab">mdi-close</v-icon>
            <v-icon v-else>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-btn
          fab
          dark
          small
          color="green"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="indigo"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="red"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-speed-dial>
      <v-dialog
        v-model="dialog"
        max-width="700"
      >
        <v-card
            elevation="24"
            max-width="700"
            class="mx-auto"
            >
            <v-system-bar lights-out></v-system-bar>
            <v-carousel
                :continuous="false"
                :cycle="cycle"
                :show-arrows="false"
                hide-delimiter-background
                delimiter-icon="mdi-minus"
                height="500"
            >
                <v-carousel-item
                v-for="(slide, i) in slides"
                :key="i"
                >
                <v-sheet
                    :color="colors[i]"
                    height="100%"
                    tile
                >
                    <v-row
                    class="fill-height"
                    align="center"
                    justify="center"
                    >
                    <div class="display-3">{{ slide }} Slide</div>
                    </v-row>
                </v-sheet>
                </v-carousel-item>
            </v-carousel>
            <v-list two-line>
                <v-list-item>
                <v-list-item-avatar>
                    <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title>Jakub Matejik</v-list-item-title>
                    <v-list-item-subtitle>Author</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                    <v-switch
                    v-model="cycle"
                    label="Cycle Slides"
                    inset
                    ></v-switch>
                </v-list-item-action>
                </v-list-item>
            </v-list>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/store'

export default Vue.extend({
  name: 'Help',

  data: () => ({
    colors: [
      'indigo',
      'warning',
      'pink darken-2',
      'red lighten-1',
      'deep-purple accent-4'
    ],
    cycle: false,
    slides: [
      'First',
      'Second',
      'Third',
      'Fourth',
      'Fifth'
    ]
  }),
  computed: {
    dialog: {
      get () {
        return store.getters.getDialog
      },
      set (value) {
        this.$store.dispatch('toggleDialog')
      }
    }
  },
  methods: {
  }
})
</script>
