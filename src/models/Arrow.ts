/**
 * Model slouzici k vizualizaci sipek, ktere zobrazuji kam se mapoji jednotlive slova
 */
export class Arrow {
  /** unique id of this arrow */
  id: number;
  /** slovo, na zaklade, ktereho se mapuje */
  word?: string;
  /** do ktere entity se mapuje */
  mapTo?: string;
  /** left x-coordiante */
  lx: number;
  /** left y-coordiante */
  ly: number;
  /** right x-coordiante */
  rx: number;
  /** right y-coordiante */
  ry: number;
  /** radius of circle, where arrows smeruej */
  r: number;

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
