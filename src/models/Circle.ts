export interface Circle {
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
  }
