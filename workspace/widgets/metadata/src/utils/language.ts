import { ArcoLang } from '@arco-design/web-vue/es/locale/interface';

import arco_en from '@arco-design/web-vue/es/locale/lang/en-us';
import arco_en_Hans from '@arco-design/web-vue/es/locale/lang/zh-cn';
import arco_en_Hant from '@arco-design/web-vue/es/locale/lang/zh-tw';

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

/* 获得 Arco 内置的语言包 */
export function getArcoLang(lang: string): ArcoLang {
    switch (lang) {
        case 'zh-Hans':
            return arco_en_Hans;
        case 'zh-Hant':
            return arco_en_Hant;
        case 'en':
        default:
            return arco_en;
    }
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
