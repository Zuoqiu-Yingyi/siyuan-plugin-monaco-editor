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

/* 界面入口 */
import Main from "./components/Main.svelte";
import "./styles/main.less";

/**
 * Monaco Editor 环境
 * REF: https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md#using-vite
 */
self.MonacoEnvironment = {
    getWorker: function (workerId, label) {
        const getWorkerModule = (moduleUrl, label) => {
            return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl, label), {
                name: label,
                type: "module",
            });
        };

        switch (label) {
            case "json":
                return getWorkerModule("/monaco-editor/esm/vs/language/json/json.worker?worker", label);
            case "css":
            case "scss":
            case "less":
                return getWorkerModule("/monaco-editor/esm/vs/language/css/css.worker?worker", label);
            case "html":
            case "handlebars":
            case "razor":
                return getWorkerModule("/monaco-editor/esm/vs/language/html/html.worker?worker", label);
            case "js":
            case "ts":
            case "javascript":
            case "typescript":
                return getWorkerModule("/monaco-editor/esm/vs/language/typescript/ts.worker?worker", label);
            default:
                return getWorkerModule("/monaco-editor/esm/vs/editor/editor.worker?worker", label);
        }
    },
};

const main = new Main({
    target: globalThis.document.body,
    props: {
    },
});
