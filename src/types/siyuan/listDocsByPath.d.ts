/// api/filetree/listDocsByPath

export interface IPayload {
    notebook: string;
    path: string;
    sort: number;
}

export interface File {
    path: string;
    name: string;
    icon: string;
    name1: string;
    alias: string;
    memo: string;
    bookmark: string;
    id: string;
    count: number;
    size: number;
    hSize: string;
    mtime: number;
    ctime: number;
    hMtime: string;
    hCtime: string;
    sort: SortMode;
    subFileCount: number;
}

export interface Data {
    box: string;
    files: File[];
    path: string;
}

export interface IResponse {
    code: number;
    msg: string;
    data: Data;
}
