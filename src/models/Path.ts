/**
 * Represent paths between datasets
 */
export class Path {
  /**
   * Start of path
   */
  from: string;
  /**
   * End of path
   */
  to: string;
  /**
   * Nodes within the path
   */
  vertices: Array<string>;
  /**
   * Number of climbs in the hierarchy
   */
  up: number;
  /**
   * Number of declines in the hierarchy
   */
  down: number;
  /**
   * The number of levels through which the path exists
   */
  height: number;
  /**
   * Signs of descent / ascent of the road
   */
  arrows: Array<string>;
  /**
   * Based on which the left entity is mapped
   */
  leftKeywords: string;
  /**
   * Based on which the right entity is mapped
   */
  rightKeywords: string;

  /**
   * Create new path
   * @param from Start of path
   * @param to End of path
   * @param vertices Nodes within the path
   * @param up Number of climbs in the hierarchy
   * @param down Number of declines in the hierarchy
   * @param height The number of levels through which the path exists
   * @param arrows Signs of descent / ascent of the road
   * @param leftKeywords Based on which the left entity is mapped
   * @param rightKeywords Based on which the right entity is mapped
   */
  constructor (from: string, to: string, vertices: Array<string>,
    up: number, down: number, height: number, arrows: Array<string>,
    leftKeywords: string, rightKeywords: string) {
    this.from = from
    this.to = to
    this.vertices = vertices
    this.up = up
    this.down = down
    this.height = height
    this.arrows = arrows
    this.leftKeywords = leftKeywords
    this.rightKeywords = rightKeywords
  }
}
