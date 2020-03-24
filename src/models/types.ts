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
    name: string;
    children?: MappingNode[];
}

export class ComboboxItem {
    id: number;
    name: string;

    constructor (name: string, id: number) {
      this.name = name
      this.id = id
    }
}

export const MAX_DEPTH = 6
export const ROOT_LABEL = 'entity'
export const ROOT_ID = 'Q35120'
