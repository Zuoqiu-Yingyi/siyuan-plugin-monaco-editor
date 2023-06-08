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

/**
 * 删除 DOM 节点
 * @params node: 要删除的节点
 */
export function removeNode(node: Node): void {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}

/**
 * 根据 ID 删除 HTML 元素节点
 * @params id: 要删除的节点 ID
 * @return: 是否删除成功
 */
export function removeElementById(id: string): boolean {
    const node = document.getElementById(id);
    if (node) {
        removeNode(node);
        return true;
    }
    return false;
}


/**
 * 移动 style 节点到 head 标签末尾
 * @params element: DOM 节点
 */
export function moveElementToHead(element: HTMLElement | null): void {
    if (element) {
        document.head.appendChild(element);
    }
}

/**
 * 通过 ID 移动 DOM 节点到 head 标签末尾
 * @params id: 标签 ID
 */
export function moveElementToHeadById(id: string): void {
    moveElementToHead(document.getElementById(id));
}
