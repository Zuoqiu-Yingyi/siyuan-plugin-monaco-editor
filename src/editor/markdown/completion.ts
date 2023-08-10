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
 * REF: https://github.com/yzhang-gh/vscode-markdown/blob/master/src/completion.ts
 * version: 3.4.0
 */

import * as katexFuncs from "./katex-funcs";

import type Monaco from "monaco-editor";
import type { IPlugin } from "@/types/editor";

export enum MathEnv {
    none,
    inline,
    display,
}

/* katex 函数信息 */
export interface IKatexFuncsInfo {
    name: string; // 函数名
    detail: string; // 函数描述
    kind: Monaco.languages.CompletionItemKind; // 函数类型
}

export class MarkdownCompletion implements Monaco.languages.CompletionItemProvider {
    public static mathEnvCheck(model: Monaco.editor.ITextModel, position: Monaco.Position): MathEnv {
        const docText = model.getValue();
        const crtOffset = model.getOffsetAt(position);
        const crtLine = model.getLineContent(position.lineNumber);

        const lineTextBefore = crtLine.substring(0, position.column - 1);
        const lineTextAfter = crtLine.substring(position.column - 1);

        const matches = lineTextBefore.match(/(?<=^|[^\\])\$/g);
        if (matches !== null
            && matches.length % 2 !== 0
            && lineTextAfter.includes("$")) {
            // Inline math
            return MathEnv.inline;
        } else {
            const textBefore = docText.substring(0, crtOffset);
            const textAfter = docText.substring(crtOffset);
            const matches = textBefore.match(/\$\$/g);
            if (matches !== null
                && matches.length % 2 !== 0
                && textAfter.includes("$$")) {
                // $$ ... $$
                return MathEnv.display;
            } else {
                return MathEnv.none;
            }
        }
    }

    /* 触发字符 */
    triggerCharacters = [
        "\\",
    ];

    /* 数学公式名到建议信息的映射 */
    protected readonly katexFuncName2Info: Map<string, IKatexFuncsInfo>;

    /* 数学公式建议 */
    protected readonly inlineMathSuggestions: Monaco.languages.CompletionItem[];
    protected readonly displayMathSuggestions: Monaco.languages.CompletionItem[];

    protected readonly inlineMathSuggestionsJSON: string;
    protected readonly displayMathSuggestionsJSON: string;

    constructor(
        public readonly pluign: IPlugin,
        protected readonly _monaco: typeof Monaco,
    ) {
        /* 构造 */
        this.katexFuncName2Info = this.buildKatexFuncsInfoMap();

        /* 构造数学公式建议项 */
        this.inlineMathSuggestions = this.buildMathSuggestions(" ", "");
        this.displayMathSuggestions = this.buildMathSuggestions("\n", "\t");

        this.inlineMathSuggestionsJSON = JSON.stringify(this.inlineMathSuggestions);
        this.displayMathSuggestionsJSON = JSON.stringify(this.displayMathSuggestions);
    }

    async provideCompletionItems(
        model: Monaco.editor.ITextModel,
        position: Monaco.Position,
        context: Monaco.languages.CompletionContext,
        token: Monaco.CancellationToken,
    ): Promise<Monaco.languages.CompletionList> {
        const math_env = MarkdownCompletion.mathEnvCheck(model, position);
        // console.debug(context, math_env);

        const lineTextBefore = model.getLineContent(position.lineNumber).substring(0, position.column - 1);
        const lineTextAfter = model.getLineContent(position.lineNumber).substring(position.column - 1);
        // console.debug(lineTextBefore, lineTextAfter);

        switch (context.triggerCharacter) {
            case this.triggerCharacters[0]: { // Katex 函数
                const matches = lineTextBefore.match(/\\+$/);
                // Math functions
                // ==============
                if (
                    // ends with an odd number of backslashes
                    matches !== null
                    && matches[0].length % 2 !== 0
                ) {
                    switch (math_env) {
                        case MathEnv.inline:
                            return {
                                suggestions: JSON.parse(this.inlineMathSuggestionsJSON),
                                incomplete: false,
                            };
                        case MathEnv.display:
                            return {
                                suggestions: JSON.parse(this.displayMathSuggestionsJSON),
                                incomplete: false,
                            };
                        case MathEnv.none:
                        default:
                            break;
                    }
                }
                break;
            }
            default:
                break;
        }

        return {
            suggestions: [],
            incomplete: false,
        };
    }

