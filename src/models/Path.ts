import { ROOT_ID } from '../models/types'
import { Circle } from './Circle'
import { Node } from './Node'

export class Path {
    pathIds: Array<string> = [ROOT_ID];
    circles: Array<Circle> = [];

    public refreshPath (leaf: Circle): void {
      const array = Array<string>()
      array.push(leaf.id)
      let parent = leaf.parent
      while (parent !== null) {
        if (parent.data.id !== ROOT_ID) {
          array.push(parent.data.id)
        }
        parent = parent.parent
      }
      while (array.length !== 0) {
        const element = array.pop()
        if (element !== undefined) {
          this.pathIds.push(element)
        }
      }
      console.log(this.pathIds)
    }

    public createCircles (nodes: Array<Node>, width: number): void {
      const canvasWidth = width
      const rowCount = 10
      let actualRow = 0
      const circleMargin = 8
      const circleRadius = Math.floor((canvasWidth - (rowCount - 1) * 2 * circleMargin) / rowCount / 2)
      const pathRows = Math.floor(this.pathIds.length / rowCount)
      const pathMod = this.pathIds.length % rowCount

      for (let i = 0; i < pathRows; i++) {
        for (let j = 0; j < rowCount; j++) {
          const node = nodes.filter(p => p.id === this.pathIds[i * rowCount + j])[0]
          if (node.depth != null) {
            const circle: Circle = {
              x: j * 2 * circleMargin + j * 2 * circleRadius + circleRadius,
              y: i * 2 * circleRadius + i * 2 * circleMargin + circleRadius,
              r: circleRadius,
              id: this.pathIds[i * rowCount + j],
              label: node.label,
              depth: node.depth,
              fill: 'blue',
              stroke: 'black',
              isLeaf: false
            }
            this.circles.push(circle)
          }
        }
        actualRow += 1
      }

      for (let i = 0; i < pathMod; i++) {
        const node = nodes.filter(p => p.id === this.pathIds[actualRow * rowCount + i])[0]
        if (node.depth !== null) {
          const circle: Circle = {
            x: i * 2 * circleMargin + i * 2 * circleRadius + circleRadius,
            y: actualRow * 2 * circleRadius + 2 * actualRow * circleMargin + circleRadius,
            id: node.id,
            r: circleRadius,
            label: node.label,
            depth: node.depth,
            fill: 'blue',
            stroke: 'black',
            isLeaf: false
          }
          this.circles.push(circle)
        }
      }
    }
}
