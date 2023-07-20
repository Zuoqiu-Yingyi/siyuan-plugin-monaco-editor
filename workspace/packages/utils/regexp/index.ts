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
    id: /^\d{14}-[0-9a-z]{7}$/, // 块 ID 正则表达式
    url: /^siyuan:\/\/blocks\/(\d{14}-[0-9a-z]{7})/, // 思源 URL Scheme 正则表达式
    snippet: /^\d{14}-[0-9a-z]{7}$/, // 代码片段 ID
    created: /^\d{10}$/, // 文件历史创建时间
    history: /[\/\\]history[\/\\]\d{4}-\d{2}-\d{2}-\d{6}-(clean|update|delete|format|sync|replace)([\/\\]\d{14}-[0-9a-z]{7})+\.sy$/, // 历史文档路径
    snapshot: /^[0-9a-f]{40}$/, // 快照对象 ID
    shorthand: /^\d{13}$/, // 收集箱项 ID
}
