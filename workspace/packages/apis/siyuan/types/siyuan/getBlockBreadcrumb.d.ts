// /api/block/getBlockBreadcrumb

export interface IPayload {
    id: string;
    excludeTypes: BlockType[];
}

export interface Data {
    id: ID;
    name: string;
    type: BlockType;
    subType: BlockSubType;
    children?: Data[];
}

export interface IResponse {
    code: number;
    msg: string;
    data: Data[];
}
