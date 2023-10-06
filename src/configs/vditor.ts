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

import { isLightTheme } from "@workspace/utils/siyuan/theme";
import { AssetsUploadMode } from "@/vditor/asset";
import type { IVditorProps } from "@/types/vditor";

export const DEFAULT_VDITOR_PROPS: Omit<
    IVditorProps,
    "plugin" |
    "src2url" |
    "baseURL" |
    "rootURL"
> = {
    path: "/",
    get vditorID() { return `vditor-${Date.now()}` },
    assetsDirPath: "/assets/vditor/",
    assetsUploadMode: AssetsUploadMode.assets,
    options: {},
    value: "",
    get theme() { return isLightTheme() },
    codeBlockThemeLight: "xcode",
    codeBlockThemeDark: "dracula",
    updatable: true,
    changable: false,
    debug: false,
} as const;
