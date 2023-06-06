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

import "./index.less";

import siyuan from "siyuan";
import { dataURL2svg } from "@workspace/utils/misc/dataurl";
import { FLAG_MOBILE } from "@workspace/utils/env/front-end";

import Global from './Global.svelte'
import icon from "./assets/jupyter-icon.svg";


export default class JupyterClientPlugin extends siyuan.Plugin {
    private readonly ICON: string;
    private readonly TOP_BAR_MENU_ID: string;
    private readonly SETTINGS_DIALOG_ID: string;

    private top_bar_element: HTMLElement;

    constructor(options) {
        super(options);

        this.ICON = dataURL2svg(icon); // svg 图标
        this.TOP_BAR_MENU_ID = `${this.name}-top-bar-menu`;
        this.SETTINGS_DIALOG_ID = `${this.name}-settings-dialog`;
    }

    onload() {
        /* 添加标题栏按钮 */
        this.top_bar_element = this.addTopBar({
            icon: this.ICON,
            title: this.i18n.top_bar_title,
            position: "right",
            callback: () => {
                this.openTopBarMenu(this.top_bar_element.getBoundingClientRect());
            },
        });
    }

    onunload() {
    }

    openSetting() {
        this.openGlobalSettingsDialog(this.name);
    }

    private async openGlobalSettingsDialog(title: string) {
        const dialog = new siyuan.Dialog({
            title,
            content: `<div id="${this.SETTINGS_DIALOG_ID}"/>`,
            width: FLAG_MOBILE ? "92vw" : "520px",
        });
        const global = new Global({
            target: dialog.element.querySelector(`#${this.SETTINGS_DIALOG_ID}`),
        });
    }

    private async openTopBarMenu(rect: DOMRect) {
        const menu = new siyuan.Menu(this.TOP_BAR_MENU_ID);

        /* 添加全局设置菜单项 */
        menu.addItem({
            icon: "iconSettings",
            label: this.i18n.global_settings,
            click: () => this.openGlobalSettingsDialog(this.i18n.global_settings),
        });

        /* 添加文档设置菜单项 */
        menu.addItem({
            icon: "iconFile",
            label: this.i18n.document_settings,
            click: () => {
                new siyuan.Dialog({
                    title: this.i18n.document_settings,
                    content: '<div class="b3-dialog__content">This is a dialog</div>',
                    width: FLAG_MOBILE ? "92vw" : "520px",
                });
            }
        });

        // menu.addSeparator();

        /* 显示菜单 */
        if (FLAG_MOBILE) {
            menu.fullscreen();
        } else {
            menu.open({
                x: rect.right,
                y: rect.bottom,
                // isLeft: true,
            });
        }
    }
}
