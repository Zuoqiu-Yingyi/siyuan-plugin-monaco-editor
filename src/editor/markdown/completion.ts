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
    description: string; // 函数描述
    kind: Monaco.languages.CompletionItemKind; // 函数类型
    documentation: Monaco.IMarkdownString; // 函数文档
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
    /* 数学公式名到提示的映射 */
    protected readonly katexFuncName2detail: Map<string, string>;

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
        this.katexFuncName2detail = this.buildKatexFuncsDetailMap();

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

    protected makeDocumentation(
        command: string = "",
        separator: string = " | ",
    ): Monaco.IMarkdownString {
        const links: string[] = [
            `[KaTeX](https://katex.org/)`,
            `[Functions](https://katex.org/docs/supported)`,
            `[Reference](https://katex.org/docs/support_table)`,
        ];
        if (command) {
            links.push(`[${command}](<https://katex.org/docs/support_table#:~:text=${command}>)`);
        }
        return {
            value: links.join(separator),
        };
    }

    protected setKatexFuncsInfo(
        map: Map<string, IKatexFuncsInfo>,
        name: IKatexFuncsInfo["name"],
        description: IKatexFuncsInfo["description"],
        kind: IKatexFuncsInfo["kind"],
    ): void {
        map.set(name, {
            name,
            description,
            kind,
            documentation: this.makeDocumentation(`\\${name}`),
        });
    }

    /* katex 函数名 -> info */
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
            .forEach(name => this.setKatexFuncsInfo(map, name, "Annotation", this._monaco.languages.CompletionItemKind.Text));
        katexFuncs.arrows0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Arrow", this._monaco.languages.CompletionItemKind.Interface));
        katexFuncs.bigOperators0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Big Operator", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.binaryOperators0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Binary Operator", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.binomialCoefficients0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Binomial", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.binomialCoefficients2
            .forEach(name => this.setKatexFuncsInfo(map, name, "Binomial", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.braketNotation1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Bra-ket Notation", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.classAssignment1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Class Assignment", this._monaco.languages.CompletionItemKind.Class));
        katexFuncs.color2
            .forEach(name => this.setKatexFuncsInfo(map, name, "Color", this._monaco.languages.CompletionItemKind.Color));
        katexFuncs.debugging0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Debug", this._monaco.languages.CompletionItemKind.Property));
        katexFuncs.delimeterSizing0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Delimiter Sizing", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.delimiters0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Delimiter", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.envs
            .forEach(name => this.setKatexFuncsInfo(map, name, "Environment", this._monaco.languages.CompletionItemKind.EnumMember));
        katexFuncs.extensibleArrows1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Extensible Arrow", this._monaco.languages.CompletionItemKind.Interface));
        katexFuncs.font0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Font", this._monaco.languages.CompletionItemKind.Text));
        katexFuncs.font1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Font", this._monaco.languages.CompletionItemKind.Text));
        katexFuncs.fractions0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Fraction", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.fractions2
            .forEach(name => this.setKatexFuncsInfo(map, name, "Fraction", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.greekLetters0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Greek Letter", this._monaco.languages.CompletionItemKind.Text));
        katexFuncs.logicAndSetTheory0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Logic & Set", this._monaco.languages.CompletionItemKind.Module));
        katexFuncs.logicAndSetTheory1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Logic & Set", this._monaco.languages.CompletionItemKind.Module));
        katexFuncs.macros0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Macros", this._monaco.languages.CompletionItemKind.Keyword));
        katexFuncs.mathOperators0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Math Operator", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.mathOperators1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Math Operator", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.negatedRelations0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Negated Relation", this._monaco.languages.CompletionItemKind.Interface));
        katexFuncs.otherLetters0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Other Letter", this._monaco.languages.CompletionItemKind.Text));
        katexFuncs.overlap1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Overlap", this._monaco.languages.CompletionItemKind.Struct));
        katexFuncs.relations0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Relation", this._monaco.languages.CompletionItemKind.Interface));
        katexFuncs.size0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Size", this._monaco.languages.CompletionItemKind.Value));
        katexFuncs.spacing0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Spacing", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.spacing1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Spacing", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.sqrt1
            .forEach(name => this.setKatexFuncsInfo(map, name, "SQRT", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.style0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Style", this._monaco.languages.CompletionItemKind.Color));
        katexFuncs.symbolsAndPunctuation0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Symbols & Punctuation", this._monaco.languages.CompletionItemKind.Operator));
        katexFuncs.verticalLayout0
            .forEach(name => this.setKatexFuncsInfo(map, name, "Vertical Layout", this._monaco.languages.CompletionItemKind.Struct));
        katexFuncs.verticalLayout1
            .forEach(name => this.setKatexFuncsInfo(map, name, "Vertical Layout", this._monaco.languages.CompletionItemKind.Struct));
        katexFuncs.verticalLayout2
            .forEach(name => this.setKatexFuncsInfo(map, name, "Vertical Layout", this._monaco.languages.CompletionItemKind.Struct));

        return map;
    }

    /* katex 函数名 -> detail */
    protected buildKatexFuncsDetailMap(): Map<string, string> {
        const map = new Map<string, string>();

        /* 添加符号 */
        /**
         * 注音符号 Accents
         * REF: https://katex.org/docs/supported#accents
         */
        map.set("acute", ` ́ á ó`);
        map.set("'", ` ́ á ó`);

        map.set("bar", ` ̄ ā ō`);
        map.set("=", ` ̄ ā ō`);

        map.set("breve", ` ̆ ă ŏ`);
        map.set("u", ` ̆ ă ŏ`);

        map.set("check", ` ̌ ǎ ǒ`);
        map.set("v", ` ̌ ǎ ǒ`);

        map.set("dot", ` ̇ ȧ ȯ`);
        map.set(".", ` ̇ ȧ ȯ`);

        map.set("ddot", ` ̈ ä ö`);
        map.set("\"", ` ̈ ä ö`);

        map.set("grave", ` ̀ à ò`);
        map.set("`", ` ̀ à ò`);

        map.set("hat", ` ̂ â ô`);
        map.set("^", ` ̂ â ô`);

        map.set("tilde", ` ̃ ã õ`);
        map.set("~", ` ̃ ã õ`);

        map.set("mathring", ` ̊ å o̊`);
        map.set("r", ` ̊ å o̊`);

        map.set("H", ` ̋ a̋ ő`);

        /**
         * 括号 Delimiters
         * REF: https://katex.org/docs/supported#delimiters
        */
        map.set("lparen", `(`);
        map.set("rparen", `)`);

        map.set("lbrack", `[`);
        map.set("rbrack", `]`);

        map.set("lbrace", `{`);
        map.set("rbrace", `{`);
        map.set("{", `{`);
        map.set("}", `}`);

        map.set("langle", `⟨`);
        map.set("rangle", `⟩`);

        map.set("vert", `|`);

        map.set("Vert", `∥`);
        map.set("|", `∥`);

        map.set("lvert", `∣`);
        map.set("rvert", `∣`);

        map.set("lVert", `∥`);
        map.set("rVert", `∥`);

        map.set("lang", `⟨`);
        map.set("rang", `⟩`);

        map.set("lt", `<`);
        map.set("gt", `>`);

        map.set("lceil", `⌈`);
        map.set("rceil", `⌉`);

        map.set("lfloor", `⌊`);
        map.set("rfloor", `⌋`);

        map.set("lmoustache", `⎰`);
        map.set("rmoustache", `⎱`);

        map.set("lgroup", `⟮`);
        map.set("rgroup", `⟯`);

        map.set("ulcorner", `┌`);
        map.set("urcorner", `┐`);

        map.set("llcorner", `└`);
        map.set("lrcorner", `┘`);

        map.set("llbracket", `⟦`);
        map.set("rrbracket", `⟧`);

        map.set("lBrace", `⦃`);
        map.set("rBrace", `⦄`);

        /**
         * 字母 Letters
         * REF: https://katex.org/docs/supported#letters-and-unicode
        */
        /* 大写希腊字母 */
        map.set("Alpha", `A`);
        map.set("Beta", `B`);
        map.set("Gamma", `Γ`);
        map.set("Delta", `Δ`);
        map.set("Epsilon", `E`);
        map.set("Zeta", `Z`);
        map.set("Eta", `H`);
        map.set("Theta", `Θ`);
        map.set("Iota", `I`);
        map.set("Kappa", `K`);
        map.set("Lambda", `Λ`);
        map.set("Mu", `M`);
        map.set("Nu", `N`);
        map.set("Xi", `Ξ`);
        map.set("Omicron", `O`);
        map.set("Pi", `Π`);
        map.set("Rho", `P`);
        map.set("Sigma", `Σ`);
        map.set("Tau", `T`);
        map.set("Upsilon", `Υ`);
        map.set("Phi", `Φ`);
        map.set("Chi", `X`);
        map.set("Psi", `Ψ`);
        map.set("Omega", `Ω`);

        map.set("varGamma", `Γ`);
        map.set("varDelta", `Δ`);
        map.set("varTheta", `Θ`);
        map.set("varLambda", `Λ`);
        map.set("varXi", `Ξ`);
        map.set("varPi", `Π`);
        map.set("varSigma", `Σ`);
        map.set("varUpsilon", `Υ`);
        map.set("varPhi", `Φ`);
        map.set("varPsi", `Ψ`);
        map.set("varOmega", `Ω`);

        /* 小写希腊字母 */
        map.set("alpha", `α`);
        map.set("beta", `β`);
        map.set("gamma", `γ`);
        map.set("delta", `δ`);
        map.set("epsilon", `ϵ`);
        map.set("zeta", `ζ`);
        map.set("eta", `η`);
        map.set("theta", `θ`);
        map.set("iota", `ι`);
        map.set("kappa", `κ`);
        map.set("lambda", `λ`);
        map.set("mu", `μ`);
        map.set("nu", `ν`);
        map.set("omicron", `o`);
        map.set("xi", `ξ`);
        map.set("pi", `π`);
        map.set("rho", `ρ`);
        map.set("sigma", `σ`);
        map.set("tau", `τ`);
        map.set("upsilon", `υ`);
        map.set("phi", `ϕ`);
        map.set("chi", `χ`);
        map.set("psi", `ψ`);
        map.set("omega", `ω`);

        map.set("varepsilon", `ε`);
        map.set("varkappa", `ϰ`);
        map.set("vartheta", `ϑ`);
        map.set("thetasym", `ϑ`);
        map.set("varpi", `ϖ`);
        map.set("varrho", `ϱ`);
        map.set("varsigma", `ς`);
        map.set("varphi", `φ`);
        map.set("digamma", `ϝ`);

        /* 其他字母 */
        map.set("imath", ``);
        map.set("nabla", `∇`);
        map.set("Im", `ℑ`);
        map.set("Reals", `R`);
        map.set("OE", `Œ`);
        map.set("jmath", ``);
        map.set("partial", `∂`);
        map.set("image", `ℑ`);
        map.set("wp", `℘`);
        map.set("o", `ø`);
        map.set("aleph", `ℵ`);
        map.set("Game", `⅁`);
        map.set("Bbbk", `k`);
        map.set("weierp", `℘`);
        map.set("O", `Ø`);
        map.set("alef", `ℵ`);
        map.set("Finv", `Ⅎ`);
        map.set("N", `N`);
        map.set("Z", `Z`);
        map.set("ss", `ß`);
        map.set("alefsym", `ℵ`);
        map.set("cnums", `C`);
        map.set("natnums", `N`);
        map.set("aa", `å`);
        map.set("i", `ı`);
        map.set("beth", `ℶ`);
        map.set("Complex", `C`);
        map.set("R", `R`);
        map.set("AA", `Å`);
        map.set("j", `ȷ`);
        map.set("gimel", `ℷ`);
        map.set("ell", `ℓ`);
        map.set("Re", `ℜ`);
        map.set("ae", `æ`);
        map.set("daleth", `ℸ`);
        map.set("hbar", `ℏ`);
        map.set("real", `ℜ`);
        map.set("AE", `Æ`);
        map.set("eth", `ð`);
        map.set("hslash", `ℏ`);
        map.set("reals", `R`);
        map.set("oe", `œ`);

        /**
         * 空白 Spacing
         * REF: https://katex.org/docs/supported#overlap-and-spacing
        */
        map.set(",", `³∕₁₈ em`);
        map.set("thinspace", `³∕₁₈ em`);
        map.set(">", `⁴∕₁₈ em`);
        map.set(":", `⁴∕₁₈ em`);
        map.set("medspace", `⁴∕₁₈ em`);
        map.set(";", `⁵∕₁₈ em`);
        map.set("thickspace", `⁵∕₁₈ em`);
        map.set("enspace", `¹∕₂ em`);
        map.set("quad", `1 em`);
        map.set("qquad", `2 em`);
        map.set("!", `³∕₁₈ em`);
        map.set("negthinspace", `³∕₁₈ em`);
        map.set("negmedspace", `⁴∕₁₈ em`);
        map.set("negthickspace", `⁵∕₁₈ em`);

        /**
         * 逻辑 & 集合 Logic & Set
         * REF: https://katex.org/docs/supported#logic-and-set-theory
        */
        map.set("forall", `∀`);
        map.set("complement", `∁`);
        map.set("therefore", `∴`);
        map.set("emptyset", `∅`);
        map.set("exists", `∃`);
        map.set("subset", `⊂`);
        map.set("because", `∵`);
        map.set("empty", `∅`);
        map.set("exist", `∃`);
        map.set("supset", `⊃`);
        map.set("mapsto", `↦`);
        map.set("varnothing", `∅`);
        map.set("nexists", `∄`);
        map.set("mid", `∣`);
        map.set("to", `→`);
        map.set("implies", `⟹`);
        map.set("in", `∈`);
        map.set("land", `∧`);
        map.set("gets", `←`);
        map.set("impliedby", `⟸`);
        map.set("isin", `∈`);
        map.set("lor", `∨`);
        map.set("leftrightarrow", `↔`);
        map.set("iff", `⟺`);
        map.set("notin", `∉`);
        map.set("ni", `∋`);
        map.set("notni", `∌`);
        map.set("neg", `¬`);
        map.set("lnot", `¬`);

        /**
         * 大型算子 
         * REF: REF: https://katex.org/docs/supported#big-operators
         */
        map.set("sum", `∑`);
        map.set("prod", `∏`);
        map.set("bigotimes", `⨂`);
        map.set("bigvee", `⋁`);
        map.set("int", `∫`);
        map.set("coprod", `∐`);
        map.set("bigoplus", `⨁`);
        map.set("bigwedge", `⋀`);
        map.set("iint", `∬`);
        map.set("intop", `∫`);
        map.set("bigodot", `⨀`);
        map.set("bigcap", `⋂`);
        map.set("iiint", `∭`);
        map.set("smallint", `∫`);
        map.set("biguplus", `⨄`);
        map.set("bigcup", `⋃`);
        map.set("oint", `∮`);
        map.set("oiint", `∯`);
        map.set("oiiint", `∰`);
        map.set("bigsqcup", `⨆`);

        /**
         * TODO: 二进制算子 Binary Operators
         * REF: https://katex.org/docs/supported#binary-operators
        */
        map.set("amalg", `⨿`);
        map.set("And", `&`);
        map.set("ast", `∗`);
        map.set("barwedge", `⊼`);
        map.set("bigcirc", `◯`);
        map.set("bmod", `mod`);
        map.set("boxdot", `⊡`);
        map.set("boxminus", `⊟`);
        map.set("boxplus", `⊞`);
        map.set("boxtimes", `⊠`);
        map.set("bullet", `∙`);
        map.set("Cap", `⋒`);
        map.set("cap", `∩`);

        map.set("cdot", `⋅`);
        map.set("cdotp", `⋅`);
        map.set("centerdot", `⋅`);
        map.set("circ", `∘`);
        map.set("circledast", `⊛`);
        map.set("circledcirc", `⊚`);
        map.set("circleddash", `⊝`);
        map.set("Cup", `⋓`);
        map.set("cup", `∪`);
        map.set("curlyvee", `⋎`);
        map.set("curlywedge", `⋏`);
        map.set("div", `÷`);
        map.set("divideontimes", `⋇`);
        map.set("dotplus", `∔`);
        map.set("doublebarwedge", `⩞`);
        map.set("doublecap", `⋒`);
        map.set("doublecup", `⋓`);

        map.set("gtrdot", `⋗`);
        map.set("intercal", `⊺`);
        map.set("land", `∧`);
        map.set("leftthreetimes", `⋋`);
        map.set("ldotp", `.`);
        map.set("lor", `∨`);
        map.set("lessdot", `⋖`);
        map.set("lhd", `⊲`);
        map.set("ltimes", `⋉`);
        map.set("mod", `mod`);
        map.set("mp", `∓`);
        map.set("odot", `⊙`);
        map.set("ominus", `⊖`);
        map.set("oplus", `⊕`);
        map.set("otimes", `⊗`);
        map.set("oslash", `⊘`);
        map.set("pm", `±`);
        map.set("plusmn", `±`);

        map.set("pmod", `(mod …)`);
        map.set("pod", `(…)`);
        map.set("rhd", `⊳`);
        map.set("rightthreetimes", `⋌`);
        map.set("rtimes", `⋊`);
        map.set("setminus", `∖`);
        map.set("smallsetminus", `∖`);
        map.set("sqcap", `⊓`);
        map.set("sqcup", `⊔`);
        map.set("times", `×`);
        map.set("unlhd", `⊴`);
        map.set("unrhd", `⊵`);
        map.set("uplus", `⊎`);
        map.set("vee", `∨`);
        map.set("veebar", `⊻`);
        map.set("wedge", `∧`);
        map.set("wr", `≀`);

        /**
         * 数学算子 Math Operators
         * REF: https://katex.org/docs/supported#math-operators
         */
        map.set("arcsin", `arcsin`);
        map.set("arccos", `arccos`);
        map.set("arctan", `arctan`);
        map.set("arctg", `arctg`);
        map.set("arcctg", `arcctg`);
        map.set("arg", `arg`);
        map.set("ch", `ch`);
        map.set("cos", `cos`);
        map.set("argmax", `arg max`);
        map.set("argmin", `arg min`);
        map.set("det", `det`);
        map.set("gcd", `gcd`);
        map.set("inf", `inf`);

        map.set("cosec", `cosec`);
        map.set("cosh", `cosh`);
        map.set("cot", `cot`);
        map.set("cotg", `cotg`);
        map.set("coth", `coth`);
        map.set("csc", `csc`);
        map.set("ctg", `ctg`);
        map.set("cth", `cth`);
        map.set("injlim", `inj lim`);
        map.set("lim", `lim`);
        map.set("liminf", `lim inf`);
        map.set("limsup", `lim sup`);
        map.set("max", `max`);

        map.set("deg", `deg`);
        map.set("dim", `dim`);
        map.set("exp", `exp`);
        map.set("hom", `hom`);
        map.set("ker", `ker`);
        map.set("lg", `lg`);
        map.set("ln", `ln`);
        map.set("log", `log`);
        map.set("min", `min`);
        map.set("plim", `plim`);
        map.set("Pr", `Pr`);
        map.set("projlim", `proj lim`);
        map.set("sup", `sup`);

        map.set("sec", `sec`);
        map.set("sin", `sin`);
        map.set("sinh", `sinh`);
        map.set("sh", `sh`);
        map.set("tan", `tan`);
        map.set("tanh", `tanh`);
        map.set("tg", `tg`);
        map.set("th", `th`);

        map.set("operatorname", `f`);
        map.set("operatorname*", `f`);
        map.set("operatornamewithlimits", `f`);

        /**
         * 关系 Relations
         * REF: https://katex.org/docs/supported#relations
         */
        map.set("not =", `≠`);

        map.set("=", `=`);
        map.set("<", `<`);
        map.set(">", `>`);
        map.set(":", `:`);
        map.set("approx", `≈`);
        map.set("approxcolon", `≈:`);
        map.set("approxcoloncolon", `≈∷`);
        map.set("approxeq", `≊`);
        map.set("asymp", `≍`);
        map.set("backepsilon", `∍`);
        map.set("backsim", `∽`);
        map.set("backsimeq", `⋍`);
        map.set("between", `≬`);
        map.set("bowtie", `⋈`);
        map.set("bumpeq", `≏`);
        map.set("Bumpeq", `≎`);
        map.set("circeq", `≗`);
        map.set("colonapprox", `:≈`);
        map.set("Colonapprox", `∷≈`);
        map.set("coloncolonapprox", `∷≈`);
        map.set("coloneq", `:−`);
        map.set("colonminus", `:−`);
        map.set("Coloneq", `∷−`);
        map.set("coloncolonminus", `∷−`);
        map.set("coloneqq", `≔`);
        map.set("colonequals", `≔`);
        map.set("Coloneqq", `∷=`);
        map.set("coloncolonequals", `∷=`);
        map.set("colonsim", `:∼`);
        map.set("Colonsim", `∷∼`);
        map.set("coloncolonsim", `∷∼`);
        map.set("cong", `≅`);
        map.set("curlyeqprec", `⋞`);
        map.set("curlyeqsucc", `⋟`);
        map.set("dashv", `⊣`);
        map.set("dblcolon", `∷`);
        map.set("coloncolon", `∷`);
        map.set("doteq", `≐`);
        map.set("Doteq", `≑`);

        map.set("doteqdot", `≑`);
        map.set("eqcirc", `≖`);
        map.set("eqcolon", `∹`);
        map.set("minuscolon", `∹`);
        map.set("Eqcolon", `−∷`);
        map.set("minuscoloncolon", `−∷`);
        map.set("eqqcolon", `≕`);
        map.set("equalscolon", `≕`);
        map.set("Eqqcolon", `=∷`);
        map.set("equalscoloncolon", `=∷`);
        map.set("eqsim", `≂`);
        map.set("eqslantgtr", `⪖`);
        map.set("eqslantless", `⪕`);
        map.set("equiv", `≡`);
        map.set("fallingdotseq", `≒`);
        map.set("frown", `⌢`);
        map.set("ge", `≥`);
        map.set("geq", `≥`);
        map.set("geqq", `≧`);
        map.set("geqslant", `⩾`);
        map.set("gg", `≫`);
        map.set("ggg", `⋙`);
        map.set("gggtr", `⋙`);
        map.set("gt", `>`);
        map.set("gtrapprox", `⪆`);
        map.set("gtreqless", `⋛`);
        map.set("gtreqqless", `⪌`);
        map.set("gtrless", `≷`);
        map.set("gtrsim", `≳`);
        map.set("imageof", `⊷`);
        map.set("in", `∈`);
        map.set("isin", `∈`);
        map.set("Join", `⋈`);
        map.set("le", `≤`);
        map.set("leq", `≤`);
        map.set("leqq", `≦`);
        map.set("leqslant", `⩽`);

        map.set("lessapprox", `⪅`);
        map.set("lesseqgtr", `⋚`);
        map.set("lesseqqgtr", `⪋`);
        map.set("lessgtr", `≶`);
        map.set("lesssim", `≲`);
        map.set("lll", `⋘`);
        map.set("llless", `⋘`);
        map.set("lt", `<`);
        map.set("mid", `∣`);
        map.set("models", `⊨`);
        map.set("multimap", `⊸`);
        map.set("origof", `⊶`);
        map.set("owns", `∋`);
        map.set("parallel", `∥`);
        map.set("perp", `⊥`);
        map.set("pitchfork", `⋔`);
        map.set("prec", `≺`);
        map.set("precapprox", `⪷`);
        map.set("preccurlyeq", `≼`);
        map.set("preceq", `⪯`);
        map.set("precsim", `≾`);
        map.set("propto", `∝`);
        map.set("risingdotseq", `≓`);
        map.set("shortmid", `∣`);
        map.set("shortparallel", `∥`);
        map.set("sim", `∼`);
        map.set("simcolon", `∼:`);
        map.set("simcoloncolon", `∼∷`);
        map.set("simeq", `≃`);
        map.set("smallfrown", `⌢`);
        map.set("smallsmile", `⌣`);

        map.set("smile", `⌣`);
        map.set("sqsubset", `⊏`);
        map.set("sqsubseteq", `⊑`);
        map.set("sqsupset", `⊐`);
        map.set("sqsupseteq", `⊒`);
        map.set("subset", `⊂`);
        map.set("sub", `⊂`);
        map.set("subseteq", `⊆`);
        map.set("sube", `⊆`);
        map.set("subseteqq", `⫅`);
        map.set("succ", `≻`);
        map.set("succapprox", `⪸`);
        map.set("succcurlyeq", `≽`);
        map.set("succeq", `⪰`);
        map.set("succsim", `≿`);
        map.set("Supset", `⋑`);
        map.set("supset", `⊃`);
        map.set("supseteq", `⊇`);
        map.set("supe", `⊇`);
        map.set("supseteqq", `⫆`);
        map.set("thickapprox", `≈`);
        map.set("thicksim", `∼`);
        map.set("trianglelefteq", `⊴`);
        map.set("triangleq", `≜`);
        map.set("trianglerighteq", `⊵`);
        map.set("varpropto", `∝`);
        map.set("vartriangle", `△`);
        map.set("vartriangleleft", `⊲`);
        map.set("vartriangleright", `⊳`);
        map.set("vcentcolon", `:`);
        map.set("ratio", `:`);
        map.set("vdash", `⊢`);
        map.set("vDash", `⊨`);
        map.set("Vdash", `⊩`);
        map.set("Vvdash", `⊪`);

        /**
         * 否定关系符号 Negated relations
         * REF: https://katex.org/docs/supported#negated-relations
         */
        map.set("not =", `≠`);

        map.set("gnapprox", `⪊`);
        map.set("gneq", `⪈`);
        map.set("gneqq", `≩`);
        map.set("gnsim", `⋧`);
        map.set("gvertneqq", `≩`);
        map.set("lnapprox", `⪉`);
        map.set("lneq", `⪇`);
        map.set("lneqq", `≨`);
        map.set("lnsim", `⋦`);
        map.set("lvertneqq", `≨`);
        map.set("ncong", `≆`);
        map.set("ne", `≠`);
        map.set("neq", `≠`);
        map.set("ngeq", `≱`);
        map.set("ngeqq", `≱`);

        map.set("ngeqslant", `≱`);
        map.set("ngtr", `≯`);
        map.set("nleq", `≰`);
        map.set("nleqq", `≰`);
        map.set("nleqslant", `≰`);
        map.set("nless", `≮`);
        map.set("nmid", `∤`);
        map.set("notin", `∉`);
        map.set("notni", `∌`);
        map.set("nparallel", `∦`);
        map.set("nprec", `⊀`);
        map.set("npreceq", `⋠`);
        map.set("nshortmid", `∤`);
        map.set("nshortparallel", `∦`);
        map.set("nsim", `≁`);

        map.set("nsubseteq", `⊈`);
        map.set("nsubseteqq", `⊈`);
        map.set("nsucc", `⊁`);
        map.set("nsucceq", `⋡`);
        map.set("nsupseteq", `⊉`);
        map.set("nsupseteqq", `⊉`);
        map.set("ntriangleleft", `⋪`);
        map.set("ntrianglelefteq", `⋬`);
        map.set("ntriangleright", `⋫`);
        map.set("ntrianglerighteq", `⋭`);
        map.set("nvdash", `⊬`);
        map.set("nvDash", `⊭`);
        map.set("nVDash", `⊯`);
        map.set("nVdash", `⊮`);
        map.set("precnapprox", `⪹`);

        map.set("precneqq", `⪵`);
        map.set("precnsim", `⋨`);
        map.set("subsetneq", `⊊`);
        map.set("subsetneqq", `⫋`);
        map.set("succnapprox", `⪺`);
        map.set("succneqq", `⪶`);
        map.set("succnsim", `⋩`);
        map.set("supsetneq", `⊋`);
        map.set("supsetneqq", `⫌`);
        map.set("varsubsetneq", `⊊`);
        map.set("varsubsetneqq", `⫋`);
        map.set("varsupsetneq", `⊋`);
        map.set("varsupsetneqq", `⫌`);

        /**
         * 箭头 Arrows
         * REF: REF: https://katex.org/docs/supported#arrows
         */
        map.set("circlearrowleft", `↺`);
        map.set("circlearrowright", `↻`);
        map.set("curvearrowleft", `↶`);
        map.set("curvearrowright", `↷`);
        map.set("Darr", `⇓`);
        map.set("dArr", `⇓`);
        map.set("darr", `↓`);
        map.set("dashleftarrow", `⇠`);
        map.set("dashrightarrow", `⇢`);
        map.set("downarrow", `↓`);
        map.set("Downarrow", `⇓`);
        map.set("downdownarrows", `⇊`);
        map.set("downharpoonleft", `⇃`);
        map.set("downharpoonright", `⇂`);
        map.set("gets", `←`);
        map.set("Harr", `⇔`);
        map.set("hArr", `⇔`);
        map.set("harr", `↔`);
        map.set("hookleftarrow", `↩`);
        map.set("hookrightarrow", `↪`);
        map.set("iff", `⟺`);
        map.set("impliedby", `⟸`);
        map.set("implies", `⟹`);
        map.set("Larr", `⇐`);
        map.set("lArr", `⇐`);
        map.set("larr", `←`);
        map.set("leadsto", `⇝`);
        map.set("leftarrow", `←`);
        map.set("Leftarrow", `⇐`);
        map.set("leftarrowtail", `↢`);
        map.set("leftharpoondown", `↽`);

        map.set("leftharpoonup", `↼`);
        map.set("leftleftarrows", `⇇`);
        map.set("leftrightarrow", `↔`);
        map.set("Leftrightarrow", `⇔`);
        map.set("leftrightarrows", `⇆`);
        map.set("leftrightharpoons", `⇋`);
        map.set("leftrightsquigarrow", `↭`);
        map.set("Lleftarrow", `⇚`);
        map.set("longleftarrow", `⟵`);
        map.set("Longleftarrow", `⟸`);
        map.set("longleftrightarrow", `⟷`);
        map.set("Longleftrightarrow", `⟺`);
        map.set("longmapsto", `⟼`);
        map.set("longrightarrow", `⟶`);
        map.set("Longrightarrow", `⟹`);
        map.set("looparrowleft", `↫`);
        map.set("looparrowright", `↬`);
        map.set("Lrarr", `⇔`);
        map.set("lrArr", `⇔`);
        map.set("lrarr", `↔`);
        map.set("Lsh", `↰`);
        map.set("mapsto", `↦`);
        map.set("nearrow", `↗`);
        map.set("nleftarrow", `↚`);
        map.set("nLeftarrow", `⇍`);
        map.set("nleftrightarrow", `↮`);
        map.set("nLeftrightarrow", `⇎`);
        map.set("nrightarrow", `↛`);
        map.set("nRightarrow", `⇏`);
        map.set("nwarrow", `↖`);
        map.set("Rarr", `⇒`);

        map.set("rArr", `⇒`);
        map.set("rarr", `→`);
        map.set("restriction", `↾`);
        map.set("rightarrow", `→`);
        map.set("Rightarrow", `⇒`);
        map.set("rightarrowtail", `↣`);
        map.set("rightharpoondown", `⇁`);
        map.set("rightharpoonup", `⇀`);
        map.set("rightleftarrows", `⇄`);
        map.set("rightleftharpoons", `⇌`);
        map.set("rightrightarrows", `⇉`);
        map.set("rightsquigarrow", `⇝`);
        map.set("Rrightarrow", `⇛`);
        map.set("Rsh", `↱`);
        map.set("searrow", `↘`);
        map.set("swarrow", `↙`);
        map.set("to", `→`);
        map.set("twoheadleftarrow", `↞`);
        map.set("twoheadrightarrow", `↠`);
        map.set("Uarr", `⇑`);
        map.set("uArr", `⇑`);
        map.set("uarr", `↑`);
        map.set("uparrow", `↑`);
        map.set("Uparrow", `⇑`);
        map.set("updownarrow", `↕`);
        map.set("Updownarrow", `⇕`);
        map.set("upharpoonleft", `↿`);
        map.set("upharpoonright", `↾`);
        map.set("upuparrows", `⇈`);

        /* 可伸缩箭头 */
        map.set("xleftarrow", `←`);
        map.set("xrightarrow", `→`);
        map.set("xLeftarrow", `⇐`);
        map.set("xRightarrow", `⇒`);
        map.set("xleftrightarrow", `↔`);
        map.set("xLeftrightarrow", `⇔`);
        map.set("xhookleftarrow", `↩`);
        map.set("xhookrightarrow", `↪`);
        map.set("xtwoheadleftarrow", `↞`);
        map.set("xtwoheadrightarrow", `↠`);
        map.set("xleftharpoonup", `↼`);
        map.set("xrightharpoonup", `⇀`);
        map.set("xleftharpoondown", `↽`);
        map.set("xrightharpoondown", `⇁`);
        map.set("xleftrightharpoons", `⇋`);
        map.set("xrightleftharpoons", `⇌`);
        map.set("xtofrom", `⇄`);
        map.set("xmapsto", `↦`);
        map.set("xlongequal", `=`);

        /**
         * 特殊符号 Special Notation
         * REF: https://katex.org/docs/supported#special-notation
         */
        map.set("bra", `⟨ … |`);
        map.set("ket", `| … ⟩`);
        map.set("braket", `⟨ … ⟩`);
        map.set("Bra", `⟨ … |`);
        map.set("Ket", `| … ⟩`);
        map.set("Braket", `⟨ … ⟩`);

        /**
         * 标点符号 Symbols & Punctuation
         * REF: https://katex.org/docs/supported#symbols-and-punctuation
        */
        map.set("%", `%`);
        map.set("#", `#`);
        map.set("&", `&`);
        map.set("_", `_`);
        map.set("textunderscore", `_`);
        map.set("textendash", `–`);
        map.set("textemdash", `—`);
        map.set("textasciitilde", `~`);
        map.set("textasciicircum", `^`);
        map.set("textquoteleft", `‘`);
        map.set("lq", `‘`);
        map.set("textquoteright", `’`);
        map.set("rq", `’`);
        map.set("textquotedblleft", `“`);
        map.set("textquotedblright", `”`);
        map.set("colon", `:`);
        map.set("backprime", `‵`);
        map.set("prime", `′`);
        map.set("textless", `<`);
        map.set("textgreater", `>`);
        map.set("textbar", `|`);
        map.set("textbardbl", `∥`);
        map.set("textbraceleft", `{`);
        map.set("textbraceright", `}`);
        map.set("textbackslash", `\\`);
        map.set("P", `¶`);
        map.set("S", `§`);
        map.set("sect", `§`);
        map.set("copyright", `©`);
        map.set("circledR", `®`);
        map.set("textregistered", `®`);
        map.set("circledS", `Ⓢ`);
        map.set("textcircled", `◯`);

        map.set("dots", `…`);
        map.set("cdots", `⋯`);
        map.set("ddots", `⋱`);
        map.set("ldots", `…`);
        map.set("vdots", `⋮`);
        map.set("dotsb", `⋯`);
        map.set("dotsc", `…`);
        map.set("dotsi", `⋯⁣`);
        map.set("dotsm", `⋯`);
        map.set("dotso", `…`);
        map.set("sdot", `⋅`);
        map.set("mathellipsis", `…`);
        map.set("text", `…`);
        map.set("Box", `□`);
        map.set("square", `□`);
        map.set("blacksquare", `■`);
        map.set("triangle", `△`);
        map.set("triangledown", `▽`);
        map.set("triangleleft", `◃`);
        map.set("triangleright", `▹`);
        map.set("bigtriangledown", `▽`);
        map.set("bigtriangleup", `△`);
        map.set("blacktriangle", `▲`);
        map.set("blacktriangledown", `▼`);
        map.set("blacktriangleleft", `◀`);
        map.set("blacktriangleright", `▶`);
        map.set("diamond", `⋄`);
        map.set("Diamond", `◊`);
        map.set("lozenge", `◊`);
        map.set("blacklozenge", `⧫`);
        map.set("star", `⋆`);
        map.set("bigstar", `★`);
        map.set("clubsuit", `♣`);
        map.set("clubs", `♣`);
        map.set("diamondsuit", `♢`);
        map.set("diamonds", `♢`);
        map.set("spadesuit", `♠`);
        map.set("maltese", `✠`);

        map.set("KaTeX", `KᴬTᴇX`);
        map.set("LaTeX", `LᴬTᴇX`);
        map.set("TeX", `TᴇX`);
        map.set("nabla", `∇`);
        map.set("infty", `∞`);
        map.set("infin", `∞`);
        map.set("checkmark", `✓`);
        map.set("dag", `†`);
        map.set("dagger", `†`);
        map.set("ddag", `†`);
        map.set("ddagger", `‡`);
        map.set("textdagger", `‡`);
        map.set("textdaggerdbl", `‡`);
        map.set("Dagger", `‡`);
        map.set("angle", `∠`);
        map.set("measuredangle", `∡`);
        map.set("sphericalangle", `∢`);
        map.set("top", `⊤`);
        map.set("bot", `⊥`);
        map.set("$", `$`);
        map.set("textdollar", `$`);
        map.set("pounds", `£`);
        map.set("mathsterling", `£`);
        map.set("textsterling", `£`);
        map.set("yen", `¥`);
        map.set("surd", `√`);
        map.set("degree", `°`);
        map.set("textdegree", `°`);
        map.set("mho", `℧`);
        map.set("diagdown", `╲`);
        map.set("diagup", `╱`);
        map.set("flat", `♭`);
        map.set("natural", `♮`);
        map.set("sharp", `♯`);
        map.set("heartsuit", `♡`);
        map.set("hearts", `♡`);
        map.set("spades", `♠`);
        map.set("minuso", `⦵`);
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
            const item: Monaco.languages.CompletionItem = {
                // label: `\\${cmd}`,
                label: {
                    label: `\\${cmd}`,
                    // detail: "detail",
                    description: info?.description,
                },
                detail: cmd,
                kind: info?.kind ?? this._monaco.languages.CompletionItemKind.Field,
                documentation: info?.documentation,
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
            const item: Monaco.languages.CompletionItem = {
                // label: `\\${cmd}{...}`,
                label: {
                    label: `\\${cmd}{...}`,
                    // detail: "detail",
                    description: info?.description,
                },
                detail: cmd,
                kind: info?.kind ?? this._monaco.languages.CompletionItemKind.Function,
                documentation: info?.documentation,
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
            const item: Monaco.languages.CompletionItem = {
                // label: `\\${cmd}{...}{...}`,
                label: {
                    label: `\\${cmd}{...}{...}`,
                    // detail: "detail",
                    description: info?.description,
                },
                detail: cmd,
                kind: info?.kind ?? this._monaco.languages.CompletionItemKind.Class,
                documentation: info?.documentation,
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
            const item: Monaco.languages.CompletionItem = {
                // label: `\\${cmd}[...]{...}`,
                label: {
                    label: `\\${cmd}[...]{...}`,
                    // detail: "detail",
                    description: info?.description,
                },
                detail: cmd,
                kind: info?.kind ?? this._monaco.languages.CompletionItemKind.Class,
                documentation: info?.documentation,
                insertText: `${cmd}[$1]{$2}`,
                insertTextRules: this._monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: undefined,
            };
            return item;
        });

        // \begin{$1} $2 \end{$1}
        const envSnippet: Monaco.languages.CompletionItem = {
            // label: "\\begin{...} ... \\end{...}",
            label: {
                label: "\\begin{...} ... \\end{...}",
                // detail: "detail",
                description: "Environments",
            },
            detail: "begin",
            kind: this._monaco.languages.CompletionItemKind.Snippet,
            documentation: this.makeDocumentation(),
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
            // label: "\\begin{array}{...} ... \\end{array}",
            label: {
                label: "\\begin{array}{...} ... \\end{array}",
                // detail: "detail",
                description: "Array & Table",
            },
            detail: "begin",
            kind: this._monaco.languages.CompletionItemKind.Snippet,
            documentation: this.makeDocumentation("{array}"),
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
            // label: "\\begin{matrix*}[...] ... \\end{matrix*}",
            label: {
                label: "\\begin{matrix*}[...] ... \\end{matrix*}",
                // detail: "detail",
                description: "Matrix",
            },
            detail: "begin",
            kind: this._monaco.languages.CompletionItemKind.Snippet,
            documentation: this.makeDocumentation("{matrix*}"),
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

        for (const item of mathSuggestions) {
            // sortText
            const label = typeof item.label === "string" ? item.label : item.label.label;
            item.sortText = label.replace(/[a-zA-Z]/g, (c) => {
                if (/[a-z]/.test(c)) {
                    return `0${c}`;
                } else {
                    return `1${c.toLowerCase()}`;
                }
            });

            // detail
            const name = item.detail;
            const detail = this.katexFuncName2detail.get(name);
            if (detail) {
                const detail_padded = detail.padStart(30 - label.length + detail.length, " ");
                if (typeof item.label === "string") {
                    item.label = {
                        label,
                        detail: detail_padded,
                    };
                }
                else {
                    item.label.detail = detail_padded;
                }
            }
        }

        return mathSuggestions;
    }
}
