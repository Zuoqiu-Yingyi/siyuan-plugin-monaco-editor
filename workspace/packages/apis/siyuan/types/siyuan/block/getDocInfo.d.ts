// /api/block/getDocInfo

export interface IPayload {
    id: string;
}

export interface Ial {
    [key: string]: string;
}

export interface Data {
	id: string;
	name: string;
	refCount: number;
	subFileCount: number;
	refIDs: any[];
	ial: Ial;
	icon: string;
}

export interface IResponse {
	code: number;
	msg: string;
	data: Data;
}
