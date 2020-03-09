// Model
export interface MappingData {
    id: string;
    group: string;
    shared: number;
    size: number;
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

export class Label {
    id: string;
    label: string;

    constructor (id: string, label: string) {
      this.id = id
      this.label = label
    }
}

export class Link {
    source: string;
    target: string;

    constructor (source: string, target: string) {
      this.source = source
      this.target = target
    }
}

export class Node {
    color: string | undefined;
    depth: number | undefined;
    label: string;
    parents: Array<Node>;
    children: Array<Node>;
    id: string;

    constructor (label: string, parents: Array<Node>, children: Array<Node>, id: string, depth: number | undefined, color: string | undefined) {
      this.color = color
      this.depth = depth
      this.label = label
      this.parents = parents
      this.children = children
      this.id = id
    }
}
