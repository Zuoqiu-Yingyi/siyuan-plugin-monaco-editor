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

import { Notification } from "@arco-design/web-vue";

/* 通知 */
export function notify(content: string, status?: string, duration: number = 8000): void {
    var handler: CallableFunction;
    var title: string;

    switch (status) {
        case "I":
            handler = Notification.info;
            title = "INFO";
            break;
        case "S":
            handler = Notification.success;
            title = "SUCCESS";
            break;
        case "W":
            handler = Notification.warning;
            title = "WARNING";
            break;
        case "E":
        default:
            handler = Notification.error;
            title = "ERROR";
            break;
    }

    handler({
        title,
        content,
        duration,
        closable: true,
    });
}
