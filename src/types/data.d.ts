import { ShallowReactive } from "vue";
import { IConfig } from "./config";

export interface IAL {
    [key: string]: string;
}

export interface IData {
    url: URL;
    doc_id: string;
    doc_path: string;
    doc_notebook: string;
    block_id: string;
    block_ial: IAL;
    block_config: IConfig;
    element?: HTMLElement;
    paths: string[];
    hpaths: string[];
    ial: IAL;
}
