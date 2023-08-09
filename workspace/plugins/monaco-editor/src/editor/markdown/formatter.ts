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
 * REF: https://github.com/yzhang-gh/vscode-markdown/blob/master/src/tableFormatter.ts
 */

import GraphemeSplitter from "grapheme-splitter";
import type Monaco from "monaco-editor";

export interface ITableRange {
    text: string;
    offset: number;
    range: Monaco.IRange;
}

export enum ColumnAlignment {
    None,
    Left,
    Center,
    Right
}

export class MarkdownFormatter implements Monaco.languages.DocumentFormattingEditProvider {
    public static readonly splitter = new GraphemeSplitter();

    constructor(
        protected readonly _monaco: typeof Monaco,
    ) { }

    provideDocumentFormattingEdits(
        model: Monaco.editor.ITextModel,
        options: Monaco.languages.FormattingOptions,
        token: Monaco.CancellationToken,
    ): Monaco.languages.ProviderResult<Monaco.languages.TextEdit[]> {
        const tables = this.detectTables(model);
        if (!tables || token.isCancellationRequested) {
            return;
        }

        const edits = tables.map<Monaco.languages.TextEdit>(target => ({
            range: target.range,
            text: this.formatTable(
                target,
                model,
                options,
            ),
        }));

        return edits;
    }

    private detectTables(model: Monaco.editor.ITextModel): ITableRange[] | undefined {
        const text = model.getValue();

        const lineBreak = String.raw`\r?\n`;
        // const contentLine = String.raw`\|?.*\|.*\|?`;

        /* 👇避免格式化思源 IAL👇 */
        const contentLine = String.raw`(?!\{:(?:\s+\w+="[^"]*")*\})` + String.raw`\|?.*\|.*\|?`;

        const leftSideHyphenComponent = String.raw`(?:\|? *:?-+:? *\|)`;
        const middleHyphenComponent = String.raw`(?: *:?-+:? *\|)*`;
        const rightSideHyphenComponent = String.raw`(?: *:?-+:? *\|?)`;
        const multiColumnHyphenLine = leftSideHyphenComponent + middleHyphenComponent + rightSideHyphenComponent;

        //// GitHub issue #431
        const singleColumnHyphenLine = String.raw`(?:\| *:?-+:? *\|)`;

        const hyphenLine = String.raw`[ \t]*(?:${multiColumnHyphenLine}|${singleColumnHyphenLine})[ \t]*`;

        const tableRegex = new RegExp(contentLine + lineBreak + hyphenLine + '(?:' + lineBreak + contentLine + ')*', 'g');

        const result: ITableRange[] = Array.from(
            text.matchAll(tableRegex),
            (item): ITableRange => ({
                text: item[0],
                offset: item.index!,
                range: this._monaco.Range.fromPositions(
                    model.getPositionAt(item.index!),
                    model.getPositionAt(item.index! + item[0].length),
                ),
            }),
        );

        return result.length ? result : undefined;
    }

    /**
     * Return the indentation of a table as a string of spaces by reading it from the first line.
     * In case of `markdown.extension.table.normalizeIndentation` is `enabled` it is rounded to the closest multiple of
     * the configured `tabSize`.
     */
    private getTableIndentation(text: string, options: Monaco.languages.FormattingOptions) {
        let doNormalize = false; // true: 列表内表格的缩进长度为制表符长度
        let indentRegex = new RegExp(/^(\s*)\S/u);
        let match = text.match(indentRegex);
        let spacesInFirstLine = match?.[1].length ?? 0;
        let tabStops = Math.round(spacesInFirstLine / options.tabSize);
        let spaces = doNormalize ? " ".repeat(options.tabSize * tabStops) : " ".repeat(spacesInFirstLine);
        return spaces;
    }

