/**
 * Represent vizualized node
 */
export class Circle {
  /**
   * Circle id
   */
  id: string;
  /**
   * Unique key
   */
  key: number;
  /**
   * Colour of fill
   */
  fill?: string;
  /**
   * Appropriate path
   */
  pathNr?: number;
  /**
   * Stroke width
   */
  strokewidth?: string;
  /**
   * Stroke colour
   */
  stroke?: string;
  /**
   * Node label
   */
  label: string;
  /**
   * Is leaf?
   */
  isLeaf: boolean;
  /**
   * Depth of node in actual view
   */
  depth: number;
  /**
   * x-coordinate
   */
  x: number;
  /**
   * r-coordinate
   */
  y: number;
  /**
   * radius
   */
  r: number;
  /**
   * Predecessor in hierarhcy
   */
  // eslint-disable-next-line
  parent?: any;

  /**
   * Create new circle
   * @param id Circle id
   * @param label Node label
   * @param isLeaf Is leaf?
   * @param depth Depth in actual hierarchy
   * @param x x-coordinate
   * @param y y-coordinate
   * @param r radius
   * @param key unique key in view
   */
  constructor (id: string, label: string, isLeaf: boolean, depth: number, x: number, y: number, r: number, key: number) {
    this.id = id
    this.label = label
    this.isLeaf = isLeaf
    this.depth = depth
    this.x = x
    this.y = y
    this.r = r
    this.key = key
  }
}
