// /api/system/getConf

export interface Appearance {
    mode: number;
    modeOS: boolean;
    darkThemes: string[];
    lightThemes: string[];
    themeDark: string;
    themeLight: string;
    themeVer: string;
    icons: string[];
    icon: string;
    iconVer: string;
    nativeEmoji: boolean;
    codeBlockThemeLight: string;
    codeBlockThemeDark: string;
    lang: string;
    customCSS: boolean;
    themeJS: boolean;
    closeButtonBehavior: number;
    hideStatusBar: boolean;
}

export interface Lang {
    label: string;
    name: string;
}

export interface FileTree {
    alwaysSelectOpenedFile: boolean;
    openFilesUseCurrentTab: boolean;
    refCreateSavePath: string;
    docCreateSavePath: string;
    maxListCount: number;
    maxOpenTabCount: number;
    allowCreateDeeper: boolean;
    removeDocWithoutConfirm: boolean;
    closeTabsOnStart: boolean;
    sort: number;
}

export interface Tag {
    sort: number;
}

export interface Editor {
    fontSize: number;
    fontFamily: string;
    codeSyntaxHighlightLineNum: boolean;
    codeTabSpaces: number;
    codeLineWrap: boolean;
    codeLigatures: boolean;
    displayBookmarkIcon: boolean;
    displayNetImgMark: boolean;
    generateHistoryInterval: number;
    historyRetentionDays: number;
    emoji: string[];
    virtualBlockRef: boolean;
    virtualBlockRefExclude: string;
    virtualBlockRefInclude: string;
    blockRefDynamicAnchorTextMaxLen: number;
    plantUMLServePath: string;
    fullWidth: boolean;
    katexMacros: string;
    readOnly: boolean;
    embedBlockBreadcrumb: boolean;
    listLogicalOutdent: boolean;
    floatWindowMode: number;
    dynamicLoadBlocks: number;
    justify: boolean;
    rtl: boolean;
    spellcheck: boolean;
    backlinkExpandCount: number;
}

export interface Export {
    paragraphBeginningSpace: boolean;
    addTitle: boolean;
    addFooter: boolean;
    blockRefMode: number;
    blockEmbedMode: number;
    blockRefTextLeft: string;
    blockRefTextRight: string;
    tagOpenMarker: string;
    tagCloseMarker: string;
    fileAnnotationRefMode: number;
    pandocBin: string;
}

export interface Account {
    displayTitle: boolean;
    displayVIP: boolean;
}

export interface NetworkProxy {
    scheme: string;
    host: string;
    port: string;
}

export interface System {
    id: string;
    kernelVersion: string;
    os: string;
    osPlatform: string;
    container: string;
    isMicrosoftStore: boolean;
    isInsider: boolean;
    homeDir: string;
    workspaceDir: string;
    appDir: string;
    confDir: string;
    dataDir: string;
    networkServe: boolean;
    networkProxy: NetworkProxy;
    uploadErrLog: boolean;
    disableGoogleAnalytics: boolean;
    downloadInstallPkg: boolean;
    autoLaunch: boolean;
}

export interface Search {
    document: boolean;
    heading: boolean;
    list: boolean;
    listItem: boolean;
    codeBlock: boolean;
    mathBlock: boolean;
    table: boolean;
    blockquote: boolean;
    superBlock: boolean;
    paragraph: boolean;
    htmlBlock: boolean;
    embedBlock: boolean;
    limit: number;
    caseSensitive: boolean;
    name: boolean;
    alias: boolean;
    memo: boolean;
    ial: boolean;
    backlinkMentionName: boolean;
    backlinkMentionAlias: boolean;
    backlinkMentionAnchor: boolean;
    backlinkMentionDoc: boolean;
    backlinkMentionKeywordsLimit: number;
    virtualRefName: boolean;
    virtualRefAlias: boolean;
    virtualRefAnchor: boolean;
    virtualRefDoc: boolean;
}

export interface Flashcard {
    dailyNewCardLimit: number;
    dailyReviewCardLimit: number;
    list: boolean;
    superBlock: boolean;
}

export interface Stat {
    treeCount: number;
    cTreeCount: number;
    blockCount: number;
    cBlockCount: number;
    dataSize: number;
    cDataSize: number;
    assetsSize: number;
    cAssetsSize: number;
}

export interface Api {
    token: string;
}

export interface Repo {
    key: string;
}

export interface Conf {
    logLevel: string;
    appearance: Appearance;
    langs: Lang[];
    lang: string;
    fileTree: FileTree;
    tag: Tag;
    editor: Editor;
    export: Export;
    userData: string;
    account: Account;
    readonly: boolean;
    localIPs: string[];
    accessAuthCode: string;
    system: System;
    search: Search;
    flashcard: Flashcard;
    ai?: any;
    stat: Stat;
    api: Api;
    repo: Repo;
    openHelp: boolean;
}

export interface Data {
    conf: Conf;
    start: boolean;
}

export interface IResponse {
    code: number;
    msg: string;
    data: Data;
}
