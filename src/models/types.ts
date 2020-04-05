export interface MappingData {
    id: string;
    group: string;
    shared: number;
    size: number;
}

export enum Position {
  Left, Right
}

export enum Relation {
  Subclass, Instance
}

export interface MappingNode {
    id: number;
    nodeID?: string;
    mapBy?: string;
    name: string;
    children?: MappingNode[];
}

export interface ArrowData {
  id: string;
  label: string;
  word?: string;
}

export interface PathNode {
  id: number;
  name: string;
}

export class ComboboxItem {
    id: number;
    name: string;

    constructor (name: string, id: number) {
      this.name = name
      this.id = id
    }
}