    async resolveCompletionItem(
        item: Monaco.languages.CompletionItem,
        token: Monaco.CancellationToken,
    ): Promise<Monaco.languages.CompletionItem> {
        // console.debug(item);
        return item;
    }

    protected setKatexFuncsInfo(
        map: Map<string, IKatexFuncsInfo>,
        name: IKatexFuncsInfo["name"],
        detail: IKatexFuncsInfo["detail"],
        kind: IKatexFuncsInfo["kind"],
    ): void {
        map.set(name, {
            name,
            detail,
            kind,
        });
    }

    protected buildKatexFuncsInfoMap(): Map<string, IKatexFuncsInfo> {
        const map = new Map<string, IKatexFuncsInfo>();
        katexFuncs.special2
            .forEach(name => this.setKatexFuncsInfo(map, name, "Special", this._monaco.languages.CompletionItemKind.Variable));

        katexFuncs.extend0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Other", this._monaco.languages.CompletionItemKind.Field));
        katexFuncs.extend1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Other", this._monaco.languages.CompletionItemKind.Function));
        katexFuncs.extend2
            .forEach(name => this.setKatexFuncsInfo(map, name, "Other", this._monaco.languages.CompletionItemKind.Class));

        katexFuncs.html1
            .forEach(name => this.setKatexFuncsInfo(map, name, "HTML", this._monaco.languages.CompletionItemKind.Reference));
        katexFuncs.html2
            .forEach(name => this.setKatexFuncsInfo(map, name, "HTML", this._monaco.languages.CompletionItemKind.Reference));

        katexFuncs.accents1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Accent", this._monaco.languages.CompletionItemKind.Event));
        katexFuncs.annotation1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Layout: Annotation", this._monaco.languages.CompletionItemKind.Text));
        katexFuncs.arrows0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Relation: Arrow", this._monaco.languages.CompletionItemKind.Interface));
        katexFuncs.bigOperators0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Operator: Big Operator", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.binaryOperators0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Operator: Binary Operator", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.binomialCoefficients0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Operator: Binomial", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.binomialCoefficients2
            .forEach(name => this.setKatexFuncsInfo(map, name, "Operator: Binomial", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.braketNotation1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Special Notation: Bra-ket Notation", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.classAssignment1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Style: Class Assignment", this._monaco.languages.CompletionItemKind.Class));
        katexFuncs.color2
            .forEach(name => this.setKatexFuncsInfo(map, name, "Style: Color", this._monaco.languages.CompletionItemKind.Color));
        katexFuncs.debugging0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Debug", this._monaco.languages.CompletionItemKind.Property));
        katexFuncs.delimeterSizing0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Delimiter: Sizing", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.delimiters0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Delimiter", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.envs
            .forEach(name => this.setKatexFuncsInfo(map, name, "Environment", this._monaco.languages.CompletionItemKind.EnumMember));
        katexFuncs.extensibleArrows1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Relation: Extensible Arrow", this._monaco.languages.CompletionItemKind.Interface));
        katexFuncs.font0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Style: Font", this._monaco.languages.CompletionItemKind.Text));
        katexFuncs.font1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Style: Font", this._monaco.languages.CompletionItemKind.Text));
        katexFuncs.fractions0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Operator: Fraction", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.fractions2
            .forEach(name => this.setKatexFuncsInfo(map, name, "Operator: Fraction", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.greekLetters0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Letter: Greek Letter", this._monaco.languages.CompletionItemKind.Text));
        katexFuncs.logicAndSetTheory0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Logic & Set", this._monaco.languages.CompletionItemKind.Module));
        katexFuncs.logicAndSetTheory1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Logic & Set", this._monaco.languages.CompletionItemKind.Module));
        katexFuncs.macros0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Macros", this._monaco.languages.CompletionItemKind.Keyword));
        katexFuncs.mathOperators0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Operator: Math Operator", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.mathOperators1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Operator: Math Operator", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.negatedRelations0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Relation: Negated Relation", this._monaco.languages.CompletionItemKind.Interface));
        katexFuncs.otherLetters0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Letter: Other Letter", this._monaco.languages.CompletionItemKind.Text));
        katexFuncs.overlap1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Layout: Overlap", this._monaco.languages.CompletionItemKind.Struct));
        katexFuncs.relations0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Relation", this._monaco.languages.CompletionItemKind.Interface));
        katexFuncs.size0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Style: Size", this._monaco.languages.CompletionItemKind.Value));
        katexFuncs.spacing0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Layout: Spacing", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.spacing1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Layout: Spacing", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.sqrt1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Operator: SQRT", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.style0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Style", this._monaco.languages.CompletionItemKind.Color));
        katexFuncs.symbolsAndPunctuation0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Symbols & Punctuation", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.verticalLayout0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Layout: Vertical Layout", this._monaco.languages.CompletionItemKind.Struct));
        katexFuncs.verticalLayout1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Layout: Vertical Layout", this._monaco.languages.CompletionItemKind.Struct));
        katexFuncs.verticalLayout2
            .forEach(name => this.setKatexFuncsInfo(map, name, "Layout: Vertical Layout", this._monaco.languages.CompletionItemKind.Struct));
        return map;
    }

    /**
     * 构造数学环境的建议
     * @param separator 分隔符
     * @param indent 缩进符
     */
    protected buildMathSuggestions(
        separator: string = "\n",
        indent: string = "\t",
    ): Monaco.languages.CompletionItem[] {
        // \cmd
        const c0: Monaco.languages.CompletionItem[] = Array.from(new Set(
            [
                ...katexFuncs.extend0,

                ...katexFuncs.arrows0,
                ...katexFuncs.bigOperators0,
                ...katexFuncs.binaryOperators0,
                ...katexFuncs.binomialCoefficients0,
                ...katexFuncs.debugging0,
                ...katexFuncs.delimeterSizing0,
                ...katexFuncs.delimiters0,
                ...katexFuncs.font0,
                ...katexFuncs.fractions0,
                ...katexFuncs.greekLetters0,
                ...katexFuncs.logicAndSetTheory0,
                ...katexFuncs.macros0,
                ...katexFuncs.mathOperators0,
                ...katexFuncs.negatedRelations0,
                ...katexFuncs.otherLetters0,
                ...katexFuncs.relations0,
                ...katexFuncs.size0,
                ...katexFuncs.spacing0,
                ...katexFuncs.style0,
                ...katexFuncs.symbolsAndPunctuation0,
                ...katexFuncs.verticalLayout0,
            ]
        )).map(cmd => {
            const info = this.katexFuncName2Info.get(cmd);
            const item = {
                label: `\\${cmd}`,
                detail: info?.detail,
                kind: info?.kind ?? this._monaco.languages.CompletionItemKind.Field,
                insertText: cmd,
                insertTextRules: this._monaco.languages.CompletionItemInsertTextRule.None,
                range: undefined,
            };
            return item;
        });

        // \cmd{$1}
        const c1: Monaco.languages.CompletionItem[] = Array.from(new Set(
            [
                ...katexFuncs.extend1,
                ...katexFuncs.html1,

                ...katexFuncs.accents1,
                ...katexFuncs.annotation1,
                ...katexFuncs.braketNotation1,
                ...katexFuncs.classAssignment1,
                ...katexFuncs.extensibleArrows1,
                ...katexFuncs.font1,
                ...katexFuncs.logicAndSetTheory1,
                ...katexFuncs.mathOperators1,
                ...katexFuncs.overlap1,
                ...katexFuncs.spacing1,
                ...katexFuncs.sqrt1,
                ...katexFuncs.verticalLayout1,
            ]
        )).map(cmd => {
            const info = this.katexFuncName2Info.get(cmd);
            const item = {
                label: `\\${cmd}{...}`,
                detail: info?.detail,
                kind: info?.kind ?? this._monaco.languages.CompletionItemKind.Function,
                insertText: `${cmd}{$1}`,
                insertTextRules: this._monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: undefined,
            };
            return item;
        });

        // \cmd{$1}{$2}
        const c2: Monaco.languages.CompletionItem[] = Array.from(new Set(
            [
                ...katexFuncs.extend2,
                ...katexFuncs.html2,

                ...katexFuncs.binomialCoefficients2,
                ...katexFuncs.color2,
                ...katexFuncs.fractions2,
                ...katexFuncs.verticalLayout2,
            ]
        )).map(cmd => {
            const info = this.katexFuncName2Info.get(cmd);
            const item = {
                label: `\\${cmd}{...}{...}`,
                detail: info?.detail,
                kind: info?.kind ?? this._monaco.languages.CompletionItemKind.Class,
                insertText: `${cmd}{$1}{$2}`,
                insertTextRules: this._monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: undefined,
            };
            return item;
        });

        // \cmd[$1]{$2}
        const s2: Monaco.languages.CompletionItem[] = Array.from(new Set(
            [
                ...katexFuncs.special2,
                ...katexFuncs.extensibleArrows1,
            ]
        )).map(cmd => {
            const info = this.katexFuncName2Info.get(cmd);
            const item = {
                label: `\\${cmd}[...]{...}`,
                detail: info?.detail,
                kind: info?.kind ?? this._monaco.languages.CompletionItemKind.Class,
                insertText: `${cmd}[$1]{$2}`,
                insertTextRules: this._monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: undefined,
            };
            return item;
        });

        // \begin{$1} $2 \end{$1}
        const envSnippet: Monaco.languages.CompletionItem = {
            label: "\\begin{...} ... \\end{...}",
            kind: this._monaco.languages.CompletionItemKind.Snippet,
            detail: "Environments",
            insertText: [
                `begin{\${1|${katexFuncs.envs.join(",")}|}}`,
                `${indent}$2`,
                `\\end{$1}`,
            ].join(separator),
            insertTextRules: this._monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: undefined,
        };

        // \begin{array}{$1} $2 \end{array}
        const arraySnippet: Monaco.languages.CompletionItem = {
            label: "\\begin{array}{...} ... \\end{array}",
            kind: this._monaco.languages.CompletionItemKind.Snippet,
            detail: "Array & Table",
            insertText: [
                `begin{array}{$1}`,
                `${indent}$2`,
                `\\end{array}`,
            ].join(separator),
            insertTextRules: this._monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: undefined,
        };

        // \begin{$1}[$2] $3 \end{$1}
        const matrixSnippet: Monaco.languages.CompletionItem = {
            label: "\\begin{matrix*}[...] ... \\end{matrix*}",
            kind: this._monaco.languages.CompletionItemKind.Snippet,
            detail: "Matrix",
            insertText: [
                `begin{\${1|${[
                    "matrix*",
                    "pmatrix*",
                    "bmatrix*",
                    "Bmatrix*",
                    "vmatrix*",
                    "Vmatrix*",
                ].join(",")}|}}[\${2|l,c,r|}]`,
                `${indent}$3`,
                `\\end{$1}`,
            ].join(separator),
            insertTextRules: this._monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: undefined,
        };

        // TODO: 自定义宏
        const macroItems: Monaco.languages.CompletionItem[] = [];

        const mathSuggestions: Monaco.languages.CompletionItem[] = [
            ...c0,
            ...c1,
            ...c2,
            ...s2,
            envSnippet,
            arraySnippet,
            matrixSnippet,
            ...macroItems,
        ];

        // Sort
        for (const item of mathSuggestions) {
            const label = typeof item.label === "string" ? item.label : item.label.label;
            item.sortText = label.replace(/[a-zA-Z]/g, (c) => {
                if (/[a-z]/.test(c)) {
                    return `0${c}`;
                } else {
                    return `1${c.toLowerCase()}`;
                }
            });
        }
        return mathSuggestions;
    }
}
