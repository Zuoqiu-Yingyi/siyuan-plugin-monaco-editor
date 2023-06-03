// /api/filetree/searchDocs

export interface IPayload {
    k: string;
}

export interface Data {
    box: string;
    boxIcon: string;
    hPath: string;
    path: string;
}

export interface IResponse {
    code: number;
    msg: string;
    data: Data[];
}
