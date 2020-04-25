export class Path {
  from: string;
  to: string;
  vertices: Array<string>;
  directions: Array<boolean>;
  up: number;
  down: number;
  height: number;

  constructor (from: string, to: string, vertices: Array<string>,
    directions: Array<boolean>, up: number, down: number, height: number) {
    this.from = from
    this.to = to
    this.vertices = vertices
    this.directions = directions
    this.up = up
    this.down = down
    this.height = height
  }
}
