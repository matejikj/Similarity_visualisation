<template>
  <svg id="svg" ref="svg" width="100%" height="60vh">
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
</template>

<script lang="ts">
import Vue from 'vue'
import * as d3 from 'd3'
import TreeNode from './TreeNode.vue'
import TreeLink from './TreeLink.vue'
import TreeLabel from './TreeLabel.vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { Actions, Getters, Mutations, STORE_NAME } from '../Visualisation.store'
import { Circle, Position, ROOT_ID, ROOT_LABEL, MAX_TREE_DEPTH } from '../../models'
import { createHierarchy } from '../../utils/hierarchyUtils'

export default Vue.extend({
  name: 'TreeVisualisation',
  components: {
    TreeNode,
    TreeLink,
    TreeLabel
  },
  props: ['rightDataset', 'leftDataset', 'activeView', 'labels'],
  data: () => ({
    left: Position.Left,
    right: Position.Right
  }),
  computed: {
    ...mapGetters(STORE_NAME, {
      circles: Getters.GET_TREE_NODES,
      links: Getters.GET_TREE_LINKS,
      hierarchy: Getters.GET_HIERARCHY,
      nodes: Getters.GET_NODES,
      activePath: Getters.GET_ACTIVE_PATH
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

    this.updateVisualisation()

    const zoom = d3.zoom().on('zoom', this.zoomed)
    d3.select('#svg')
      // @ts-ignore
      .call(zoom)
  },
  watch: {
    rightDataset () {
      this.updateVisualisation()
    },
    leftDataset () {
      this.updateVisualisation()
    },
    circles () {
      if (this.activePath !== undefined) {
        const zoom = d3.zoom().on('zoom', this.zoomed)
        d3.select('#svg')
          .transition()
          .duration(750)
          .call(zoom.transform, d3.zoomIdentity)
      }
    }
  },
  methods: {
    ...mapActions(STORE_NAME, {
      resizeCanvas: Actions.RESIZE_CANVAS,
      appendNode: Actions.APPEND_NODE_TREE,
      cutChildren: Actions.CUT_NODE_TREE_CHILDREN,
      createHierarchyForTree: Actions.CREATE_HIERARCHY_FOR_TREE,
      updateTreeCanvas: Actions.UPDATE_TREE_CANVAS
    }),
    ...mapMutations(STORE_NAME, {
      changeLeftMapping: Mutations.CHANGE_LEFT_MAPPING,
      changeRightMapping: Mutations.CHANGE_RIGHT_MAPPING
    }),
    updateVisualisation: function () {
      this.createHierarchyForTree(MAX_TREE_DEPTH)
      this.updateTreeCanvas()
    },
    handleResize () {
      this.resizeCanvas({
        // @ts-ignore
        height: this.$refs.svg.clientHeight,
        // @ts-ignore
        width: this.$refs.svg.clientWidth
      })
      this.updateTreeCanvas()
    },
    nodeClicked (item: Circle) {
      if (item.isLeaf) {
        this.appendNode(item)
      } else {
        this.cutChildren(item)
      }
    },
    zoomed: function () {
      d3.selectAll('g')
        .attr('transform', d3.event.transform)
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

#svg {
  border: 1px solid gray;
}
</style>
