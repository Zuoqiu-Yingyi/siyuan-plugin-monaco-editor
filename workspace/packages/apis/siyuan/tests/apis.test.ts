import {
    describe,
    test,
    expect,
    expectTypeOf,
} from "vitest";

import {
    SERVER,
    TOKEN,
} from "./config";

import fullTextSearchBlock from "./../types/siyuan/fullTextSearchBlock";
import getBlockAttrs from "./../types/siyuan/getBlockAttrs";
import getBlockBreadcrumb from "./../types/siyuan/getBlockBreadcrumb";
import getBookmarkLabels from "./../types/siyuan/getBookmarkLabels";
import getConf from "./../types/siyuan/getConf";
import getDocInfo from "./../types/siyuan/getDocInfo";
import getRecentDocs from "./../types/siyuan/getRecentDocs";
import listDocsByPath from "./../types/siyuan/listDocsByPath";
import lsNotebooks from "./../types/siyuan/lsNotebooks";
import renameDoc from "./../types/siyuan/renameDoc";
import searchDocs from "./../types/siyuan/searchDocs";
import setBlockAttrs from "./../types/siyuan/setBlockAttrs";
import sql from "./../types/siyuan/sql";
import version from "./../types/siyuan/version";

import {
    GroupBy,
    Method,
    OrderBy,
} from "./../utils/siyuan"
import { Client } from "./../client/Client";

describe("APIs Test", async () => {
    const client = new Client(new URL(SERVER), TOKEN);

    test("/api/attr/getBlockAttrs", async () => {
        const payload: getBlockAttrs.IPayload = {
            id: "20200812220555-lj3enxa",
        };
        const response = await client.getBlockAttrs(payload);
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<getBlockAttrs.IResponse>();
    });

    test("/api/attr/getBookmarkLabels", async () => {
        const response = await client.getBookmarkLabels();
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<getBookmarkLabels.IResponse>();
    });

    test("/api/attr/setBlockAttrs", async () => {
        const payload: setBlockAttrs.IPayload = {
            id: "20200812220555-lj3enxa",
            attrs: {
                tags: "文档标签1,文档标签2",
            },
        };
        const response = await client.setBlockAttrs(payload);
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<setBlockAttrs.IResponse>();
    });

    test.each((() => {
        const payloads: getBlockBreadcrumb.IPayload[] = [];
        const ids = [ // 需要打开 思源笔记用户指南
            "20200825162036-4dx365o", // NodeDocument
            "20210604234955-651jbge", // NodeSuperBlock
            "20210604223030-6gapuyv", // NodeBlockquote
            "20210104091228-ttcj9nm", // NodeList
            "20210104091228-0wokn6i", // NodeListItem

            "20210604182832-nm3hapx", // NodeHeading
            "20210604222158-w17nnmy", // NodeParagraph
            "20210104091228-9ok9gv4", // NodeMathBlock
            "20210104091228-eem86ni", // NodeTable
            "20210104091228-mwb2x54", // NodeCodeBlock
            "20220312004517-f6i1k8m", // NodeHTMLBlock

            "20210604222430-tctcbzh", // NodeThematicBreak
            "20210608113713-wm8271x", // NodeAudio
            "20210608113914-zvtw5kj", // NodeVideo
            "20220908200902-6rqv2wt", // NodeIFrame
            // "", // NodeWidget
            "20210604222515-ggpd5hs", // NodeBlockQueryEmbed
        ];

        for (const id of ids) {
            payloads.push({ id, excludeTypes: [] });
        }

        return payloads;
    })())("/api/block/getBlockBreadcrumb", async (payload) => {
        const response = await client.getBlockBreadcrumb(payload);
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<getBlockBreadcrumb.IResponse>();
    });

    test("/api/block/getDocInfo", async () => {
        const payload: getDocInfo.IPayload = {
            id: "20200812220555-lj3enxa",
        };
        const response = await client.getDocInfo(payload);
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<getDocInfo.IResponse>();
    });

    test("/api/filetree/listDocsByPath", async () => {
        const payload: listDocsByPath.IPayload = {
            notebook: "20210808180117-czj9bvb",
            path: "/",
            sort: 6,
        };
        const response = await client.listDocsByPath(payload);
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<listDocsByPath.IResponse>();
    });

    test("/api/filetree/searchDocs", async () => {
        const payload: searchDocs.IPayload = { k: "测试" };
        const response = await client.searchDocs(payload);
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<searchDocs.IResponse>();
    });

    test("/api/filetree/renameDoc", async () => {
        const payload: renameDoc.IPayload = {
            notebook: "20210808180117-czj9bvb",
            path: "/20200812220555-lj3enxa.sy",
            title: "请从这里开始-重命名"
        };
        const response = await client.renameDoc(payload);
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<renameDoc.IResponse>();
    });

    test("/api/notebook/lsNotebooks", async () => {
        const response = await client.lsNotebooks();
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<lsNotebooks.IResponse>();
    });

    test("/api/query/sql", async () => {
        const payload: sql.IPayload = {
            stmt: "SELECT * FROM blocks WHERE id = '20200812220555-lj3enxa';",
        };
        const response = await client.sql(payload);
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<sql.IResponse>();
    });

    test.each((() => {
        const payloads: fullTextSearchBlock.IPayload[] = [];
        for (const groupBy in Object.values(GroupBy).filter(v => !isNaN(Number(v)))) {
            for (const orderBy in Object.values(OrderBy).filter(v => !isNaN(Number(v)))) {
                for (const method in Object.values(Method).filter(v => !isNaN(Number(v)))) {
                    const query = (() => {
                        switch (method as unknown as Method) {
                            case Method.keyword:
                                return "测试"

                            case Method.querySyntax:
                                return '"测试"'

                            case Method.regex:
                                return ".*测试.*"

                            case Method.sql:
                                return "SELECT * FROM blocks WHERE content LIKE '%测试%';"
                        }
                    })();
                    payloads.push({
                        groupBy: groupBy as unknown as number,
                        method: method as unknown as number,
                        orderBy: orderBy as unknown as number,
                        paths: ["20210808180117-czj9bvb"],
                        query,
                        types: {
                            heading: true,
                            paragraph: true,
                            mathBlock: true,
                            table: true,
                            codeBlock: true,
                            htmlBlock: true,
                            embedBlock: true,

                            document: true,
                            superBlock: false,
                            blockquote: false,
                            list: false,
                            listItem: true,
                        },
                    })
                }
            }
        }
        return payloads;
    })())("/api/search/fullTextSearchBlock", async (payload) => {
        const response = await client.fullTextSearchBlock(payload);
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<fullTextSearchBlock.IResponse>();
    });

    test("/api/storage/getRecentDocs", async () => {
        const response = await client.getRecentDocs();
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<getRecentDocs.IResponse>();
    });

    test("/api/system/getConf", async () => {
        const response = await client.getConf();
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<getConf.IResponse>();
    });

    test("/api/system/version", async () => {
        const response = await client.version();
        expect(response?.code).toEqual(0);
        expectTypeOf(response).toEqualTypeOf<version.IResponse>();
    });
});
