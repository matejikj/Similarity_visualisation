export class MappingNode {
    id: number;
    nodeID?: string;
    mapBy?: string;
    name: string;
    children?: MappingNode[];

    constructor (id: number, name: string) {
      this.id = id
      this.name = name
    }
}
