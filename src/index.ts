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

export default class OpenApiPlugin extends siyuan.Plugin {
    private static readonly GLOBAL: Record<string, any> = globalThis;
    private static readonly PROPERTY_NAME: string = "openAPI";

    onload() {
        OpenApiPlugin.GLOBAL[OpenApiPlugin.PROPERTY_NAME] = {
            plugin: this,
            siyuan: siyuan,
        };
    }

    onunload() {
        delete OpenApiPlugin.GLOBAL[OpenApiPlugin.PROPERTY_NAME];
    }
}
