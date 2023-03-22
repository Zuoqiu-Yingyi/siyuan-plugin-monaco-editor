/* 映射语言 */
export function mapLang(lang: string): string {
    switch (lang) {
        case "zh_CN":
            lang = "zh-Hans";
            break;
        case "zh_CHT":
            lang = "zh-Hant";
            break;
        case "es_ES":
        case "fr_FR":
        case "en_US":
        default:
            lang = "en";
            break;
    }
    return lang;
}

/* 映射地区 */
export function mapLocal(local: string): string {
    switch (local) {
        case "zh_CN":
        case "zh_CHT":
            local = "zh";
            break;
        case "es_ES":
            local = "es";
            break;
        case "fr_FR":
            local = "fr";
            break;
        case "en_US":
            local = "en";
            break;
        default:
            local = local.split('_').shift()!;
            break;
    }
    return local;
}
