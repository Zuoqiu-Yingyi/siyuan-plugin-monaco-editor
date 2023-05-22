export class  kernelApiList{
    constructor(option={
        思源伺服ip:window.location.hostname,
        思源伺服端口:'',
        思源伺服协议:"http",
		apitoken:""
		
    }){
    let 思源伺服ip =  option.思源伺服ip||option.siYuanIp||'127.0.0.1'
    let 思源伺服端口 =  option.思源伺服端口||option.siYuanPort||''
    let 思源伺服协议 =  option.思源伺服协议||option.siYuanScheme||"http"
	this.apitoken =  option.apitoken||""
    this.思源伺服地址 = 思源伺服协议+ "://"+思源伺服ip+":"+思源伺服端口
	if(option.siYuanServiceURL){this.思源伺服地址=option.siYuanServiceURL}
	if(option.思源伺服地址){this.思源伺服地址=option.思源伺服地址}









	// 不需要鉴权

	this.set("GET", "/api/system/bootProgress", "bootProgress","获取启动进度")
	this.set("POST", "/api/system/bootProgress", "bootProgress","获取启动进度")
	this.set("GET", "/api/system/version", "version","获取软件版本")
	this.set("POST", "/api/system/version", "version","获取软件版本")
	this.set("POST", "/api/system/currentTime", "currentTime","获取当前时间")
	this.set("POST", "/api/system/uiproc", "addUIProcess","UI生成进度")
	this.set("POST", "/api/system/loginAuth", "LoginAuth","登录鉴权")
	this.set("POST", "/api/system/logoutAuth", "LogoutAuth","退出登录")
	this.set("GET", "/api/system/getCaptcha", "GetCaptcha","获取验证码")

	// 需要鉴权

	this.set("POST", "/api/system/getEmojiConf",  "getEmojiConf","获取emoji配置")
	this.set("POST", "/api/system/setAccessAuthCode",   "setAccessAuthCode","设置鉴权码")
	this.set("POST", "/api/system/setNetworkServe",   "setNetworkServe","设置网络服务器")
	this.set("POST", "/api/system/setUploadErrLog",   "setUploadErrLog","设置上传错误日志")
	this.set("POST", "/api/system/setAutoLaunch",   "setAutoLaunch","设置自动启动")
	this.set("POST", "/api/system/setGoogleAnalytics",   "setGoogleAnalytics","设置谷歌数据分析")
	this.set("POST", "/api/system/setDownloadInstallPkg",   "setDownloadInstallPkg","设置是否下载安装包")
	this.set("POST", "/api/system/setNetworkProxy",   "setNetworkProxy","设置网络代理")
	this.set("POST", "/api/system/setWorkspaceDir",   "setWorkspaceDir","设置工作空间目录")
	this.set("POST", "/api/system/getWorkspaces",  "getWorkspaces","获取工作空间目录")
	this.set("POST", "/api/system/getMobileWorkspaces",  "getMobileWorkspaces","获取移动端工作空间目录")
	this.set("POST", "/api/system/createWorkspaceDir",   "createWorkspaceDir","创建工作空间")
	this.set("POST", "/api/system/removeWorkspaceDir",   "removeWorkspaceDir","移除动作空间")
	this.set("POST", "/api/system/setAppearanceMode",  "setAppearanceMode","设置外观模式")
	this.set("POST", "/api/system/getSysFonts",  "getSysFonts","获取系统字体")
	this.set("POST", "/api/system/exit",  "exit","退出")
	this.set("POST", "/api/system/setUILayout", "setUILayout","设置UI布局") 
	this.set("POST", "/api/system/getConf",  "getConf","获取配置")
	this.set("POST", "/api/system/checkUpdate",  "checkUpdate","检查更新")
	this.set("POST", "/api/system/exportLog",  "exportLog","导出日志")
	this.set("POST", "/api/system/getChangelog",  "getChangelog","获取更新日志")

	this.set("POST", "/api/storage/setLocalStorage",  "setLocalStorage","设置存储")
	this.set("POST", "/api/storage/getLocalStorage",  "getLocalStorage","获取存储")
	this.set("POST", "/api/storage/setLocalStorageVal",  "setLocalStorageVal","设置存储项")
	this.set("POST", "/api/storage/removeLocalStorageVals",   "removeLocalStorageVals")
	this.set("POST", "/api/storage/setCriterion",   "setCriterion","设置标准")
	this.set("POST", "/api/storage/getCriteria",  "getCriteria","获取标准")
	this.set("POST", "/api/storage/removeCriterion",   "removeCriterion","移除标准")
	this.set("POST", "/api/storage/getRecentDocs",  "getRecentDocs","获取最近文档")

	this.set("POST", "/api/account/login",   "login","登录账号")
	this.set("POST", "/api/account/checkActivationcode",   "checkActivationcode","检查激活码")
	this.set("POST", "/api/account/useActivationcode",   "useActivationcode","使用激活码")
	this.set("POST", "/api/account/deactivate",   "deactivateUser","注销账号")
	this.set("POST", "/api/account/startFreeTrial",   "startFreeTrial","开始免费试用")

	this.set("POST", "/api/notebook/lsNotebooks",  "lsNotebooks","获取笔记本列表")
	this.set("POST", "/api/notebook/openNotebook",  "openNotebook","打开笔记本")
	this.set("POST", "/api/notebook/closeNotebook",   "closeNotebook","关闭笔记本")
	this.set("POST", "/api/notebook/getNotebookConf",  "getNotebookConf","获取笔记本配置")
	this.set("POST", "/api/notebook/setNotebookConf",   "setNotebookConf","设置笔记本配置")
	this.set("POST", "/api/notebook/createNotebook",   "createNotebook","创建笔记本")
	this.set("POST", "/api/notebook/removeNotebook",  "removeNotebook","删除笔记本")
	this.set("POST", "/api/notebook/renameNotebook",   "renameNotebook","重命名笔记本")
	this.set("POST", "/api/notebook/changeSortNotebook",   "changeSortNotebook","改变笔记本排序")
	this.set("POST", "/api/notebook/setNotebookIcon",   "setNotebookIcon","设置笔记本图标")

	this.set("POST", "/api/filetree/searchDocs",  "searchDocs","搜索文档")
	this.set("POST", "/api/filetree/listDocsByPath",  "listDocsByPath","获取路径下文档列表")
	this.set("POST", "/api/filetree/getDoc",  "getDoc","获取文档")
	this.set("POST", "/api/filetree/getDocCreateSavePath",  "getDocCreateSavePath","获取文档创建位置")
	this.set("POST", "/api/filetree/getRefCreateSavePath",  "getRefCreateSavePath","获取块引创建位置")
	this.set("POST", "/api/filetree/changeSort",   "changeSort","改变文档排序")
	this.set("POST", "/api/filetree/createDocWithMd",   "createDocWithMd","创建文档")
	this.set("POST", "/api/filetree/createDailyNote",   "createDailyNote","创建日记")
	this.set("POST", "/api/filetree/createDoc",   "createDoc","创建文档")
	this.set("POST", "/api/filetree/renameDoc",   "renameDoc","重命名文档")
	this.set("POST", "/api/filetree/removeDoc",   "removeDoc","删除文档")
	this.set("POST", "/api/filetree/removeDocs",   "removeDocs","批量删除文档")
	this.set("POST", "/api/filetree/moveDocs",   "moveDocs","批量移动文档")
	this.set("POST", "/api/filetree/duplicateDoc",   "duplicateDoc","复制文档")
	this.set("POST", "/api/filetree/getHPathByPath",  "getHPathByPath","通过路径获取文档可读路径")
	this.set("POST", "/api/filetree/getHPathsByPaths",  "getHPathsByPaths","通过路径列表获取文档可读路径列表")
	this.set("POST", "/api/filetree/getHPathByID",  "getHPathByID","通过id获取文档可读路径")
	this.set("POST", "/api/filetree/getFullHPathByID",  "getFullHPathByID","通过id获取完整文档可读路径")
	this.set("POST", "/api/filetree/doc2Heading",   "doc2Heading","文档转换为标题")
	this.set("POST", "/api/filetree/heading2Doc",   "heading2Doc","标题转换为文档")
	this.set("POST", "/api/filetree/li2Doc",   "li2Doc","列表转换为文档")
	this.set("POST", "/api/filetree/refreshFiletree",   "refreshFiletree","刷新文档树")

	this.set("POST", "/api/format/autoSpace",   "autoSpace","自动空格")
	this.set("POST", "/api/format/netImg2LocalAssets",   "netImg2LocalAssets","网络图片转本地资源")

	this.set("POST", "/api/history/getNotebookHistory",  "getNotebookHistory","获取笔记本历史")
	this.set("POST", "/api/history/rollbackNotebookHistory",   "rollbackNotebookHistory","回滚笔记本历史")
	this.set("POST", "/api/history/rollbackAssetsHistory",   "rollbackAssetsHistory","回滚资源历史")
	this.set("POST", "/api/history/getDocHistoryContent",  "getDocHistoryContent","获取文档历史内容")
	this.set("POST", "/api/history/rollbackDocHistory",   "rollbackDocHistory","回滚文档历史")
	this.set("POST", "/api/history/clearWorkspaceHistory",   "clearWorkspaceHistory","清空工作区历史")
	this.set("POST", "/api/history/reindexHistory",   "reindexHistory","重建历史索引")
	this.set("POST", "/api/history/searchHistory",   "searchHistory","搜索历史")
	this.set("POST", "/api/history/getHistoryItems",   "getHistoryItems","获取历史条目")

	this.set("POST", "/api/outline/getDocOutline",  "getDocOutline","获取文档大纲")
	this.set("POST", "/api/bookmark/getBookmark",  "getBookmark","获取书签")
	this.set("POST", "/api/bookmark/renameBookmark",   "renameBookmark","重命名书签")
	this.set("POST", "/api/bookmark/removeBookmark",   "removeBookmark","移除书签")
	this.set("POST", "/api/tag/getTag",  "getTag","获取标签")
	this.set("POST", "/api/tag/renameTag",   "renameTag","重命名标签")
	this.set("POST", "/api/tag/removeTag",   "removeTag","删除标签")

	this.set("POST", "/api/lute/spinBlockDOM",  "spinBlockDOM") 
	this.set("POST", "/api/lute/html2BlockDOM",  "html2BlockDOM","html转blockDOM")
	this.set("POST", "/api/lute/copyStdMarkdown",  "copyStdMarkdown","复制标准markdown")

	this.set("POST", "/api/query/sql",  "SQL")

	this.set("POST", "/api/search/searchTag",  "searchTag","搜索标签")
	this.set("POST", "/api/search/searchTemplate",  "searchTemplate","搜索模板")
	this.set("POST", "/api/search/removeTemplate",  "removeTemplate")
	this.set("POST", "/api/search/searchWidget",  "searchWidget","搜索挂件")
	this.set("POST", "/api/search/searchRefBlock",  "searchRefBlock","搜索引用块")
	this.set("POST", "/api/search/searchEmbedBlock",  "searchEmbedBlock","搜索嵌入块")
	this.set("POST", "/api/search/fullTextSearchBlock",  "fullTextSearchBlock","全文搜索块")
	this.set("POST", "/api/search/searchAsset",  "searchAsset","搜索资源")
	this.set("POST", "/api/search/findReplace",   "findReplace","查找替换")

	this.set("POST", "/api/block/getBlockInfo",  "getBlockInfo","获取块信息")
	this.set("POST", "/api/block/getBlockDOM",  "getBlockDOM","获取块DOM")
	this.set("POST", "/api/block/getBlockKramdown",  "getBlockKramdown","获取块kramdown")
	this.set("POST", "/api/block/getChildBlocks",  "getChildBlocks")
	this.set("POST", "/api/block/getBlockBreadcrumb",  "getBlockBreadcrumb","获取块面包屑")
	this.set("POST", "/api/block/getBlockIndex",  "getBlockIndex","获取块索引")
	this.set("POST", "/api/block/getRefIDs",  "getRefIDs","获取引用块id")
	this.set("POST", "/api/block/getRefIDsByFileAnnotationID",  "getRefIDsByFileAnnotationID","根据文件标记id获取引用块id")
	this.set("POST", "/api/block/getBlockDefIDsByRefText",  "getBlockDefIDsByRefText","根据引用文本获取块定义id")
	this.set("POST", "/api/block/getRefText",  "getRefText","获取引用文本")
	this.set("POST", "/api/block/getTreeStat",  "getTreeStat","获取树状态")
	this.set("POST", "/api/block/getBlocksWordCount",  "getBlocksWordCount")
	this.set("POST", "/api/block/getContentWordCount",  "getContentWordCount","获取内容字数统计")
	this.set("POST", "/api/block/getRecentUpdatedBlocks",  "getRecentUpdatedBlocks","获取最近更新的块")
	this.set("POST", "/api/block/getDocInfo",  "getDocInfo","获取文档信息")
	this.set("POST", "/api/block/checkBlockExist",  "checkBlockExist","检查块是否存在")
	this.set("POST", "/api/block/checkBlockFold",  "checkBlockFold","检查块是否展开")
	this.set("POST", "/api/block/insertBlock",   "insertBlock","插入块")
	this.set("POST", "/api/block/prependBlock",   "prependBlock","插入前置子块")
	this.set("POST", "/api/block/appendBlock",   "appendBlock","插入后置子块")
	this.set("POST", "/api/block/updateBlock",   "updateBlock","更新块")
	this.set("POST", "/api/block/deleteBlock",   "deleteBlock","删除块")
	this.set("POST", "/api/block/moveBlock",   "moveBlock")
	this.set("POST", "/api/block/setBlockReminder",   "setBlockReminder","设置块提醒")
	this.set("POST", "/api/block/getHeadingLevelTransaction",  "getHeadingLevelTransaction","获取标题级别事务")
	this.set("POST", "/api/block/getHeadingDeleteTransaction",  "getHeadingDeleteTransaction","获取标题删除事务")
	this.set("POST", "/api/block/getHeadingChildrenIDs",  "getHeadingChildrenIDs","获取标题子块id")
	this.set("POST", "/api/block/getHeadingChildrenDOM",  "getHeadingChildrenDOM","获取标题子块DOM")
	this.set("POST", "/api/block/swapBlockRef",   "swapBlockRef","交换引用")
	this.set("POST", "/api/block/transferBlockRef",   "transferBlockRef","转移引用")

	this.set("POST", "/api/file/getFile",  "getFile","获取文件")
	this.set("POST", "/api/file/putFile",   "putFile","上传文件")
	this.set("POST", "/api/file/copyFile",   "copyFile","复制文件")
	this.set("POST", "/api/file/removeFile",   "removeFile","移除文件")
	this.set("POST", "/api/file/readDir",   "readDir")

	this.set("POST", "/api/ref/refreshBacklink",  "refreshBacklink","刷新反向链接")
	this.set("POST", "/api/ref/getBacklink",  "getBacklink","获取反向链接")
	this.set("POST", "/api/ref/getBacklink2",  "getBacklink2")
	this.set("POST", "/api/ref/getBacklinkDoc",  "getBacklinkDoc","获取反链文档")
	this.set("POST", "/api/ref/getBackmentionDoc",  "getBackmentionDoc","获取提及文档")

	this.set("POST", "/api/attr/getBookmarkLabels",  "getBookmarkLabels","获取书签标签")
	this.set("POST", "/api/attr/resetBlockAttrs",   "resetBlockAttrs","重置块属性")
	this.set("POST", "/api/attr/setBlockAttrs",  "setBlockAttrs","设置块属性")
	this.set("POST", "/api/attr/getBlockAttrs",  "getBlockAttrs","获取块属性")

	this.set("POST", "/api/cloud/getCloudSpace",  "getCloudSpace","获取云端空间")

	this.set("POST", "/api/sync/setSyncEnable",   "setSyncEnable","设置同步开关")
	this.set("POST", "/api/sync/setSyncGenerateConflictDoc",   "setSyncGenerateConflictDoc","设置同步是否生成冲突文件")
	this.set("POST", "/api/sync/setSyncMode",   "setSyncMode","设置同步模式")
	this.set("POST", "/api/sync/setSyncProvider",   "setSyncProvider","设置同步供应商")
	this.set("POST", "/api/sync/setSyncProviderS3",   "setSyncProviderS3","设置S3同步配置")
	this.set("POST", "/api/sync/setSyncProviderWebDAV",   "setSyncProviderWebDAV","设置webdav同步配置")
	this.set("POST", "/api/sync/setCloudSyncDir",   "setCloudSyncDir","设置云端同步目录")
	this.set("POST", "/api/sync/createCloudSyncDir",   "createCloudSyncDir","创建云端同步目录")
	this.set("POST", "/api/sync/removeCloudSyncDir",   "removeCloudSyncDir","删除云端同步目录")
	this.set("POST", "/api/sync/listCloudSyncDir",   "listCloudSyncDir","获取云端同步目录")
	this.set("POST", "/api/sync/performSync",   "performSync","执行同步")
	this.set("POST", "/api/sync/performBootSync",   "performBootSync","执行启动同步")
	this.set("POST", "/api/sync/getBootSync",  "getBootSync","获取启动同步")

	this.set("POST", "/api/inbox/getShorthands",  "getShorthands","获取收集箱简写列表")
	this.set("POST", "/api/inbox/getShorthand",  "getShorthand","获取收集箱简写")
	this.set("POST", "/api/inbox/removeShorthands",   "removeShorthands","删除收集箱简写")

	this.set("POST", "/api/extension/copy",   "extensionCopy","复制扩展")

	this.set("POST", "/api/clipboard/readFilePaths",  "readFilePaths","读取剪贴板文件路径")

	this.set("POST", "/api/asset/uploadCloud",   "uploadCloud","上传云端附件")
	this.set("POST", "/api/asset/insertLocalAssets",   "insertLocalAssets","插入本地附件")
	this.set("POST", "/api/asset/resolveAssetPath",  "resolveAssetPath","解析附件路径")
	this.set("POST", "/api/asset/upload",   "Upload")
	this.set("POST", "/api/asset/setFileAnnotation",   "setFileAnnotation","设置附件注释")
	this.set("POST", "/api/asset/getFileAnnotation",  "getFileAnnotation","获取附件注释")
	this.set("POST", "/api/asset/getUnusedAssets",  "getUnusedAssets","获取未使用的附件")
	this.set("POST", "/api/asset/removeUnusedAsset",   "removeUnusedAsset","删除未使用的附件")
	this.set("POST", "/api/asset/removeUnusedAssets",   "removeUnusedAssets","批量删除未使用的附件")
	this.set("POST", "/api/asset/getDocImageAssets",   "getDocImageAssets","获取文档图片附件")
	this.set("POST", "/api/asset/renameAsset",   "renameAsset","重命名附件")
	this.set("POST", "/api/asset/getImageOCRText",   "getImageOCRText")
	this.set("POST", "/api/asset/setImageOCRText",   "setImageOCRText")

	this.set("POST", "/api/export/batchExportMd",  "batchExportMd","批量导出Markdown")
	this.set("POST", "/api/export/exportMd",  "exportMd","导出Markdown")
	this.set("POST", "/api/export/exportSY",  "exportSY","导出SY")
	this.set("POST", "/api/export/exportNotebookSY",  "exportNotebookSY","导出笔记本sy")
	this.set("POST", "/api/export/exportMdContent",  "exportMdContent","导出Markdown内容")
	this.set("POST", "/api/export/exportHTML",  "exportHTML","导出HTML")
	this.set("POST", "/api/export/exportPreviewHTML",  "exportPreviewHTML","导出预览HTML")
	this.set("POST", "/api/export/exportMdHTML",  "exportMdHTML","导出MarkdownHTML")
	this.set("POST", "/api/export/exportDocx",  "exportDocx","导出Docx")
	this.set("POST", "/api/export/processPDF",  "processPDF","生成PDF")
	this.set("POST", "/api/export/preview",  "exportPreview","预览")
	this.set("POST", "/api/export/exportAsFile",  "exportAsFile","文件形式导出")
	this.set("POST", "/api/export/exportData",  "exportData","导出数据")
	this.set("POST", "/api/export/exportDataInFolder",  "exportDataInFolder","导出数据到文件夹")
	this.set("POST", "/api/export/exportTempContent",  "exportTempContent","导出缓存内容")
	this.set("POST", "/api/export/export2Liandi",  "export2Liandi","导出到链滴")
	this.set("POST", "/api/export/exportReStructuredText",  "exportReStructuredText")
	this.set("POST", "/api/export/exportAsciiDoc",  "exportAsciiDoc")
	this.set("POST", "/api/export/exportTextile",  "exportTextile")
	this.set("POST", "/api/export/exportOPML",  "exportOPML")
	this.set("POST", "/api/export/exportOrgMode",  "exportOrgMode")
	this.set("POST", "/api/export/exportMediaWiki",  "exportMediaWiki")
	this.set("POST", "/api/export/exportODT",  "exportODT")
	this.set("POST", "/api/export/exportRTF",  "exportRTF")
	this.set("POST", "/api/export/exportEPUB",  "exportEPUB")

	this.set("POST", "/api/import/importStdMd",   "importStdMd","导入标准Markdown")
	this.set("POST", "/api/import/importData",   "importData","导入数据")
	this.set("POST", "/api/import/importSY",   "importSY","导入SY")

	this.set("POST", "/api/convert/pandoc",   "pandoc")

	this.set("POST", "/api/template/render",  "renderTemplate","渲染模板")
	this.set("POST", "/api/template/docSaveAsTemplate",   "docSaveAsTemplate","文档另存为模板")
	this.set("POST", "/api/template/renderSprig",   "renderSprig")

	this.set("POST", "/api/transactions",   "performTransactions","执行事务")

	this.set("POST", "/api/setting/setAccount",   "setAccount","设置账户")
	this.set("POST", "/api/setting/setEditor",   "setEditor","设置编辑器")
	this.set("POST", "/api/setting/setExport",   "setExport","设置导出")
	this.set("POST", "/api/setting/setFiletree",   "setFiletree","设置文件树")
	this.set("POST", "/api/setting/setSearch",   "setSearch","设置搜索")
	this.set("POST", "/api/setting/setKeymap",   "setKeymap","设置快捷键")
	this.set("POST", "/api/setting/setAppearance",   "setAppearance","设置外观")
	this.set("POST", "/api/setting/getCloudUser",  "getCloudUser","获取云端用户")
	this.set("POST", "/api/setting/logoutCloudUser",   "logoutCloudUser","注销云端用户")
	this.set("POST", "/api/setting/login2faCloudUser",   "login2faCloudUser","二次验证登录云端用户")
	this.set("POST", "/api/setting/setEmoji",   "setEmoji","设置emoji")
	this.set("POST", "/api/setting/setFlashcard",   "setFlashcard")
	this.set("POST", "/api/setting/setAI",   "setAI")

	this.set("POST", "/api/graph/resetGraph",   "resetGraph","重置图谱")
	this.set("POST", "/api/graph/resetLocalGraph",   "resetLocalGraph","重置本地图谱")
	this.set("POST", "/api/graph/getGraph",  "getGraph","获取图谱")
	this.set("POST", "/api/graph/getLocalGraph",  "getLocalGraph","获取本地图谱")

	this.set("POST", "/api/bazaar/getBazaarPlugin",  "getBazaarPlugin")
	this.set("POST", "/api/bazaar/getInstalledPlugin",  "getInstalledPlugin")
	this.set("POST", "/api/bazaar/installBazaarPlugin",   "installBazaarPlugin")
	this.set("POST", "/api/bazaar/uninstallBazaarPlugin",   "uninstallBazaarPlugin")
	this.set("POST", "/api/bazaar/getBazaarWidget",  "getBazaarWidget","获取集市挂件")
	this.set("POST", "/api/bazaar/getInstalledWidget",  "getInstalledWidget","获取已安装的挂件列表")
	this.set("POST", "/api/bazaar/installBazaarWidget",   "installBazaarWidget","安装集市挂件")
	this.set("POST", "/api/bazaar/uninstallBazaarWidget",   "uninstallBazaarWidget","卸载集市挂件")
	this.set("POST", "/api/bazaar/getBazaarIcon",  "getBazaarIcon","获取集市图标")
	this.set("POST", "/api/bazaar/getInstalledIcon",  "getInstalledIcon","获取已安装的图标")
	this.set("POST", "/api/bazaar/installBazaarIcon",   "installBazaarIcon","安装集市图标")
	this.set("POST", "/api/bazaar/uninstallBazaarIcon",   "uninstallBazaarIcon","卸载集市图标")
	this.set("POST", "/api/bazaar/getBazaarTemplate",  "getBazaarTemplate","获取集市模板")
	this.set("POST", "/api/bazaar/getInstalledTemplate",  "getInstalledTemplate","获取已安装的模板列表")
	this.set("POST", "/api/bazaar/installBazaarTemplate",   "installBazaarTemplate","安装集市模板")
	this.set("POST", "/api/bazaar/uninstallBazaarTemplate",   "uninstallBazaarTemplate","卸载集市模板")
	this.set("POST", "/api/bazaar/getBazaarTheme",  "getBazaarTheme","获取集市主题")
	this.set("POST", "/api/bazaar/getInstalledTheme",  "getInstalledTheme","获取已安装的主题")
	this.set("POST", "/api/bazaar/installBazaarTheme",   "installBazaarTheme","安装集市主题")
	this.set("POST", "/api/bazaar/uninstallBazaarTheme",   "uninstallBazaarTheme","卸载集市主题")
	this.set("POST", "/api/bazaar/getBazaarPackageREAME",  "getBazaarPackageREAME","获取集市包说明")

	this.set("POST", "/api/repo/initRepoKey",   "initRepoKey","初始化仓库key")
	this.set("POST", "/api/repo/initRepoKeyFromPassphrase",   "initRepoKeyFromPassphrase","从密码初始化仓库key")
	this.set("POST", "/api/repo/resetRepo",   "resetRepo","重置仓库")
	this.set("POST", "/api/repo/purgeRepo",   "purgeRepo","清除云端快照")
	this.set("POST", "/api/repo/importRepoKey",   "importRepoKey","导入仓库key")
	this.set("POST", "/api/repo/createSnapshot",   "createSnapshot","创建快照")
	this.set("POST", "/api/repo/tagSnapshot",   "tagSnapshot","标记快照")
	this.set("POST", "/api/repo/checkoutRepo",   "checkoutRepo","签出仓库")
	this.set("POST", "/api/repo/getRepoSnapshots",  "getRepoSnapshots","获取仓库快照列表")
	this.set("POST", "/api/repo/getRepoTagSnapshots",  "getRepoTagSnapshots","获取标记快照列表")
	this.set("POST", "/api/repo/removeRepoTagSnapshot",   "removeRepoTagSnapshot","移除标记快照列表")
	this.set("POST", "/api/repo/getCloudRepoTagSnapshots",  "getCloudRepoTagSnapshots","获取云端标记快照列表")
	this.set("POST", "/api/repo/getCloudRepoSnapshots",  "getCloudRepoSnapshots","获取云端快照")
	this.set("POST", "/api/repo/removeCloudRepoTagSnapshot",   "removeCloudRepoTagSnapshot","移除云端标记快照")
	this.set("POST", "/api/repo/uploadCloudSnapshot",   "uploadCloudSnapshot","更新云端快照列表")
	this.set("POST", "/api/repo/downloadCloudSnapshot",   "downloadCloudSnapshot","下载云端快照")
	this.set("POST", "/api/repo/diffRepoSnapshots",  "diffRepoSnapshots","比较仓库快照")
	this.set("POST", "/api/repo/openRepoSnapshotDoc",  "openRepoSnapshotDoc","打开快照文档")

	this.set("POST", "/api/riff/createRiffDeck",   "createRiffDeck","创建间隔重复卡包")
	this.set("POST", "/api/riff/renameRiffDeck",   "renameRiffDeck","重命名间隔重复卡包")
	this.set("POST", "/api/riff/removeRiffDeck",   "removeRiffDeck","移除间隔重复卡包")
	this.set("POST", "/api/riff/getRiffDecks",  "getRiffDecks","获取间隔重复卡包列表")
	this.set("POST", "/api/riff/addRiffCards",   "addRiffCards","添加间隔重复卡片")
	this.set("POST", "/api/riff/removeRiffCards",   "removeRiffCards","移除间隔重复卡片")
	this.set("POST", "/api/riff/getRiffDueCards",  "getRiffDueCards","获取到期间隔重复卡片列表")
	this.set("POST", "/api/riff/getTreeRiffDueCards",  "getTreeRiffDueCards","获取到期文档树间隔重复卡片列表")
	this.set("POST", "/api/riff/getNotebookRiffDueCards",  "getNotebookRiffDueCards","获取到期笔记本间隔重复卡片列表")
	this.set("POST", "/api/riff/reviewRiffCard",   "reviewRiffCard","复习间隔重复卡片")
	this.set("POST", "/api/riff/skipReviewRiffCard",   "skipReviewRiffCard","跳过间隔重复卡片")
	this.set("POST", "/api/riff/getRiffCards",  "getRiffCards","获取间隔重复卡片列表")
	this.set("POST", "/api/riff/getTreeRiffCards",  "getTreeRiffCards","获取文档树间隔重复卡片列表")
	this.set("POST", "/api/riff/getNotebookRiffCards",  "getNotebookRiffCards","获取笔记本间隔重复卡片列表")

	this.set("POST", "/api/notification/pushMsg",  "pushMsg","发送消息")
	this.set("POST", "/api/notification/pushErrMsg",  "pushErrMsg","发送错误消息")

	this.set("POST", "/api/snippet/getSnippet",  "getSnippet","获取代码片段")
	this.set("POST", "/api/snippet/setSnippet",  "setSnippet","设置代码片段")
	this.set("POST", "/api/snippet/removeSnippet",   "removeSnippet","移除代码片段")
	this.set("GET", "/snippets/*filepath", "serveSnippets")

	this.set("POST", "/api/av/renderAttributeView",  "renderAttributeView","渲染属性视图")

	this.set("POST", "/api/ai/chatGPT",   "chatGPT")
	this.set("POST", "/api/ai/chatGPTWithAction",   "chatGPTWithAction")

	this.set("POST", "/api/petal/loadPetals",   "loadPetals")
	this.set("POST", "/api/petal/setPetalEnabled",   "setPetalEnabled","启用插件实例")
}

async set(方法,路径,英文名,中文名){
    this[英文名] =this.生成方法(方法,路径).bind(this)
    this[英文名]['raw'] =this.生成方法(方法,路径,true).bind(this)
    中文名?this[中文名] = this[英文名]:null
    this[路径]=this[英文名]
}
生成方法(方法,路径,flag){
    return async function(data,apitoken="",callback){
        let resData  = null
        if (data instanceof FormData) {
            data = data;
        } else {
            data = JSON.stringify(data);
        }   
        let head =   {
            'Authorization': 'Token '+ this.apitoken,

            'user-agent': 'Mozilla Mobile/4.0 MDN Example',
        }
        if (!this.apitoken){
            head={
                'user-agent': 'Mozilla Mobile/4.0 MDN Example',

            }
        }  
        await fetch(this.思源伺服地址+路径,{
            body: data,
            method:方法,
            headers:head,
        }).then(function(response){resData= response.json()})
        let realData = await resData
        if(!flag){
        if(callback){callback(realData.data?realData.data:null)}
        return realData.data?realData.data:null    
        }
        else{
            if(callback){callback(realData?realData:null)}
            return realData?realData:null    

        }
    }
}
}

export default new kernelApiList({        
思源伺服ip:window.location.hostname,
思源伺服端口:window.location.port,
思源伺服协议:"http",
apitoken:""
})

// 从思源的后端接口文件计算而来
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
