/**
 * Eleemnt for choosing mapping
 */
export interface MappingNode {
    /**
     * Unique mapping node id
     */
    id: number;
    /**
     * Id of node
     */
    nodeID?: string;
    /**
     * Map by feature
     */
    mapBy?: string;
    /**
     * Name
     */
    name: string;
    /**
     * Children
     */
    children?: MappingNode[];
}
