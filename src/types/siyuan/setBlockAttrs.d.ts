// /api/attr/setBlockAttrs

export interface Attr {
    [key: string]: string | null;
}

export interface IPayload {
	id: string;
	attrs: Attr;
}

export interface IResponse {
	code: number;
	msg: string;
	data?: any;
}
