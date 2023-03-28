import { IAttr } from "./form";

export interface IMetadata extends IAttr {
    key: string;
    _key: string;
    value: any;
}
