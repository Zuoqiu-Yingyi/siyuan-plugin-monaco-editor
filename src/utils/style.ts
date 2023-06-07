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

/**
 * 基础样式
 * @params pluginName: 插件名称
 * @return: css 代码
 */
export function baseStyle(pluginName: string): string {
    return `
@font-face {
    font-family: "Twitter Color Emoji";
    font-style: normal;
    src: url("plugins/${pluginName}/static/fonts/TwitterColorEmoji/TwitterColorEmoji-14.0.2.ttf");
}
`;
}

/**
 * 清洗字体名称
 * @params font: 字体名称
 * @return: 清洗后的字体名称(有效的 CSS 字体名称)
 */
export function washFontName(font: string): string {
    font = font.trim();

    switch (true) {
        case font.startsWith("\"") && font.endsWith("\""):
        case font.startsWith("\'") && font.endsWith("\'"):
            return font;

        default:
            return `"${font}"`;
    }
}

/**
 * 字体样式
 * @params fontList.base: 基础字体列表
 * @params fontList.code: 代码字体列表
 * @params fontList.graph: 关系图字体列表
 * @params fontList.math: 数学公式字体列表
 * @params fontList.emoji: Emoji 字体列表
 * @return: css 代码
 */
export function fontFamilyStyle(fontList: {
    base?: string[],
    code?: string[],
    graph?: string[],
    math?: string[],
    emoji?: string[],
}): string {
    const css: string[] = [];
    css.push(":root {");
    if (fontList.base?.length > 0) {
        const base = fontList.base.map(washFontName);
        css.push(`    --b3-font-family: ${base.join(", ")};`);
    }
    if (fontList.code?.length > 0) {
        const code = fontList.code.map(washFontName);
        css.push(`    --b3-font-family-code: ${code.join(", ")};`);
    }
    if (fontList.graph?.length > 0) {
        const graph = fontList.graph.map(washFontName);
        css.push(`    --b3-font-family-graph: ${graph.join(", ")};`);
    }
    if (fontList.math?.length > 0) {
        const math = fontList.math.map(washFontName);
        css.push(`    --b3-font-family-math: ${math.join(", ")};`);
    }
    if (fontList.emoji?.length > 0) {
        const emoji = fontList.emoji.map(washFontName);
        css.push(`    --b3-font-family-emoji: ${emoji.join(", ")};`);
    }
    css.push("}");
    return css.join("\n");
}
