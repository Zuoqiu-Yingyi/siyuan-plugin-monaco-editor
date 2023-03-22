import { ShallowReactive } from "vue";

export interface IAttr {
    key: string;
    value: string;
}

export interface IForm {
    created: string;
    updated: string;
    title: string;
    name: string;
    alias: string[];
    tags: string[];
    bookmark: string;
    memo: string;

    custom: IAttr;
    customs: IAttr[];

    icon: string;
    "title-img": string;
}
