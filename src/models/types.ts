export interface MappingData {
    id: string;
    group: string;
    shared: number;
    size: number;
}

export enum Position {
  Left, Right
}

export interface MappingNode {
    id: number;
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

export const MAX_DEPTH = 8
export const ROOT_LABEL = 'root'
export const ROOT_ID = 'root'
