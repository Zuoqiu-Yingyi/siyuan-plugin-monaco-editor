// /api/notebook/lsNotebooks

export interface Notebook {
    id: string;
    name: string;
    icon: string;
    sort: number;
    closed: boolean;
}

export interface Data {
    notebooks: Notebook[];
}

export interface IResponse {
    code: number;
    msg: string;
    data: Data;
}
