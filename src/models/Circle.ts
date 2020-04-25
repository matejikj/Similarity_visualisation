export class Circle {
    id: string;
    fill?: string;
    pathNr?: number;
    label: string;
    isLeaf: boolean;
    depth: number;
    x: number;
    y: number;
    r: number;
    parent?: any;

    constructor (id: string, label: string, isLeaf: boolean, depth: number, x: number, y: number, r: number) {
      this.id = id
      this.label = label
      this.isLeaf = isLeaf
      this.depth = depth
      this.x = x
      this.y = y
      this.r = r
    }
}
