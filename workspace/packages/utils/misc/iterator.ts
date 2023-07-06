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

/* 迭代器 */

export function* Iterator(items: any[], loop: boolean = false) {
    // REF [ES6中的迭代器(Iterator)和生成器(Generator) - 小火柴的蓝色理想 - 博客园](https://www.cnblogs.com/xiaohuochai/p/7253466.html)
    if (loop) {
        for (let i = 0; true; i = (i + 1) % items.length) {
            yield items[i];
        }
    }
    else {
        for (let i = 0; i < items.length; ++i) {
            yield items[i];
        }
    }
}
