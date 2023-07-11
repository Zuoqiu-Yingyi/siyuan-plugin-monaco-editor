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

/* 版本号 */

/**
 * 判断版本号是否为语义化的版本号
 * REF: https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
 * @param version: 语义化的版本号字符串
 */
export function isSemanticVersion(version:string): boolean {
    return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/.test(version);
}

/**
 * 将语义化的版本号转换为整数
 * REF: https://semver.org
 * @param version: 语义化的版本号字符串
 */
export function versionStringToNumber(version: string): number {
    const [major, minor, patch] = version.split(/[+-]/)[0].split(".").map(v => parseInt(v));
    return major * 1_0000_0000 + minor * 1_0000 + patch;
}

/**
 * 比较版本号
 * @param version1: 版本号1
 * @param version2: 版本号2
 * @return version - version2
 */
export function compare(version1: string, version2: string): number {
    const ver1 = versionStringToNumber(version1);
    const ver2 = versionStringToNumber(version2);
    return ver1 - ver2;
}
