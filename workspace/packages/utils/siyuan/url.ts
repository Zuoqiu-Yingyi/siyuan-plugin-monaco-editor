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

import { BlockID } from "@workspace/types/siyuan";
import { EditorType } from ".";
import regexp from "../regexp";

/* 思源各 web 端路径 */
export enum Pathname {
    window = "/stage/build/app/window.html",
    app = "/stage/build/app",
    desktop = "/stage/build/desktop",
    mobile = "/stage/build/mobile",
}

export function editorType2Pathname(editorEype: EditorType): Pathname {
    switch (editorEype) {
        case EditorType.window:
            return Pathname.window;
        case EditorType.app:
            return Pathname.app;
        case EditorType.desktop:
            return Pathname.desktop;
        case EditorType.mobile:
            return Pathname.mobile;
    }
}

/**
 * @params pathname: web 端路径
 * @params params: URL 查询参数
 * @return: URL
 */
export function buildSiyuanWebURL(
    pathname: Pathname,
    params?: { id?: BlockID, focus?: boolean, url?: string },
    origin = globalThis.origin,
): URL {
    const url = new URL(origin);
    url.pathname = pathname;

    /* 通过块 ID 跳转 */
    if (params?.id) {
        url.searchParams.set("id", params.id);
    }

    if (params?.focus !== undefined) {
        url.searchParams.set("focus", params.focus ? "1" : "0");
    }

    if (params?.url) {
        url.searchParams.set("url", params.url);
    }

    return url;
}

/**
 * 解析思源 URL
 * @params url: URL
 */
export function parseSiyuanURL(url: URL) {
    if (regexp.url.test(url.href)) {
        return {
            id: regexp.url.exec(url.href)![1],
            focus: url.searchParams.get("focus") === "1",
        }
    }
    else {
        return null;
    }
}

/**
 * 判断一个超链接是否为思源静态文件服务
 * @param href: 超链接地址
 * @param workspace: 是否为工作空间下的目录
 */
export function isStaticPathname(
    href: string,
    workspace: boolean = true,
): boolean {
    if (href.startsWith("/")) href = href.substring(1);
    switch (true) {
        case href.startsWith("stage/"): // 安装目录/resources/stage
            return !workspace;

        case href.startsWith("appearance/"): // 工作空间/conf/appearance
        case href.startsWith("export/"): // 工作空间/temp/export
        case href.startsWith("history/"): // 工作空间/history

        case href.startsWith("assets/"): // 工作空间/data/assets
        case href.startsWith("emojies/"): // 工作空间/data/emojies
        case href.startsWith("plugins/"): // 工作空间/data/plugins
        case href.startsWith("public/"): // 工作空间/data/public
        case href.startsWith("snippets/"): // 工作空间/data/snippets
        case href.startsWith("templates/"): // 工作空间/data/templates
        case href.startsWith("widgets/"): // 工作空间/data/widgets
            return true;

        default:
            return false;
    }
}

/**
 * 判断一个相对于工作空间目录的路径是否为思源静态文件服务
 * @param href: 超链接地址
 * @param workspace: 是否为工作空间下的目录
 */
export function isStaticWebFileServicePath(path: string): boolean {
    switch (true) {
        case path.startsWith("conf/appearance/"):
        case path.startsWith("temp/export/"):
        case path.startsWith("history/"):

        case path.startsWith("data/assets/"):
        case path.startsWith("data/emojies/"):
        case path.startsWith("data/plugins/"):
        case path.startsWith("data/public/"):
        case path.startsWith("data/snippets/"):
        case path.startsWith("data/templates/"):
        case path.startsWith("data/widgets/"):
            return true;

        default:
            return false;
    }
}

/**
 * 思源静态 web 文件路径 👉 相对于工作空间的路径
 * @param pathname: 思源静态 web 文件路径
 * @return: 工作空间路径
 */
export function staticPathname2WorkspacePath(pathname: string): string {
    if (pathname.startsWith("/")) pathname = pathname.substring(1);
    switch (true) {
        case pathname.startsWith("assets/"): // 工作空间/data/assets
        case pathname.startsWith("emojies/"): // 工作空间/data/emojies
        case pathname.startsWith("plugins/"): // 工作空间/data/plugins
        case pathname.startsWith("public/"): // 工作空间/data/public
        case pathname.startsWith("snippets/"): // 工作空间/data/snippets
        case pathname.startsWith("templates/"): // 工作空间/data/templates
        case pathname.startsWith("widgets/"): // 工作空间/data/widgets
            return `data/${pathname}`;
        case pathname.startsWith("appearance/"): // 工作空间/conf/appearance
            return `conf/${pathname}`;
        case pathname.startsWith("export/"): // 工作空间/temp/export
            return `temp/${pathname}`;
        case pathname.startsWith("history/"): // 工作空间/history
            return pathname;
        default:
            throw new Error(`'${pathname}' is not a valid file pathname`);
    }
}


/**
 * 相对于工作空间目录的路径 👉 思源静态 web 文件路径
 * @param pathname: 思源静态 web 文件路径
 * @return: 工作空间路径
 */
export function workspacePath2StaticPathname(path: string): string {
    switch (true) {
        case path.startsWith("data/assets/"):
        case path.startsWith("data/emojies/"):
        case path.startsWith("data/plugins/"):
        case path.startsWith("data/public/"):
        case path.startsWith("data/snippets/"):
        case path.startsWith("data/templates/"):
        case path.startsWith("data/widgets/"):
            return path.replace(/^data\//, "");
        case path.startsWith("conf/appearance/"):
            return path.replace(/^conf\//, "");
        case path.startsWith("temp/export/"):
            return path.replace(/^temp\//, "");
        case path.startsWith("history/"):
            return path;
        default:
            throw new Error(`'${path}' is not a valid workspace path`);
    }
}
