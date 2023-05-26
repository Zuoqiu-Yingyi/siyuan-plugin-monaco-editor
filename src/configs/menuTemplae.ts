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

/* 窗口菜单模板 */

import type { Electron } from "@workspace/types/electron";

/**
 * 创建 Electron 菜单模板
 * REF [菜单项 | Electron](https://www.electronjs.org/zh/docs/latest/api/menu-item)
 * REF [Menu | Electron](https://www.electronjs.org/zh/docs/latest/api/menu#示例)
 */
export function createMenuTemplate(isMacOS: boolean, top: boolean = true): Array<(Electron.MenuItemConstructorOptions) | (Electron.MenuItem)> {
    const appMenu: Array<Electron.MenuItemConstructorOptions> = [ // 应用菜单
        { role: "about" }, // 关于

        ...(isMacOS
            ? [
                { type: "separator" },
                { role: "help" }, // macOS 帮助子菜单

                { type: "separator" },
                { role: "services" }, // macOS 服务

                { type: "separator" },
                { role: "hide" }, // macOS 隐藏
                { role: "hideOthers" }, // macOS 隐藏其他
                { role: "unhide" }, // macOS 取消隐藏
            ]
            : []
        ) as Array<Electron.MenuItemConstructorOptions>,

        { type: "separator" },
        { role: "quit" }, // 退出
    ];
    const fileMenu: Array<Electron.MenuItemConstructorOptions> = [ // 文件菜单
        ...(isMacOS
            ? [
                { role: "recentDocuments" }, // macOS 最近的文档
                { role: "clearRecentDocuments" }, // macOS 清除最近的文档
                { type: "separator" },
            ]
            : []
        ) as Array<Electron.MenuItemConstructorOptions>,

        { role: "close" }, // 关闭
        { role: "quit" }, // 退出
    ];
    const editMenu: Array<Electron.MenuItemConstructorOptions> = [ // 编辑菜单
        { role: "undo" }, // 撤销
        { role: "redo" }, // 重做
        { type: "separator" },

        { role: "cut" }, // 剪切
        { role: "copy" }, // 复制
        { role: "paste" }, // 粘贴
        { role: "pasteAndMatchStyle" }, // 粘贴并匹配样式
        { role: "delete" }, // 删除
        { type: "separator" },

        { role: "selectAll" }, // 全选
        { type: "separator" },

        { role: "toggleSpellChecker" }, // 切换拼写检查

        ...(isMacOS
            ? [
                { type: "separator" },
                { role: "showSubstitutions" }, // macOS 显示替换
                { role: "toggleTextReplacement" }, // macOS 切换文本替换

                { type: "separator" },
                { role: "toggleSmartQuotes" }, // macOS 切换智能引号
                { role: "toggleSmartDashes" }, // macOS 切换智能破折号

                { type: "separator" },
                { role: "startSpeaking" }, // macOS 开始朗读
                { role: "stopSpeaking" }, // macOS 停止朗读
            ]
            : []
        ) as Array<Electron.MenuItemConstructorOptions>,
    ];
    const viewMenu: Array<Electron.MenuItemConstructorOptions> = [ // 视图菜单
        { role: "reload" }, // 重新加载
        { role: "forceReload" }, // 强制重新加载

        { type: "separator" },
        { role: "resetZoom" }, // 重置缩放
        { role: "zoomIn" }, // 放大
        { role: "zoomOut" }, // 缩小

        ...(isMacOS
            ? [
                { role: "zoom" }, // macOS 缩放

                { type: "separator" },
                { role: "front" }, // macOS 前置
            ]
            : [
                { // 钉住
                    label: 'Pinned',
                    click: (menuItem, browserWindow, event) => {
                        if (browserWindow) browserWindow.setAlwaysOnTop(!browserWindow.isAlwaysOnTop());
                    },
                    type: 'checkbox',
                    checked: top,
                    // REF [快捷键 | Electron](https://www.electronjs.org/zh/docs/latest/api/accelerator)
                    accelerator: 'Alt+Shift+P',
                },
            ]
        ) as Array<Electron.MenuItemConstructorOptions>,

        { type: "separator" },
        { role: "togglefullscreen" }, // 切换全屏
        { role: "toggleDevTools" }, // 切换开发者工具
    ];
    const windowMenu: Array<Electron.MenuItemConstructorOptions> = [ // 窗口菜单
        ...(isMacOS
            ? [
                { role: "window" }, // macOS 窗口子菜单
                { type: "separator" },

                { role: "toggleTabBar" }, // macOS 切换标签栏
                { role: "selectNextTab" }, // macOS 选择下一个标签
                { role: "selectPreviousTab" }, // macOS 选择上一个标签
                { role: "mergeAllWindows" }, // macOS 合并所有窗口
                { role: "moveTabToNewWindow" }, // macOS 将标签移动到新窗口
                { type: "separator" },
            ]
            : []
        ) as Array<Electron.MenuItemConstructorOptions>,

        { role: "minimize" }, // 最小化
        { role: "close" }, // 关闭
    ];
    // const shareMenu: Array<Electron.MenuItemConstructorOptions> = [ // 共享菜单
    // ];

    const menu: Array<Electron.MenuItemConstructorOptions> = [
        {
            role: "appMenu",
            submenu: appMenu,
        },
        {
            role: "fileMenu",
            submenu: fileMenu,
        },
        {
            role: "editMenu",
            submenu: editMenu,
        },
        {
            role: "viewMenu",
            submenu: viewMenu,
        },
        {
            role: "windowMenu",
            submenu: windowMenu,
        },
    ];
    if (isMacOS) {
        menu.push({
            role: "shareMenu",
            // submenu: shareMenu,
        });
    }
    return menu;
}
