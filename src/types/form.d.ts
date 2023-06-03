import { ShallowReactive } from "vue";

export interface IAttr {
    key: string;
    _key: string;
    value: string;
}

export interface IBasicAttrs {
    created: string;
    updated: string;
    title: string;
    name: string;
    alias: string[];
    tags: string[];
    bookmark: string;
    memo: string;
}

export interface IOtherAttrs {
    id: string;
    icon: string;
    scroll: string;
    "title-img": string;

    [key: string]: string;
}

export interface IUnknownsAttrs {
    [key: string]: string;
}

export interface IForm {
    basics: IBasicAttrs;

    customs: IAttr[];

    others: IOtherAttrs;

    unknowns: IUnknownsAttrs;
}
