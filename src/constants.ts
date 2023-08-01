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

export default {
    INIT_CHANNEL_NAME: "monaco-editor-init", // 初始化通道名称
    MESSAGE_EVENT_NAME: "message", // 消息事件名称
    ID_PREFIX_MATERIAL: "#icon-monaco-editor-material", // 图标 symbol 的 ID 前缀
    ID_PREFIX_MATERIAL_LIGHT: "#icon-monaco-editor-material-light", // 明亮主题图标 symbol 的 ID 前缀
} as const;
