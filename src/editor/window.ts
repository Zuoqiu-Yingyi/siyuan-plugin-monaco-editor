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

import { EditorBridgeMaster, type IWindowParams } from "@/bridge/master";
import { Facade, type IFacadeWindowOptions } from "@/facades/facade";
import { merge } from "@workspace/utils/misc/merge";

import type MonacoEditorPlugin from "@/index";
import type { IMonacoEditorOptions } from "@/types/config";
import type { Electron } from "@workspace/types/electron";

export class EditorWindow {
    public readonly bridge: InstanceType<typeof EditorBridgeMaster>;
    public readonly facade: InstanceType<typeof Facade>;
    protected _window: Window | Electron.BrowserWindow;

    constructor(
        protected readonly plugin: InstanceType<typeof MonacoEditorPlugin>,
    ) {
        this.bridge = new EditorBridgeMaster(
            this.plugin,
            EditorBridgeMaster.createChannel(false),
        );
        this.facade = new Facade(this.plugin);
    }

    public get window() {
        return this.window;
    }

    public open(params: IWindowParams) {
        this._window = this.bridge.createEditorWindow(params);
    }

    public async init(options: {
        options: IMonacoEditorOptions,
        facadeOptions: IFacadeWindowOptions,
    }) {
        const { handler } = await this.facade.makeWindowOptions(options.facadeOptions);
        this.bridge.addEventListener("editor-ready", e => {
            if (e.data.data.status) {
                this.bridge.init({
                    name: this.plugin.name,
                    i18n: this.plugin.i18n,

                    path: globalThis.siyuan.config.system.workspaceDir,
                    diff: !!handler.original,
                    locale: globalThis.siyuan.config.lang,

                    savable: !!handler.update,

                    original: handler.original,
                    modified: handler.modified,
                    options: merge(
                        options.options,
                        handler.options,
                    ),
                    originalOptions: handler.originalOptions,
                    modifiedOptions: handler.modifiedOptions,
                    diffOptions: handler.diffOptions,
                });
            }
        });
        this.bridge.addEventListener("editor-save", e => {
            handler.update?.(e.data.data.value);
        });
        this.bridge.addEventListener("editor-hover-siyuan", e => {
            /* 悬浮显示思源块 */
            this.plugin.openFloatLayer(e.data.data);
        });
        this.bridge.addEventListener("editor-open-siyuan", e => {
            /* 在新页签打开思源块 */
            this.plugin.openDocTab(e.data.data);
        });
    }

    public close() {
        this._window.close();
        this.bridge.destroy();
    }
}
