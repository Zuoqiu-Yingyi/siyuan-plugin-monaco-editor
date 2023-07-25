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

import { Electron } from "@workspace/types/electron";

export const showOpenDialog: Electron.Dialog["showOpenDialog"] = (...args: any[]) => {
    return globalThis
        ?.require
        ?.("@electron/remote")
        ?.dialog
        ?.showOpenDialog(...args);
}

export const showSaveDialog: Electron.Dialog["showSaveDialog"] = (...args: any[]) => {
    return globalThis
        ?.require
        ?.("@electron/remote")
        ?.dialog
        ?.showSaveDialog(...args);
}
