/**
 * A model used to visualize arrows that show where individual words are mapped
 */
export class Arrow {
  /** unique id of this arrow */
  id: number;
  /** word, based on which it is mapped */
  word?: string;
  /** to which entity is mapped */
  mapTo?: string;
  /** left x-coordinate */
  lx: number;
  /** left y-coordinate */
  ly: number;
  /** right x-coordinate */
  rx: number;
  /** right y-coordinate */
  ry: number;
  /** radius of circle, where arrows point */
  r: number;

  /**
   * @param id id
   * @param lx left x-coordinate
   * @param ly left y-coordinate
   * @param rx right x-coordinate
   * @param ry right y-coordinate
   * @param r radius of circle
   * @param word mapping based word
   * @param mapTo label of entity where it is mapped to
   */
  constructor (id: number, lx: number, ly: number, rx: number, ry: number, r: number, word?: string, mapTo?: string) {
    this.id = id
    this.lx = lx
    this.ly = ly
    this.rx = rx
    this.ry = ry
    this.r = r
    this.word = word
    this.mapTo = mapTo
  }
}
