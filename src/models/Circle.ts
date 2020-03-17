export interface Circle {
    id: string;
    fill: string;
    label: string;
    isLeaf: boolean;
    depth: number;
    x: number;
    y: number;
    r: number;
    stroke: string;
    parent?: any;
  }
