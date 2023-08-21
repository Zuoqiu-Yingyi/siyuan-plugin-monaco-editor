/**
 * Copyright (C) 2023 Zuoqiu Yingyi
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import moment from "@workspace/utils/date/moment";
import JSONL from "@/utils/jsonl";

import type { Client } from "@siyuan-community/siyuan-sdk";
import type { Heartbeats } from "@/types/wakatime";

export type TCacheDatum = Heartbeats.IAction | Heartbeats.IAction[];

export type TCache<T> = {
    [P in keyof Array<T>]?: Array<T>[P];
}

export class WakaTimeCache<T extends Object = TCacheDatum> implements TCache<T> {
    /**
     * 构造缓存文件名
     * @param date 时间日期
     * @param format 时间日期格式化字符串
     * REF: https://momentjs.com/docs/#/parsing/string-format/
     * @param extension 文件扩展名
     * @returns 文件名
     */
    public static buildCacheFileName(
        date: Date = new Date(),
        format: string = "YYYY-MM-DD",
        extension: string = "jsonl",
    ): string {
        return `${moment(date).format(format)}.${extension}`;
    }

    protected filepath!: string; // 缓存文件路径

    protected readonly data: T[] = []; // 缓存的数据
    protected readonly lines: string[] = []; // 缓存文件文本

    constructor(
        public readonly client: InstanceType<typeof Client>, // 思源客户端
        public readonly directory: string, // 缓存文件目录
        protected filename: string = undefined, // 缓存文件名
    ) {
        this.init(this.filename);
    }

    [n: number]: T;

    /* 初始化 */
    protected init(
        filename: string = WakaTimeCache.buildCacheFileName(),
    ): void {
        this.filename = filename;
        this.filepath = this.buildCacheFilePath();
        this.clear();
    }

    /**
     * 构造缓存文件路径
     * @param directory 目录路径
     * @param filename 文件名
     * @returns 文件路径
     */
    public buildCacheFilePath(
        directory: string = this.directory,
        filename: string = this.filename,
    ): string {
        return `${directory}/${filename}`;
    }

    /**
     * 获取所有缓存文件的路径
     * @param directory 缓存文件目录路径
     * @returns 文件路径列表
     */
    public async getAllCacheFilePath(directory: string = this.directory): Promise<string[]> {
        const files = await this.client.readDir({ path: directory });
        return files.data
            .filter(file => file.isDir === false)
            .map(file => this.buildCacheFilePath(directory, file.name));
    }

    /**
     * 获取所有缓存文件的名称
     * @param directory 缓存文件目录路径
     * @returns 文件路径列表
     */
    public async getAllCacheFileName(directory: string = this.directory): Promise<string[]> {
        const files = await this.client.readDir({ path: directory });
        return files.data
            .filter(file => file.isDir === false)
            .map(file => file.name);
    }

    /**
     * 清空数据
     */
    public clear(): void {
        this.length = 0;
    }

    get length(): number {
        return this.data.length;
    }

    set length(value: number) {
        this.data.length = value;
        this.lines.length = value;
    }

    at(index: number): T {
        return this.data.at(index);
    }

    toString(): string {
        return this.lines.join("\n");
    }

    toLocaleString(): string {
        return this.toString();
    }

    push(...items: T[]): number {
        this.data.push(...items);
        this.lines.push(...items.map(datum => JSON.stringify(datum)));
        return this.length;
    }

    pop(): T | undefined {
        this.lines.pop();
        return this.data.pop();
    }

    shift(): T | undefined {
        this.lines.shift();
        return this.data.shift();
    }

    unshift(...items: T[]): number {
        this.data.unshift(...items);
        this.lines.unshift(...items.map(datum => JSON.stringify(datum)));
        return this.length;
    }

    slice(start?: number, end?: number): T[] {
        return this.data.slice(start, end);
    }

    splice(start: number, deleteCount?: number, ...items: T[]): T[] {
        return this.data.splice(start, deleteCount, ...items);
    }

    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void {
        this.data.forEach(callbackfn, thisArg);
    }

    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
        return this.data.map<U>(callbackfn, thisArg);
    }

    /**
     * 迭代器, 可用于 for...of 循环
     * REF: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator
     */
    [Symbol.iterator](): IterableIterator<T> {
        return this.data[Symbol.iterator]();
    }

    /**
     * 类型标签
     */
    public get [Symbol.toStringTag]() {
        return 'Cache';
    }

    /**
     * 强制类型转换
     */
    public [Symbol.toPrimitive](hint: "number" | "string" | "default") {
        switch (hint) {
            case "number":
                return this.length;
            case "string":
                return this.toString();
            default:
                return this.data;
        }
    }

    /**
     * 加载数据
     * @param filepath 文件路径
     * @returns 是否加载成功
     */
    public async load(filepath: string = this.filepath): Promise<boolean> {
        /* 检查文件是否存在 */
        const files = await this.client.readDir({ path: this.directory });
        if (files.data.some(file => file.name === this.filename && file.isDir === false)) {
            /* 若文件存在则读取文件 */
            const text = await this.client.getFile({ path: filepath }, "text");
            this.clear();
            this.push(...JSONL.parse<T>(text));
            return true;
        }
        return false;
    }

    /**
     * 移除数据
     * @param filepath 文件路径
     * @returns 是否移除成功
     */
    public async remove(filepath: string = this.filepath): Promise<boolean> {
        /* 检查文件是否存在 */
        const files = await this.client.readDir({ path: this.directory });
        if (files.data.some(file => file.name === this.filename && file.isDir === false)) {
            /* 若文件存在则移除文件 */
            const text = await this.client.removeFile({ path: filepath });
            return true;
        }
        return false;
    }

    /**
     * 缓存持久化 (自动更新缓存文件名)
     * @param update (在需要时) 更新文件名
     * @param filepath 文件路径
     * @returns 缓存是否持久化成功
     */
    public async save(
        update: boolean = true,
        filepath: string = this.filepath,
    ): Promise<boolean> {
        try {
            /* 持久缓存 */
            const result = await this._save(filepath);

            if (update) {
                const cache_file_name = WakaTimeCache.buildCacheFileName();
                if (cache_file_name !== this.filename) { // 需要初始化缓存
                    /* 初始化缓存 */
                    this.init();
                }
            }

            return result;
        } catch (error) {
            return false;
        }
    }

    /**
     * 保存缓存数据为 jsonlines 文件
     * @param filepath 文件路径
     * @param terminator 行终止符
     * @returns 是否持久化成功
     */
    protected async _save(
        filepath: string,
        terminator: string = "\n",
    ): Promise<boolean> {
        if (this.data.length > 0) {
            await this.client.putFile({
                path: filepath,
                file: this.lines.join(terminator),
            });
            return true;
        }
        return false;
    }
}
