import { MappingNode, MappingData } from '../models/types'

export class Mapping {
    selectedMapping = 0;
    dataArray: Array<MappingData> = [];
    nodeArray: Array<MappingNode> = [];
    nodeTree: Array<MappingNode> = [];
    selectedNodes = Array<string>();

    public createMappingArray (id: number, mapping: any): void {
      const array = Array<MappingData>()
      for (let i = 0; i < mapping.mappings[id].data.length; i++) {
        const newNode: MappingData = {
          id: mapping.mappings[id].data[i].id,
          group: mapping.mappings[id].data[i].metadata.group,
          size: mapping.mappings[id].data[i].metadata.target_size,
          shared: mapping.mappings[id].data[i].metadata.shared_size
        }
        array.push(newNode)
      }
      this.dataArray = array
    }

    /**
     * createMappingTree
     */
    public createMappingTree () {
      console.log('createMappingTree')
    }

    public createTree (list: Array<MappingData>): void {
      const array: Array<MappingNode> = Array<MappingNode>()
      let counter = 1
      list.forEach(element => {
        if (array.filter(x => x.name === element.group[0]).length === 0) {
          const newChildren: MappingNode = {
            id: counter,
            name: element.id
          }
          counter++
          const newNode: MappingNode = {
            id: counter,
            name: element.group[0],
            children: [newChildren]
          }
          counter++
          this.nodeArray.push(newChildren)
          this.nodeArray.push(newNode)
          array.push(newNode)
        } else {
          const node = array.filter(x => x.name === element.group[0])[0]
          const newChildren: MappingNode = {
            id: counter,
            name: element.id
          }
          counter++
          this.nodeArray.push(newChildren)
          if (node.children !== undefined) {
            node.children.push(newChildren)
          }
        }
      })
      this.nodeTree = array
    }
}
