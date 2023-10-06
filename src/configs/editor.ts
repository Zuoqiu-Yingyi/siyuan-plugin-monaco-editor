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

import type { IEditorProps } from "@/types/editor";
import { isLightTheme } from "@workspace/utils/siyuan/theme";

export const DEFAULT_EDITOR_PROPS: Omit<IEditorProps, "plugin"> = {
    embed: false,
    path: "",
    diff: false,
    get locale(): string { return globalThis.navigator.language },
    savable: false,
    changable: false,
    original: { value: "" },
    modified: { value: "" },
    options: {
        get theme(): string { return isLightTheme() ? "vs" : "vs-dark" },
    },
    originalOptions: {},
    modifiedOptions: {},
    diffOptions: {},
} as const;
