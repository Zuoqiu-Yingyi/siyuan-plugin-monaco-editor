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

import siyuan from "siyuan";
import { Client } from "@siyuan-community/siyuan-sdk";
import {
    FLAG_MOBILE,
} from "@workspace/utils/env/front-end";
import { Logger } from "@workspace/utils/logger";
import { mergeIgnoreArray } from "@workspace/utils/misc/merge";
import { classify } from "@workspace/utils/font";

import { type IListItem } from "@workspace/components/siyuan/list/list";
import List from "@workspace/components/siyuan/list/List.svelte"

import { fontData2CssFontStyle } from "@workspace/utils/font/css";
import { getBlockMenuContext } from "@workspace/utils/siyuan/menu/block";

import Settings from "./components/Settings.svelte";

import {
    fontFamilyStyle,
} from "./utils/style";
import { DEFAULT_CONFIG } from "./configs/default";
import type { IConfig } from "./types/config";
import type { IClickBlockIconEvent } from "@workspace/types/siyuan/events";
import type { I18N } from "@/utils/i18n";

export default class CustomFontsPlugin extends siyuan.Plugin {
    static readonly GLOBAL_CONFIG_NAME = "global-config";

    declare public readonly i18n: I18N;

    public readonly siyuan = siyuan;
    public readonly logger: InstanceType<typeof Logger>;
    public readonly client: InstanceType<typeof Client>;

    protected readonly STYLE_SNIPPET_NAME: string;
    protected readonly SETTINGS_DIALOG_ID: string;
    protected readonly SYSTEM_FONTS_DIALOG_ID: string;
    protected readonly USABLE_FONTS_DIALOG_ID: string;

    protected config: IConfig;

    constructor(options: any) {
        super(options);

        this.logger = new Logger(this.name);
        this.client = new Client();

        this.STYLE_SNIPPET_NAME = `plugin-${this.name}-style`;
        this.SETTINGS_DIALOG_ID = `plugin-${this.name}-settings-dialog`;
        this.SYSTEM_FONTS_DIALOG_ID = `plugin-${this.name}-system-fonts-dialog`;
        this.USABLE_FONTS_DIALOG_ID = `plugin-${this.name}-usable-fonts-dialog`;
    }

    onload(): void {
        this.loadData(CustomFontsPlugin.GLOBAL_CONFIG_NAME)
            .then(config => {
                this.config = mergeIgnoreArray(DEFAULT_CONFIG, config || {}) as IConfig;
            })
            .catch(error => this.logger.error(error))
            .finally(async () => {
                await this.updateStyle();

                this.eventBus.on("click-blockicon", this.blockMenuEventListener);

                /* 注册命令 */
                this.addCommand({
                    langKey: "show-system-fonts",
                    langText: this.i18n.settings.generalSettings.showSystemFonts.title,
                    hotkey: "",
                    callback: () => this.showSystemFonts(),
                });
                this.addCommand({
                    langKey: "show-usable-fonts",
                    langText: this.i18n.settings.generalSettings.showUsableFonts.title,
                    hotkey: "",
                    callback: () => this.showUsableFonts(),
                });
            });
    }

    onLayoutReady(): void {
    }

    onunload(): void {
        this.eventBus.off("click-blockicon", this.blockMenuEventListener);

        this.client.getSnippet({
            type: "css",
            enabled: 2,
        }).then(response => {
            const snippets = response.data.snippets;
            const snippet = snippets.find(s => s.name === this.STYLE_SNIPPET_NAME);
            if (snippet) {
                snippet.enabled = false;
                this.client.setSnippet({
                    snippets,
                });
            }
        });
    }

    openSetting(): void {
        const that = this;
        const dialog = new siyuan.Dialog({
            title: `${this.i18n.displayName} <code class="fn__code">${this.name}</code>`,
            content: `<div id="${that.SETTINGS_DIALOG_ID}" class="fn__flex-column" />`,
            width: FLAG_MOBILE ? "92vw" : "768px",
            height: FLAG_MOBILE ? undefined : "640px",
        });
        const settings = new Settings({
            target: dialog.element.querySelector(`#${that.SETTINGS_DIALOG_ID}`),
            props: {
                config: this.config,
                plugin: this,
                textareaHeight: 320,
            },
        });
    }

    /* 更新样式 */
    public async updateStyle(): Promise<void> {
        const response = await this.client.getSnippet({
            type: "css",
            enabled: 2,
        });
        const snippets = response.data.snippets;
        const snippet = snippets.find(s => s.name === this.STYLE_SNIPPET_NAME)
        const content = [
            this.config.css.enable ? this.config.css.code : undefined,
            fontFamilyStyle({
                base: this.config.fonts.base.enable ? this.config.fonts.base.list : undefined,
                code: this.config.fonts.code.enable ? this.config.fonts.code.list : undefined,
                graph: this.config.fonts.graph.enable ? this.config.fonts.graph.list : undefined,
                math: this.config.fonts.math.enable ? this.config.fonts.math.list : undefined,
                emoji: this.config.fonts.emoji.enable ? this.config.fonts.emoji.list : undefined,
            }),
        ].join("\n\n");

        if (snippet) {
            snippet.enabled = true;
            snippet.content = content;
        }
        else {
            snippets.push({
                id: globalThis.Lute.NewNodeID(),
                type: "css",
                name: this.STYLE_SNIPPET_NAME,
                memo: "",
                content,
                enabled: true,
            });
        }
        await this.client.setSnippet({
            snippets,
        });
    }

