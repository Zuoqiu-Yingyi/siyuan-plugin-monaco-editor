import { ShallowReactive } from "vue";

export interface IAL {
    [key: string]: string;
}

export interface IData {
    url: URL;
    doc_id: string;
    doc_path: string;
    doc_notebook: string;
    block_id: string;
    element?: HTMLElement;
    paths: string[];
    hpaths: string[];
    ial: IAL;
}
