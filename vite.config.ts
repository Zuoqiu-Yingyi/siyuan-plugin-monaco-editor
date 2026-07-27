// Copyright (C) 2023 Zuoqiu Yingyi
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { defineConfig } from "vite";

import viteIframesConfig from "./vite.iframes.config";
import vitePluginConfig from "./vite.plugin.config";

import type { UserConfig } from "vite";

/**
 * 依赖更新时进行处理
 * monaco-editor: 移除 node_modules/monaco-editor/min/vs/*.js 中的 //# sourceMappingURL
 * streamsaver: public/libs/streamsaver/mitm.html
 *   - `const swReg = swRegs.find(sw => sw.scope.endsWith("/libs/streamsaver/"))`
 *   - 避免与 service-worker.js 冲突
 */

// REF: https://cn.vitejs.dev/config/#conditional-config
export default defineConfig(async (env) => {
    let config: UserConfig;
    // console.log(env);

    switch (env.mode) {
        case "iframes":
            config = viteIframesConfig;
            break;

        case "plugin":
        default:
            config = vitePluginConfig;
            break;
    }

    // console.log(config);
    return config;
});
