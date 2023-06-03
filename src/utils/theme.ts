/* 设置主题模式 */
export function setThemeMode(mode: number) {
    switch (mode) {
        case 1:
            document.body.setAttribute('arco-theme', 'dark');
            break;

        case 0:
            document.body.setAttribute('arco-theme', 'light');
        default:
            break;
    }
}
