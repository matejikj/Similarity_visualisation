export class ArrowData {
    /**
     * Entity id where is arrow mapped to
     */
    id: string;
    /**
     * label of mapped entity
     */
    label: string;
    /**
     * Base feature for mapping
     */
    word?: string;

    /**
     * Create new ArrowData instance
     *
     * @param id id
     * @param label label of mapped entity
     */
    constructor (id: string, label: string) {
      this.id = id
      this.label = label
    }
}
