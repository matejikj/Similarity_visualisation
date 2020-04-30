import { Relation } from './Relation'

export class Link {
  parent: string;
  child: string;
  relation: Relation;

  constructor (parent: string, child: string, relation: string) {
    this.parent = parent
    this.child = child
    this.relation = relation === 'subclass' ? Relation.SubClassOf : Relation.InstanceOf
  }
}
