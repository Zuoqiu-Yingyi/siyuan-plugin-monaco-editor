// /api/query/sql

export interface IPayload {
    stmt: string;
}

export interface Data {
    [key: string]: string;
}

export interface IResponse {
	code: number;
	msg: string;
	data: Data[];
}
