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

/* 权限管理 */

/* 资源操作 */
export enum ResourceOption {
    new = "new",
    view = "view",
    edit = "edit",
    move = "move",
    copy = "copy",
    rename = "rename",
    delete = "delete",
}

/* 资源操作权限 */
export interface IResourceOptionPermission {
    enable: boolean; // 是否可操作

    read: boolean; // 读操作 (view, edit, move-from, copy-from)
    write: boolean; // 写操作 (new, edit, move-from, move-to, copy-to, rename, delete)

    [ResourceOption.new]: boolean; // 新建操作 (仅目录)
    [ResourceOption.view]: boolean; // 查看操作 (仅文件)
    [ResourceOption.edit]: boolean; // 编辑操作 (仅文件)
    [ResourceOption.move]: boolean; // 移动操作
    [ResourceOption.copy]: boolean; // 复制操作
    [ResourceOption.rename]: boolean; // 操作操作
    [ResourceOption.delete]: boolean; // 删除操作
}

/**
 * 资源是否可操作
 * @param safe - 是否启用安全模式安全模式
 * @param protect - 是否为受保护资源
 * @param permission - 权限
 * @param option - 操作
 */
export function isResourceOperable(
    safe: boolean, // 是否启用安全模式安全模式
    protect: boolean, // 是否为受保护资源
    permission: IResourceOptionPermission, // 权限
    option: ResourceOption, // 操作
): boolean {
    return (protect // 是否为受保护的资源
        ? (safe // 是否为安全模式
            ? (permission.enable // 是否可操作
                ? ((option === ResourceOption.view
                    || option === ResourceOption.edit
                    || option === ResourceOption.move
                    || option === ResourceOption.copy
                ) // 是否为读操作
                    ? (permission.read // 是否可读
                        ? (permission[option] // 是否可操作
                            ? true // 可操作
                            : false // 不可操作
                        )
                        : false // 不可读时不允许操作
                    )
                    : (permission.write // 是否可写
                        ? (permission[option] // 是否可操作
                            ? true // 可操作
                            : false // 不可操作
                        )
                        : false // 不可写时不允许操作
                    )
                )
                : false // 禁用受保护资源全部操作
            )
            : true // 安全模式已被禁用, 可操作受保护资源
        )
        : true // 非受保护资源允许操作
    );
}
