import { ArcoLang } from '@arco-design/web-vue/es/locale/interface';

import arco_en from '@arco-design/web-vue/es/locale/lang/en-us';
import arco_en_Hans from '@arco-design/web-vue/es/locale/lang/zh-cn';
import arco_en_Hant from '@arco-design/web-vue/es/locale/lang/zh-tw';

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
