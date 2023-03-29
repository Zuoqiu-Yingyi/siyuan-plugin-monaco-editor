import { Parser } from "./../utils/export"

export interface IRow {
    key: string; // 属性名
    activate: boolean; // 是否导出
    _key?: string; // 导出的属性名
    parser?: Parser; // 自定义属性使用的解析器
}

export interface IConfig {
    rows: IRow[]; // 表格行状态
    retain: boolean; // 是否在导出时保留
}