    /* 重置插件配置 */
    public async resetConfig(): Promise<void> {
        return this.updateConfig(mergeIgnoreArray(DEFAULT_CONFIG) as IConfig);
    }

    /* 更新插件配置 */
    public async updateConfig(config?: IConfig): Promise<void> {
        if (config && config !== this.config) {
            this.config = config;
        }
        this.updateStyle();
        return this.saveData(CustomFontsPlugin.GLOBAL_CONFIG_NAME, this.config);
    }

    /* 显示内核所在系统的字体列表 */
    public async showSystemFonts(): Promise<void> {
        const dialog = new siyuan.Dialog({
            title: this.i18n.settings.generalSettings.showSystemFonts.title,
            content: `<div id="${this.SYSTEM_FONTS_DIALOG_ID}" class="fn__flex-column">${this.i18n.message.loading}</div>`,
            height: `92vh`,
        });

        /* 查询系统字体 */
        siyuan.fetchPost(
            "/api/system/getSysFonts",
            undefined,
            (response) => {
                const dialog_body = dialog.element.querySelector(`#${this.SYSTEM_FONTS_DIALOG_ID}`);
                if (response.code === 0) { // 请求成功
                    const fonts: IListItem[] = response.data.map((font: string) => {
                        return {
                            icon: "#iconFont",
                            text: font,
                            meta: font,
                            style: `font-family: "${font}"`,
                        };
                    });

                    dialog_body.innerHTML = ""; // 移除文本 "加载中"
                    const list = new List({
                        target: dialog_body,
                        props: {
                            items: fonts,
                        },
                    });
                }
                else { // 请求失败
                    dialog_body.textContent = response.msg; // 显示响应信息
                }
            }
        );
    }

    /* 显示当前可用的字体列表 */
    public async showUsableFonts(): Promise<void> {
        // REF https://developer.mozilla.org/en-US/docs/Web/API/Window/queryLocalFonts
        if (globalThis.queryLocalFonts) { // 当前应用支持查询本地字体
            const availableFonts = await globalThis.queryLocalFonts(); // 本地字体列表
            const fonts: IListItem[] = []; // 待显示的字体列表

            const classified_fonts = classify(availableFonts);
            classified_fonts.families.forEach(family => {
                const font_list = classified_fonts.map.get(family);
                const reaular_font = font_list.find(font => font.style === "Regular") ?? font_list[0];
                fonts.push({
                    icon: "#iconFont",
                    text: reaular_font.fullName,
                    meta: reaular_font.family,
                    style: `font-family: "${reaular_font.family}"`,
                    fold: true,
                    // indent: "1em",
                    children: font_list.map(font => ({
                        icon: "#iconFont",
                        text: font.fullName,
                        meta: font.style,
                        style: `font: ${fontData2CssFontStyle(font, 14)};`,
                    })),
                });
            });

            const dialog = new siyuan.Dialog({
                title: this.i18n.settings.generalSettings.showUsableFonts.title,
                content: `<div id="${this.USABLE_FONTS_DIALOG_ID}" class="fn__flex-column" />`,
                height: `92vh`,
            });

            const list = new List({
                target: dialog.element.querySelector(`#${this.USABLE_FONTS_DIALOG_ID}`),
                props: {
                    items: fonts,
                },
            });
        }
        else { // 当前应用不支持查询本地字体
            siyuan.showMessage(`${this.i18n.message.notSupportQueryLocalFonts}<br />[${this.i18n.displayName} <code class="fn__code">${this.name}</code>]`, undefined, "error");
        }
    }

    /* 块菜单 */
    protected readonly blockMenuEventListener = (e: IClickBlockIconEvent) => {
        // this.logger.debug(e);
        const detail = e.detail;
        const context = getBlockMenuContext(e.detail);
        if (context) {
            const submenu: siyuan.IMenuItemOption[] = [];

            /* 清除字体 */
            submenu.push({
                icon: "iconClear",
                label: this.i18n.menu.clearFontStyle.label,
                click: () => {
                    context.blocks.forEach(async block => {
                        block.element.style.fontFamily = null;
                        const style = block.element.getAttribute("style");
                        this.client.setBlockAttrs({
                            id: block.id,
                            attrs: {
                                style,
                            },
                        });
                    });
                },
            });

            submenu.push({
                type: "separator",
            });

            /* 设置字体 */
            this.config.menu.block.list.forEach(font => {
                if (/^\s*$/.test(font)) return;
                else font = font.trim();

                submenu.push({
                    icon: "iconFont",
                    label: font,
                    accelerator: `font-family: ${font}`,
                    click: () => {
                        context.blocks.forEach(async block => {
                            block.element.style.fontFamily = font;
                            const style = block.element.getAttribute("style");
                            this.client.setBlockAttrs({
                                id: block.id,
                                attrs: {
                                    style,
                                },
                            });
                        });
                    },
                    bind: element => {
                        const label: HTMLElement = element.querySelector(".b3-menu__label");
                        if (label) {
                            label.style.fontFamily = font;
                        }
                    },
                });
            });

            detail.menu.addItem({
                icon: "iconFont",
                label: this.i18n.menu.customBlockFont.label,
                submenu,
            });
        }
    }
};
