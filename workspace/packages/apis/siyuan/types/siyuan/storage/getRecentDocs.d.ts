// /api/storage/getRecentDocs

export interface Data {
    rootID: string;
    icon: string;
    title: string;
}

export interface IResponse {
    code: number;
    msg: string;
    data: Data[];
}
