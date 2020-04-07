export class Node {
  label: string;
  parents: Array<Node>;
  children: Array<Node>;
  id: string;
  color: string | null;
  depth: number | null;
  value?: number;
  isLeaf: boolean;

  constructor (label: string, parents: Array<Node>, children: Array<Node>, id: string, depth: number | null, color: string | null) {
    this.color = color
    this.depth = depth
    this.label = label
    this.parents = parents
    this.children = children
    this.id = id
    this.isLeaf = false
  }
}
