// /api/attr/getBlockAttrs

export interface IPayload {
	id: string;
}
export interface Data {
    [key: string]: string;
}

export interface IResponse {
	code: number;
	msg: string;
	data: Data;
}
