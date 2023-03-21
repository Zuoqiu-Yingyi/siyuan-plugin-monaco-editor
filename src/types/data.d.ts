import { ShallowReactive } from "vue";

export interface IAL {
    [key: string]: string;
}

export interface IData {
    url: URL;
    doc_id: string;
    block_id: string;
    element: Element;
    paths: string[];
    hpaths: string[];
    ial: ShallowReactive<IAL>;
}
