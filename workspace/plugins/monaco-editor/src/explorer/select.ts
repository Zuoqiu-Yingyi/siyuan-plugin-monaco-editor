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

import type { IFileTreeNodeStores } from "@workspace/components/siyuan/tree/file";

/* 管理节点的选中 */
export class Select {
    /* 选中的节点集合 */
    protected readonly selected: Set<IFileTreeNodeStores> = new Set();

    /**
     * 仅选中一个节点
     * 取消其他所有节点的选中状态
     */
    public one(node: IFileTreeNodeStores) {
        node.focus.set(true);
        this.selected.delete(node);
        this.selected.forEach(node => node.focus.set(false));
        this.selected.clear();
        this.selected.add(node);
    }
}
