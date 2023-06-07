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

import { Logger } from "@workspace/utils/logger";
import { removeElementById } from "@workspace/utils/dom";
import { updateStyleByID } from "@workspace/utils/dom/style";

import {
    baseStyle,
    fontFamilyStyle,
} from "./utils/style";

export default class WebviewPlugin extends siyuan.Plugin {
    static readonly GLOBAL_CONFIG_NAME = "global-config";

    public readonly siyuan = siyuan;
    public readonly logger: InstanceType<typeof Logger>;

    protected readonly STYLE_ELEMENT_ID: string;

    constructor(options: any) {
        super(options);

        this.logger = new Logger(this.name);
        this.STYLE_ELEMENT_ID = `${this.name}-style`;
    }

    onload(): void {
        updateStyleByID(
            this.STYLE_ELEMENT_ID,
            [
                baseStyle(this.name),
                fontFamilyStyle({
                    emoji: [
                        "Twitter Color Emoji",
                    ],
                }),
            ].join("\n\n"),
        );
    }

    onLayoutReady(): void {
    }

    onunload(): void {
        removeElementById(this.STYLE_ELEMENT_ID);
    }
};
