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

import path from "path";
import asyncFs from "fs/promises";
import convert, { type ElementCompact } from "xml-js";

const root = process.cwd();

const C = {
    /* material 图标目录路径 */
    MATERIAL_ICONS_MANIFEST: path.resolve(root, "./node_modules/material-icon-theme/dist/material-icons.json"),
    MATERIAL_ICONS_PATH: path.resolve(root, "./node_modules/material-icon-theme/icons"),

    /* material 图标生成的 *.symbol 文件路径 */
    MATERIAL_FILE_PATH_SYMBOL: path.resolve(root, "./src/assets/symbols/icon-monaco-editor-material-icons.symbol"),

    /* material 图标名称->图标 映射文件路径 */
    MATERIAL_FILE_PATH_ENTRIES_LANGUAGE: path.resolve(root, "./src/assets/entries/language-icon.json"),

    /* material 文件夹名称->图标 映射文件路径 */
    MATERIAL_FILE_PATH_ENTRIES_FOLDER: path.resolve(root, "./src/assets/entries/folder-icon.json"),
    MATERIAL_FILE_PATH_ENTRIES_FOLDER_LIGHT: path.resolve(root, "./src/assets/entries/light/folder-icon.json"),

    /* material 文件夹名称->(打开的)图标 映射文件路径 */
    MATERIAL_FILE_PATH_ENTRIES_FOLDER_EXPANDED: path.resolve(root, "./src/assets/entries/folder-expanded-icon.json"),
    MATERIAL_FILE_PATH_ENTRIES_FOLDER_EXPANDED_LIGHT: path.resolve(root, "./src/assets/entries/light/folder-expanded-icon.json"),

    /* material 文件名->图标 映射文件路径 */
    MATERIAL_FILE_PATH_ENTRIES_FILE: path.resolve(root, "./src/assets/entries/file-icon.json"),
    MATERIAL_FILE_PATH_ENTRIES_FILE_LIGHT: path.resolve(root, "./src/assets/entries/light/file-icon.json"),

    /* material 文件扩展名->图标 映射文件路径 */
    MATERIAL_FILE_PATH_ENTRIES_FILE_EXTENSION: path.resolve(root, "./src/assets/entries/file-extension-icon.json"),
    MATERIAL_FILE_PATH_ENTRIES_FILE_EXTENSION_LIGHT: path.resolve(root, "./src/assets/entries/light/file-extension-icon.json"),

    /* 图标 ID 前缀 */
    ID_PREFIX_MATERIAL: "icon-monaco-editor-material",
};

interface IMap {
    [key: string]: string;
}

type IEntry = [string, string];

/**
 * 构建图标
 * TODO: 将 svg 图标转换为 symbol 并设置 ID, 合并为一个文件
 */
async function buildMaterialIcons() {
    const materialIcons: typeof import("material-icon-theme/dist/material-icons.json") = JSON.parse(await asyncFs.readFile(C.MATERIAL_ICONS_MANIFEST, "utf-8"));
    const {
        iconDefinitions, // 图标定义
        languageIds, // 语言 ID
        folderNames, // 目录名
        folderNamesExpanded, // 展开的目录
        fileNames, // 文件名
        fileExtensions, // 文件扩展名
        light, // 明亮主题图标
    } = materialIcons;

    /* 构建 文件/目录名称->图标ID 的映射 */
    await Promise.all([
        buildIconsMapEntries(languageIds, C.MATERIAL_FILE_PATH_ENTRIES_LANGUAGE, C.ID_PREFIX_MATERIAL),

        buildIconsMapEntries(folderNames, C.MATERIAL_FILE_PATH_ENTRIES_FOLDER, C.ID_PREFIX_MATERIAL),
        buildIconsMapEntries(folderNamesExpanded, C.MATERIAL_FILE_PATH_ENTRIES_FOLDER_EXPANDED, C.ID_PREFIX_MATERIAL),
        buildIconsMapEntries(fileNames, C.MATERIAL_FILE_PATH_ENTRIES_FILE, C.ID_PREFIX_MATERIAL),
        buildIconsMapEntries(fileExtensions, C.MATERIAL_FILE_PATH_ENTRIES_FILE_EXTENSION, C.ID_PREFIX_MATERIAL, true),

        buildIconsMapEntries(light.folderNames, C.MATERIAL_FILE_PATH_ENTRIES_FOLDER_LIGHT, C.ID_PREFIX_MATERIAL),
        buildIconsMapEntries(light.folderNamesExpanded, C.MATERIAL_FILE_PATH_ENTRIES_FOLDER_EXPANDED_LIGHT, C.ID_PREFIX_MATERIAL),
        buildIconsMapEntries(light.fileNames, C.MATERIAL_FILE_PATH_ENTRIES_FILE_LIGHT, C.ID_PREFIX_MATERIAL),
        buildIconsMapEntries(light.fileExtensions, C.MATERIAL_FILE_PATH_ENTRIES_FILE_EXTENSION_LIGHT, C.ID_PREFIX_MATERIAL, true),
    ]);

    const paths = Object
        .entries(iconDefinitions)
        .map(([name, icon]) => [name, path.resolve(C.MATERIAL_ICONS_MANIFEST, "..", icon.iconPath)]);
    // console.debug(paths);

    // REF: https://www.npmjs.com/package/xml-js
    const symbols = await Promise.all(paths.map(([name, path]) => buildIconSymbol(name, path, C.ID_PREFIX_MATERIAL)));
    await asyncFs.writeFile(C.MATERIAL_FILE_PATH_SYMBOL, symbols.join("\n"));
}

/**
 * 构建图标映射
 * @param icons: icons 对象(key: 名称, value: 图标名称)
 * @param path: entries 文件保存路径
 * @param prefix: 图标 ID 前缀
 * @param ext: 是否为文件扩展名
 */
async function buildIconsMapEntries(
    icons: IMap,
    path: string,
    prefix: string,
    ext: boolean = false,
): Promise<IEntry[]> {
    const entries: IEntry[] = [];
    Object.entries(icons).forEach(([name, icon]) => {
        const id = `#${prefix}-${icon}`;
        if (ext) {
            entries.push([`.${name}`, id]);
            // entries.push([`.${icon}`, id]);
        }
        else {
            entries.push([name, id]);
        }
    });
    await asyncFs.writeFile(path, JSON.stringify(entries, null, 4));
    return entries;
}

/**
 * 构建图标文件符号
 * @param icon: *.svg 文件引用名称
 * @param path: *.svg 文件路径
 * @param prefix: 图标 ID 前缀
 * @return: xml <symbol>
 */
async function buildIconSymbol(
    icon: string,
    path: string,
    prefix: string,
): Promise<string> {
    const svg = await asyncFs.readFile(path, "utf-8");
    const xml = convert.xml2js(svg, { compact: true }) as ElementCompact;

    xml.svg._attributes.id = `${prefix}-${icon}`;
    delete xml.svg._attributes.xmlns;

    return convert.js2xml({ symbol: xml.svg }, { compact: true, spaces: 4 });
}

buildMaterialIcons();
