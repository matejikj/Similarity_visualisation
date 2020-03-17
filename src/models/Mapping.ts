import { MappingNode, MappingData } from '../models/types'

export class Mapping {
    selectedMapping = 0;
    items: Array<MappingNode> = [];
    itemsList: Array<MappingNode> = [];
    selectedNodes = Array<string>();

    // eslint-disable-next-line
    public createMapping (mapping: any): void {
      const mappingDataArray = Array<MappingData>()
      for (let i = 0; i < mapping.mappings[this.selectedMapping].data.length; i++) {
        const newNode: MappingData = {
          id: mapping.mappings[this.selectedMapping].data[i].id,
          group: mapping.mappings[this.selectedMapping].data[i].metadata.group,
          size: mapping.mappings[this.selectedMapping].data[i].metadata.target_size,
          shared: mapping.mappings[this.selectedMapping].data[i].metadata.shared_size
        }
        mappingDataArray.push(newNode)
      }
      let counter = 1
      mappingDataArray.forEach(element => {
        if (this.items.filter(x => x.name === element.group[0]).length === 0) {
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
          this.itemsList.push(newNode)
          this.itemsList.push(newChildren)
          this.items.push(newNode)
        } else {
          const node = this.items.filter(x => x.name === element.group[0])[0]
          const newChildren: MappingNode = {
            id: counter,
            name: element.id
          }
          counter++
          this.itemsList.push(newChildren)
          if (node.children !== undefined) {
            node.children.push(newChildren)
          }
        }
      })
    }
}
