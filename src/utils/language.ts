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
