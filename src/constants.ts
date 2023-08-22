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
    OFFLINE_CACHE_PATH: "temp/.wakatime/cache", // 缓存文件目录路径
    WAKATIME_DEFAULT_API_URL: "https://wakatime.com/api/v1", // 默认 API 地址
    WAKATIME_STATUS_BAR_PATHNAME: "users/current/statusbar/today", // 状态栏数据 API 地址
    WAKATIME_HEARTBEATS_PATHNAME: "users/current/heartbeats", // 心跳数据 API 路径地址
    WAKATIME_HEARTBEATS_BULK: 25, // 每次提交数量限制
    WAKATIME_CLIENT_NAME: "wakatime", // 客户端名称
    WAKATIME_EDITOR_NAME: "siyuan", // 编辑器名称
    WAKATIME_PLUGIN_NAME: "siyuan-wakatime", // 插件名称
    WAKATIME_DEFAULT_LANGUAGE: "Siyuan", // 默认语言名称
    CACHE_CHECK_INTERVAL: 5 * 60 * 1_000, // 缓存检查时间间隔
    CACHE_COMMIT_INTERVAL: 1 * 1_000, // 缓存每次提交时间间隔
};
