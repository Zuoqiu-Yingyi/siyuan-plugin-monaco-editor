import { IAttr } from "./form";

import { Parser } from "./../utils/export"

export interface IMetadata extends IAttr {
    key: string;
    _key: string;
    value: string;
    parser?: Parser;
}
