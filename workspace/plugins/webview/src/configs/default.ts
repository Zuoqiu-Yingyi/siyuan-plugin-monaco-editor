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

import type { IConfig } from "@/types/config";

import { MouseButton } from "@workspace/utils/shortcut";
import { EditorType } from "@workspace/utils/siyuan";

/* 默认配置选项 */
export const DEFAULT_CONFIG: IConfig = {
    general: {
        useragent: "",
        background: "transparent",
    },
    tab: {
        enable: true,
        open: {
            mouse: {
                type: "click",
                button: MouseButton.Left,

                altKey: false,
                ctrlKey: false,
                metaKey: false,
                shiftKey: false,
            },
            targets: {
                hyperlink: {
                    editor: {
                        enable: true,
                    },
                    other: {
                        enable: true,
                    },
                }
            },
            protocols: {
                https: {
                    enable: true,
                    prefix: "https://",
                },
                http: {
                    enable: true,
                    prefix: "http://",
                },
                file: {
                    enable: true,
                    prefix: "file://",
                },
                ftps: {
                    enable: true,
                    prefix: "ftps://",
                },
                ftp: {
                    enable: true,
                    prefix: "ftp://",
                },
                "//": { // network-path reference
                    enable: true,
                    prefix: "//",
                },
                "#": { // URL hash
                    enable: false,
                    prefix: "#",
                },
            },
        },
    },
    window: {
        enable: true,
        open: {
            mouse: {
                type: "mousedown",
                button: MouseButton.Middle,

                altKey: false,
                ctrlKey: false,
                metaKey: false,
                shiftKey: false,
            },
            targets: {
                hyperlink: {
                    editor: {
                        enable: true,
                    },
                    other: {
                        enable: false,
                    },
                }
            },
            protocols: {
                siyuan: {
                    enable: true,
                    prefix: "siyuan://",
                },
                https: {
                    enable: true,
                    prefix: "https://",
                },
                http: {
                    enable: true,
                    prefix: "http://",
                },
                file: {
                    enable: true,
                    prefix: "file://",
                },
                ftps: {
                    enable: true,
                    prefix: "ftps://",
                },
                ftp: {
                    enable: true,
                    prefix: "ftp://",
                },
                "//": {
                    enable: true,
                    prefix: "//",
                },
            },
        },
        params: {
            width: 800,
            height: 600,
            frame: true,
            alwaysOnTop: true,
            autoHideMenuBar: true,
            enableMenuBar: true,
        },
        siyuan: {
            enable: true,
            focus: false,
            editorType: EditorType.mobile,
        },
    },
};
