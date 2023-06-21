// /api/search/fullTextSearchBlock

/* 块类型 */
export interface BlockTypes {
    heading: boolean; // 标题块
    paragraph: boolean; // 段落块
    mathBlock: boolean; // 公式块
    table: boolean; // 表格块
    codeBlock: boolean; // 代码块
    htmlBlock: boolean; // HTML 块
    embedBlock: boolean; // 嵌入块

    document: boolean; // 文档块
    superBlock: boolean; // 超级块
    blockquote: boolean; // 引述块
    list: boolean; // 列表块
    listItem: boolean; // 列表项
}

export interface IPayload {
    groupBy: GroupBy; // 搜索结果分组方案
    method: Method; // 搜索方案
    orderBy: OrderBy; // 搜索结果排序方案
    paths: string[]; // 指定搜索路径(以 *.sy 结尾不包含子文档)
    query: string; // 查询语句
    types: BlockTypes; // 搜索块类型
}

export interface Ial {
    [key: string]: string;
}

export interface Block {
    box: string;
    path: string;
    hPath: string;
    id: ID;
    rootID: ID;
    parentID: ID;
    name: string;
    alias: string;
    memo: string;
    tag: string;
    content: string;
    fcontent: string;
    markdown: string;
    folded: boolean;
    type: BlockType;
    subType: BlockSubType;
    refText: string;
    refs?: Block[];
    defID: ID;
    defPath: string;
    ial: Ial;
    children: Block[];
    depth: number;
    count: number;
    sort: number;
    created: string;
    updated: string;
}

export interface Data {
    blocks: Block[];
    matchedBlockCount: number;
    matchedRootCount: number;
}

export interface IResponse {
    code: number;
    msg: string;
    data: Data;
}
