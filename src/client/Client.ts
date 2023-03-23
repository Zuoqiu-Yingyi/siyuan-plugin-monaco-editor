import fullTextSearchBlock from "../types/siyuan/fullTextSearchBlock";
import getBlockAttrs from "./../types/siyuan/getBlockAttrs";
import getBlockBreadcrumb from "./../types/siyuan/getBlockBreadcrumb";
import getBookmarkLabels from "./../types/siyuan/getBookmarkLabels";
import getConf from "./../types/siyuan/getConf";
import getDocInfo from "./../types/siyuan/getDocInfo";
import getRecentDocs from "./../types/siyuan/getRecentDocs";
import listDocsByPath from "./../types/siyuan/listDocsByPath";
import lsNotebooks from "./../types/siyuan/lsNotebooks";
import renameDoc from "./../types/siyuan/renameDoc";
import searchDocs from "./../types/siyuan/searchDocs";
import setBlockAttrs from "./../types/siyuan/setBlockAttrs";
import siyuan from "./../types/siyuan/siyuan";
import sql from "./../types/siyuan/sql";
import version from "./../types/siyuan/version";

export class Client {

    public readonly method: string = "POST"; // 请求方法
    public readonly headers: {
        Authorization: string;
        [propName: string]: string;
    }; // 请求头

    constructor(
        public url: URL = new URL(globalThis.location.origin),
        public token: string = "",
    ) {
        this.headers = {
            Authorization: `Token ${this.token}`,
        };
    }

    /* 更新配置 */
    public update(
        url: URL,
        token: string,
    ) {
        this.url = url;
        this.token = token;
        this.headers.Authorization = `Token ${this.token}`;
    }

    /* 获取块属性 */
    public async getBlockAttrs(payload: getBlockAttrs.IPayload): Promise<getBlockAttrs.IResponse> {
        const response = await this._request("/api/attr/getBlockAttrs", payload) as getBlockAttrs.IResponse;
        return response;
    }

    /* 获取所有书签 */
    public async getBookmarkLabels(): Promise<getBookmarkLabels.IResponse> {
        const response = await this._request("/api/attr/getBookmarkLabels") as getBookmarkLabels.IResponse;
        return response;
    }

    /* 设置块属性 */
    public async setBlockAttrs(payload: setBlockAttrs.IPayload): Promise<setBlockAttrs.IResponse> {
        const response = await this._request("/api/attr/setBlockAttrs", payload) as setBlockAttrs.IResponse;
        return response;
    }

    /* 获得指定块的面包屑 */
    public async getBlockBreadcrumb(payload: getBlockBreadcrumb.IPayload): Promise<getBlockBreadcrumb.IResponse> {
        const response = await this._request("/api/block/getBlockBreadcrumb", payload) as getBlockBreadcrumb.IResponse;
        return response;
    }

    /* 获得指定块所在文档信息 */
    public async getDocInfo(payload: getDocInfo.IPayload): Promise<getDocInfo.IResponse> {
        const response = await this._request("/api/block/getDocInfo", payload) as getDocInfo.IResponse;
        return response;
    }

    /* 查询子文档 */
    public async listDocsByPath(payload: listDocsByPath.IPayload): Promise<listDocsByPath.IResponse> {
        const response = await this._request("/api/filetree/listDocsByPath", payload) as listDocsByPath.IResponse;
        return response;
    }

    /* 文档重命名 */
    public async renameDoc(payload: renameDoc.IPayload): Promise<renameDoc.IResponse> {
        const response = await this._request("/api/filetree/renameDoc", payload) as renameDoc.IResponse;
        return response;
    }

    /* 搜索文档 */
    public async searchDocs(payload: searchDocs.IPayload): Promise<searchDocs.IResponse> {
        const response = await this._request("/api/filetree/searchDocs", payload) as searchDocs.IResponse;
        return response;
    }

    /* 列出笔记本信息 */
    public async lsNotebooks(): Promise<lsNotebooks.IResponse> {
        const response = await this._request("/api/notebook/lsNotebooks") as lsNotebooks.IResponse;
        return response;
    }

    /* SQL 查询 */
    public async sql(payload: sql.IPayload): Promise<sql.IResponse> {
        const response = await this._request("/api/query/sql", payload) as sql.IResponse;
        return response;
    }

    /* 全局搜索 */
    public async fullTextSearchBlock(payload: fullTextSearchBlock.IPayload): Promise<fullTextSearchBlock.IResponse> {
        const response = await this._request("/api/search/fullTextSearchBlock", payload) as fullTextSearchBlock.IResponse;
        return response;
    }

    /* 查询最近打开的文档 */
    public async getRecentDocs(): Promise<getRecentDocs.IResponse> {
        const response = await this._request("/api/storage/getRecentDocs") as getRecentDocs.IResponse;
        return response;
    }

    /* 获得配置 */
    public async getConf(): Promise<getConf.IResponse> {
        const response = await this._request("/api/system/getConf") as getConf.IResponse;
        return response;
    }

    /* 获得内核版本 */
    public async version(): Promise<version.IResponse> {
        const response = await this._request("/api/system/version") as version.IResponse;
        return response;
    }

    protected async _request(
        pathname: string,
        payload: object = {},
    ): Promise<siyuan.IResponse> {
        this.url.pathname = pathname;
        let response;

        try {
            response = await fetch(
                this.url.href,
                {
                    body: JSON.stringify(payload),
                    method: this.method,
                    headers: this.headers,
                },
            );
        } catch (error) {
            throw error;
        }

        if (response.ok) {
            const body: siyuan.IResponse = await response.json();

            if (body.code === 0) {
                return body;
            }
            else {
                const error = new Error(body.msg);
                throw error;
            }
        }
        else {
            const error = new Error(response.statusText);
            throw error;
        }
    }
}
