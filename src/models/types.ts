// Model
export interface MappingData {
    id: string;
    group: string;
    shared: number;
    size: number;
}

export interface MappingNode {
    id: number;
    name: string;
    children?: MappingNode[];
}
