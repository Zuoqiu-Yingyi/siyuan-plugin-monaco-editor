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

import { UserConfig } from "vite";
import { resolve } from "path"

// https://vitejs.dev/config/
export default {
    build: {
        minify: false,
        // sourcemap: "inline",
        rollupOptions: {
            input: {
                editor: resolve(__dirname, "./iframes/editor.html"),
            },
        },
    },
} as UserConfig;
