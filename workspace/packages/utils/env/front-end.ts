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

export const FLAG_ELECTRON = isElectron();
export const FLAG_IFRAME = isIframe();
export const FLAG_DESKTOP = isDesktop();
export const FLAG_BROWSER = isBrowser();
export const FLAG_MOBILE = isMobile();

export function hasNodeRequire(): boolean {
    return !!globalThis.require;
}

export function hasNodeProcess(): boolean {
    return !!globalThis.process;
}

export function isElectron(): boolean {
    return hasNodeProcess() && hasNodeRequire();
}

export function isIframe(): boolean {
    return globalThis.self !== globalThis.top;
}

export function isDesktop(): boolean {
    switch (siyuan.getFrontend()) {
        case "desktop":
        case "desktop-window":
        case "browser-desktop":
            return true;

        case "mobile":
        case "browser-mobile":
            return false;

        default:
            return false;
    }
}

export function isMobile(): boolean {
    switch (siyuan.getFrontend()) {
        case "mobile":
        case "browser-mobile":
            return true;

        case "desktop":
        case "desktop-window":
        case "browser-desktop":
            return false;

        default:
            return false;
    }
}

export function isBrowser(): boolean {
    switch (siyuan.getFrontend()) {
        case "browser-desktop":
        case "browser-mobile":
            return true;

        case "desktop":
        case "desktop-window":
        case "mobile":
            return false;

        default:
            return false;
    }
}
