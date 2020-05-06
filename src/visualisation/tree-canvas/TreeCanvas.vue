<template>
  <v-container>
    <svg id="svg" ref="svg" width="100%" height="50vh">
      <g>
        <template v-for="(c, index) in links">
          <tree-link class="movable" v-bind:key="index" v-bind:linkData="c"></tree-link>
        </template>
      </g>
      <g>
        <template v-for="(c, index) in circles">
          <tree-node class="movable" @nodeClicked="nodeClicked" v-bind:key="index" v-bind:nodeData="c"></tree-node>
        </template>
      </g>
      <g>
        <template v-for="(c, index) in circles">
          <tree-label class="movable" @labelClicked='nodeClicked' v-bind:key="index" v-bind:labelData="c"></tree-label>
        </template>
      </g>
    </svg>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { Actions, Getters } from '../Visualisation.store'
import TreeNode from './TreeNode.vue'
import TreeLink from './TreeLink.vue'
import TreeLabel from './TreeLabel.vue'
import * as d3 from 'd3'
import { Circle } from '../../models'

export default Vue.extend({
  name: 'TreeCanvas',
  components: {
    TreeNode,
    TreeLink,
    TreeLabel
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters('visualisation', {
      circles: Getters.GET_TREE_NODES,
      links: Getters.GET_TREE_LINKS
    })
  },
  created () {
    window.addEventListener('resize', this.handleResize)
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  mounted () {
    this.resizeCanvas({
      // @ts-ignore
      height: this.$refs.svg.clientHeight,
      // @ts-ignore
      width: this.$refs.svg.clientWidth
    })

    const g = d3.selectAll('g')

    /* eslint-disable no-undef */
    // @ts-ignore
    const svg = d3.select('#svg')
      .call(d3.zoom().on('zoom', function () {
        g.attr('transform', d3.event.transform)
      }))
    /* eslint-enable no-undef */
    // 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')'
  },
  methods: {
    ...mapActions('visualisation', {
      resizeCanvas: Actions.RESIZE_CANVAS,
      appendNode: Actions.APPEND_NODE_TREE,
      cutChildren: Actions.CUT_NODE_TREE_CHILDREN
    }),
    handleResize () {
      this.resizeCanvas({
        // @ts-ignore
        height: this.$refs.svg.clientHeight,
        // @ts-ignore
        width: this.$refs.svg.clientWidth
      })
    },
    nodeClicked (item: Circle) {
      if (item.isLeaf) {
        this.appendNode(item)
      } else {
        this.cutChildren(item)
      }
      // const circles: Array<Circle> = this.circles
      // const circle: Circle = circles.filter(x => x.key === item.key)[0]
      // const g = d3.selectAll('g')
      //   .attr('transform', function (d) {
      //     return 'translate(' + item.y + ',' + item.x + ')'
      //   })
    }
  }
})
</script>

<style>
.circle {
  cursor: pointer;
  text-decoration: underline;
}
.tree-labels {
  cursor: pointer;
  text-anchor: middle;
  pointer-events: none;
}
</style>