    private formatTable(target: ITableRange, model: Monaco.editor.ITextModel, options: Monaco.languages.FormattingOptions) {
        // The following operations require the Unicode Normalization Form C (NFC).
        const text = target.text.normalize();

        const delimiterRowIndex = 1;
        const delimiterRowNoPadding = false; // true: 不在分隔符行中填充
        const indentation = this.getTableIndentation(text, options);

        const rowsNoIndentPattern = new RegExp(/^\s*(\S.*)$/gum);
        const rows: string[] = Array.from(text.matchAll(rowsNoIndentPattern), (match) => match[1].trim());

        // Desired "visual" width of each column (the length of the longest cell in each column), **without padding**
        const colWidth: number[] = [];
        // Alignment of each column
        const colAlign: ColumnAlignment[] = [];
        // Regex to extract cell content.
        // GitHub #24
        const fieldRegExp = new RegExp(/((\\\||[^\|])*)\|/gu);
        // https://www.ling.upenn.edu/courses/Spring_2003/ling538/UnicodeRanges.html
        const cjkRegex = /[\u3000-\u9fff\uac00-\ud7af\uff01-\uff60]/g;

        const lines = rows.map((row, iRow) => {
            // Normalize
            if (row.startsWith('|')) {
                row = row.slice(1);
            }
            if (!row.endsWith('|')) {
                row = row + '|';
            }

            // Parse cells in the current row
            let values = [];
            let iCol = 0;
            for (const field of row.matchAll(fieldRegExp)) {
                let cell = field[1].trim();
                values.push(cell);

                // Ignore the length of delimiter-line before we normalize it
                if (iRow === delimiterRowIndex) {
                    continue;
                }

                // Calculate the desired "visual" column width.
                // The following notes help to understand the precondition for our calculation.
                // They don't reflect how text layout engines really work.
                // For more information, please consult UAX #11.
                // A grapheme cluster may comprise multiple Unicode code points.
                // One CJK grapheme consists of one CJK code point, in NFC.
                // In typical fixed-width typesetting without ligature, one grapheme is finally mapped to one glyph.
                // Such a glyph is usually the same width as an ASCII letter, but a CJK glyph is twice.

                const graphemeCount = MarkdownFormatter.splitter.countGraphemes(cell);
                const cjkPoints = cell.match(cjkRegex);
                const width = graphemeCount + (cjkPoints?.length ?? 0);
                colWidth[iCol] = Math.max(colWidth[iCol] || 0, width);

                iCol++;
            }
            return values;
        });

        // Normalize the num of hyphen according to the desired column length
        lines[delimiterRowIndex] = lines[delimiterRowIndex].map((cell, iCol) => {
            if (/:-+:/.test(cell)) {
                // :---:
                colAlign[iCol] = ColumnAlignment.Center;
                // Update the lower bound of visual `colWidth` (without padding) based on the column alignment specification
                colWidth[iCol] = Math.max(colWidth[iCol], delimiterRowNoPadding ? 5 - 2 : 5);
                // The length of all `-`, `:` chars in this delimiter cell
                const specWidth = delimiterRowNoPadding ? colWidth[iCol] + 2 : colWidth[iCol];
                return ':' + '-'.repeat(specWidth - 2) + ':';
            } else if (/:-+/.test(cell)) {
                // :---
                colAlign[iCol] = ColumnAlignment.Left;
                colWidth[iCol] = Math.max(colWidth[iCol], delimiterRowNoPadding ? 4 - 2 : 4);
                const specWidth = delimiterRowNoPadding ? colWidth[iCol] + 2 : colWidth[iCol];
                return ':' + '-'.repeat(specWidth - 1);
            } else if (/-+:/.test(cell)) {
                // ---:
                colAlign[iCol] = ColumnAlignment.Right;
                colWidth[iCol] = Math.max(colWidth[iCol], delimiterRowNoPadding ? 4 - 2 : 4);
                const specWidth = delimiterRowNoPadding ? colWidth[iCol] + 2 : colWidth[iCol];
                return '-'.repeat(specWidth - 1) + ':';
            } else {
                // ---
                colAlign[iCol] = ColumnAlignment.None;
                colWidth[iCol] = Math.max(colWidth[iCol], delimiterRowNoPadding ? 3 - 2 : 3);
                const specWidth = delimiterRowNoPadding ? colWidth[iCol] + 2 : colWidth[iCol];
                return '-'.repeat(specWidth);
            }
        });

        return lines.map((row, iRow) => {
            if (iRow === delimiterRowIndex && delimiterRowNoPadding) {
                return indentation + '|' + row.join('|') + '|';
            }

            let cells = row.map((cell, iCol) => {
                const visualWidth = colWidth[iCol];
                let jsLength = MarkdownFormatter.splitter.splitGraphemes(cell + ' '.repeat(visualWidth)).slice(0, visualWidth).join('').length;

                const cjkPoints = cell.match(cjkRegex);
                if (cjkPoints) {
                    jsLength -= cjkPoints.length;
                }

                return this.alignText(cell, colAlign[iCol], jsLength);
            });
            return indentation + '| ' + cells.join(' | ') + ' |';
        }).join(model.getEOL());
    }

    private alignText(text: string, align: ColumnAlignment, length: number) {
        if (align === ColumnAlignment.Center && length > text.length) {
            return (' '.repeat(Math.floor((length - text.length) / 2)) + text + ' '.repeat(length)).slice(0, length);
        } else if (align === ColumnAlignment.Right) {
            return (' '.repeat(length) + text).slice(-length);
        } else {
            return (text + ' '.repeat(length)).slice(0, length);
        }
    }
}
