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
