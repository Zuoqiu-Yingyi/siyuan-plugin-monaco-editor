// /api/filetree/renameDoc

export interface IPayload {
	notebook: string;
	path: string;
	title: string;
}

export interface IResponse {
	code: number;
	msg: string;
	data?: any;
}
