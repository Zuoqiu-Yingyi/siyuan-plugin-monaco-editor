export type ID = string; // ID 类型

/* 响应体 */
export interface IResponse {
    code: number;
    msg: string;
    data: object | string | number | boolean | null;
}
