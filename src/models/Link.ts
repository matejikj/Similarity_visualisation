import { Relation } from './types'

export class Link {
  parent: string;
    relation: Relation;
    child: string;

    constructor (parent: string, child: string, relation: string) {
      this.parent = parent
      this.child = child
      switch (relation) {
        case 'subclass':
          this.relation = Relation.Subclass
          break
        case 'instanceof':
          this.relation = Relation.Instance
          break
        default:
          this.relation = Relation.Instance
          break
      }
    }
}
