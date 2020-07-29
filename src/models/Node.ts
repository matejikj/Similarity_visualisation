/**
 * Represent Wikidata entity in hierarchy for visualisation even with preddecesors and children array
 */
export class Node {
  /**
   * Label
   */
  label: string;
  /**
   * Array of parents
   */
  parents: Array<Node>;
  /**
   * Array of children
   */
  children: Array<Node>;
  /**
   * Unique node Id
   */
  id: string;
  /**
   * Key for view
   */
  key: number;
  /**
   * Color
   */
  color?: string;
  /**
   * Depth in actual hierarchy
   */
  depth?: number;
  /**
   * If the leaf has a value for the needs of d3 function for visualizationf
   */
  value?: number;
  /**
   * Is leaf?
   */
  isLeaf: boolean;

  /**
   * Create new node
   * @param label Label
   * @param parents Array of parents
   * @param children Array of children
   * @param id Unique id
   * @param key Unique key
   * @param depth Depth in hierarchy
   * @param color Color
   */
  constructor (label: string, parents: Array<Node>, children: Array<Node>, id: string, key: number, depth?: number, color?: string) {
    this.color = color
    this.depth = depth
    this.label = label
    this.parents = parents
    this.children = children
    this.id = id
    this.isLeaf = false
    this.key = key
  }
}
