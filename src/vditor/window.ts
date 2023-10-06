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

import { VditorBridgeMaster } from "@/bridge/VditorMaster";
import { Facade, type IFacadeAssetOptions } from "@/facades/facade";

import type MonacoEditorPlugin from "@/index";
import type { IWindowParams } from "@/bridge";
import type { IVditor } from "@/types/config";
import type { Electron } from "@workspace/types/electron";
import type { IAssetHandler } from "@/handlers/asset";
import { isLightTheme } from "@workspace/utils/siyuan/theme";

export class VditorWindow {
    public readonly bridge: InstanceType<typeof VditorBridgeMaster>;
    public readonly facade: InstanceType<typeof Facade>;
    protected _window: Window | Electron.BrowserWindow;

    constructor(
        protected readonly plugin: InstanceType<typeof MonacoEditorPlugin>,
    ) {
        this.bridge = new VditorBridgeMaster(
            this.plugin,
            VditorBridgeMaster.createChannel(false),
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
        vditor: IVditor,
        facadeOptions: IFacadeAssetOptions,
    }) {
        const { handler } = await this.facade.makeWindowOptions(options.facadeOptions) as { handler: IAssetHandler };
        this.bridge.addEventListener("vditor-ready", e => {
            if (e.data.data.status) {
                this.bridge.init({
                    name: this.plugin.name,
                    i18n: this.plugin.i18n,

                    path: handler.path,
                    value: handler.modified.value,
                    theme: isLightTheme(),
                    codeBlockThemeLight: globalThis.siyuan?.config?.appearance?.codeBlockThemeLight,
                    codeBlockThemeDark: globalThis.siyuan?.config?.appearance?.codeBlockThemeDark,
                    assetsDirPath: options.vditor.assetsDirPath,
                    assetsUploadMode: options.vditor.assetsUploadMode,
                    options: options.vditor.options,
                });
            }
        });
        this.bridge.addEventListener("vditor-save", e => {
            handler.update?.(e.data.data.markdown);
        });
        this.bridge.addEventListener("vditor-open-link", e => {
            this.plugin.openLinkEventHandler(e.data.data);
        });
    }

    public close() {
        this._window.close();
        this.bridge.destroy();
    }
}
