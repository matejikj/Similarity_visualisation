/**
 * Item for combobox to select mapping base
 */
export class ComboboxItem {
  /**
   * unique mapping id
   */
  id: number;
  /**
   * name of method to mapping
   */
  name: string;

  /**
   * Create new item
   * @param name name of method to mapping
   * @param id unique id of method in list
   */
  constructor (name: string, id: number) {
    this.name = name
    this.id = id
  }
}
