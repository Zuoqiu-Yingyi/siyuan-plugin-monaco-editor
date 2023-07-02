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

import { FLAG_MOBILE } from "@workspace/utils/env/front-end";
import { Logger } from "@workspace/utils/logger";
import { merge } from "@workspace/utils/misc/merge";

import { DEFAULT_CONFIG } from "./configs/default";
import type { IConfig } from "./types/config";

export default class CustomBlockPlugin extends siyuan.Plugin {
    static readonly GLOBAL_CONFIG_NAME = "global-config";

    public readonly siyuan = siyuan;
    public readonly logger: InstanceType<typeof Logger>;

    protected readonly STYLE_ELEMENT_ID: string;
    protected readonly SETTINGS_DIALOG_ID: string;
    protected readonly SYSTEM_FONTS_DIALOG_ID: string;
    protected readonly USABLE_FONTS_DIALOG_ID: string;

    protected config: IConfig;

    constructor(options: any) {
        super(options);

        this.logger = new Logger(this.name);
        this.SETTINGS_DIALOG_ID = `plugin-${this.name}-settings-dialog`;
    }

    onload(): void {
        this.loadData(CustomBlockPlugin.GLOBAL_CONFIG_NAME)
            .then(config => {
                this.config = merge(DEFAULT_CONFIG, config || {}) as IConfig;
            })
            .catch(error => this.logger.error(error))
            .finally(() => {
            });
    }

    onLayoutReady(): void {
    }

    onunload(): void {
    }

    openSetting(): void {
    }

    /* 重置插件配置 */
    public async resetConfig(): Promise<void> {
        return this.updateConfig(merge(DEFAULT_CONFIG) as IConfig);
    }

    /* 更新插件配置 */
    public async updateConfig(config?: IConfig): Promise<void> {
        if (config && config !== this.config) {
            this.config = config;
        }
        return this.saveData(CustomBlockPlugin.GLOBAL_CONFIG_NAME, this.config);
    }
};
