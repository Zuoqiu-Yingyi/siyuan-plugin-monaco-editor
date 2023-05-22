const { Plugin } = require("siyuan");
const clientApi = require("siyuan");
let 浏览记录 = [];
let kernelApi;
let siyuanMenu;
let panelHTML = `
    <div class="fn__flex fn__flex-1  fn__flex-column">    
        <div class="fn__flex" style="padding: 4px 8px;position: relative">
            <span style="opacity: 1" class="block__icon fn__flex-center btnBack" data-menu="true">
                <svg><use xlink:href="#iconLeft"></use></svg>
            </span>
            <span style="opacity: 1" class="block__icon fn__flex-center btnForward" data-menu="true">                 
            <svg ><use xlink:href="#iconRight"></use></svg>
            </span>
            <div class="fn__space"></div>
            <input class="b3-text-field fn__flex-1">
            <span class="fn__space"></span>
            <span 
            style="opacity: 1" 
            class="block__icon fn__flex-center b3-tooltips b3-tooltips__w btnRefresh" 
            aria-label="刷新">
                <svg><use xlink:href="#iconRefresh"></use></svg>
            </span>
            <span 
            style="opacity: 1" 
            class="block__icon fn__flex-center b3-tooltips b3-tooltips__w debug fn__none" 
            aria-label="反向链接">
                <svg><use xlink:href="#iconLink"></use></svg>
            </span>
            <div id="searchHistoryList" data-close="false" class="fn__none b3-menu b3-list b3-list--background" style="position: absolute;top: 30px;max-height: 50vh;overflow: auto"></div>
        </div>   
  
        <div class="fn__flex fn__flex-1  naive_ifrmeContainer" style="max-height:100%" >
            <webview   
            class="fn__flex-1" 
            style=" max-height:calc(100% - 200px)" 
            src="" data-src="" border="0" 
            frameborder="no" 
            framespacing="0" 
            allowfullscreen="true"
            allowpopups="true"
            ></webview  >   
           
    </div>
  </div>
  `;
let BrowserTabContainer = {
  type: "common",
  init() {
    this.element.innerHTML = panelHTML;
    this.urlInputter = this.element.querySelector("input");
    this.urlInputter.value = this.data.url;
    this.frame = this.element.querySelector("webview");
    if (!window.require) {
      this.frame.outerHTML = `
            <iframe   
            class="fn__flex-1" 
            style=" max-height:calc(100% - 200px)" 
            src="" data-src="" border="0" 
            frameborder="no" 
            framespacing="0" 
            allowfullscreen="true"
            allowpopups="true"
            ></iframe  >   

            `;
      this.frame = this.element.querySelector("iframe");
      this.frame.reload = () => {
        this.frame.setAttribute("src", this.frame.getAttribute("src"));
      };
    }
    console.log(this);
    this.页面控制器 = new 页面控制器(
      this.frame,
      this.urlInputter,
      this.element.querySelector(`span.item__text`),
      this.element.querySelector(".btnForward"),
      this.element.querySelector(".btnBack"),
      this.element.querySelector(".btnRefresh"),
      this.element
    );
    this.页面控制器.加载URL(this.data.url);
  },
};
const getIconByType = (type, sub) => {
  let iconName = "";
  switch (type) {
    case "NodeDocument":
      iconName = "iconFile";
      break;
    case "NodeThematicBreak":
      iconName = "iconLine";
      break;
    case "NodeParagraph":
      iconName = "iconParagraph";
      break;
    case "NodeHeading":
      if (sub) {
        iconName = "icon" + sub.toUpperCase();
      } else {
        iconName = "iconHeadings";
      }
      break;
    case "NodeBlockquote":
      iconName = "iconQuote";
      break;
    case "NodeList":
      if (sub === "t") {
        iconName = "iconCheck";
      } else if (sub === "o") {
        iconName = "iconOrderedList";
      } else {
        iconName = "iconList";
      }
      break;
    case "NodeListItem":
      iconName = "iconListItem";
      break;
    case "NodeCodeBlock":
    case "NodeYamlFrontMatter":
      iconName = "iconCode";
      break;
    case "NodeTable":
      iconName = "iconTable";
      break;
    case "NodeBlockQueryEmbed":
      iconName = "iconSQL";
      break;
    case "NodeSuperBlock":
      iconName = "iconSuper";
      break;
    case "NodeMathBlock":
      iconName = "iconMath";
      break;
    case "NodeHTMLBlock":
      iconName = "iconHTML5";
      break;
    case "NodeWidget":
      iconName = "iconBoth";
      break;
    case "NodeIFrame":
      iconName = "iconLanguage";
      break;
    case "NodeVideo":
      iconName = "iconVideo";
      break;
    case "NodeAudio":
      iconName = "iconRecord";
      break;
    case "NodeAttributeView":
      iconName = "iconDatabase";
      break;
  }
  return iconName;
};
class 页面控制器 {
  constructor(
    页面容器,
    地址栏容器,
    标题容器,
    前进按钮,
    后退按钮,
    重载按钮,
    面板容器
  ) {
    this.页面容器 = 页面容器;
    this.地址栏容器 = 地址栏容器;
    this.前进按钮 = 前进按钮;
    this.后退按钮 = 后退按钮;
    this.标题容器 = 标题容器;
    this.重载按钮 = 重载按钮;
    this.页面状态 = {
      历史记录数组: [],
      当前历史序号: 0,
    };
    this.面板容器 = 面板容器;
    this.绑定事件();
    if (window.require) {
      this.创建浏览器菜单();
    }
  }
  创建浏览器菜单() {
    const remote = window.require("@electron/remote");
    this.页面容器.addEventListener("did-navigate-in-page", (res) => {
      this.页面容器.src !== res.url ? (this.页面容器.src = res.url) : null;
    });
    this.页面容器.addEventListener("context-menu", (event) => {
      console.log(event, remote);
      const menu = new remote.Menu();
      menu.append(
        new remote.MenuItem({
          label: "刷新",
          click: () => {
            this.页面容器.reload();
          },
          enabaled: event.params.canSelectAll,
          visiable: event.params.isEditable,
        })
      );
      menu.append(
        new remote.MenuItem({
          role: "selectAll",
          label: "全选",
          enabaled: event.params.canSelectAll,
          visiable: event.params.isEditable,
        })
      );
      menu.append(
        new remote.MenuItem({
          role: "copy",
          label: "复制",
          enabaled: event.params.selectionText,
          visiable: event.params.selectionText,
        })
      );
      menu.append(
        new remote.MenuItem({
          label: "搜索思源",
          click: async () => {
            siyuanMenu.close();
            let params = {
              query: event.params.selectionText,
              method: 0,
              types: {
                document: true,
                heading: true,
                list: true,
                listItem: true,
                codeBlock: true,
                htmlBlock: true,
                mathBlock: true,
                table: true,
                blockquote: true,
                superBlock: true,
                paragraph: true,
                embedBlock: false,
              },
              paths: [],
              groupBy: 0,
              orderBy: 0,
              page: 1,
            };
            let result = await kernelApi.全文搜索块(params);
            console.log(result);
            result.blocks.forEach((block) => {
              let blockItem = {
                icon: getIconByType(block.type, block.subtype),
                label: block.content.substring(0, 60),
                click: async (e) => {
                  let checkBlockFold = await kernelApi.checkBlockFold({
                    id: block.id,
                  });
                  let data = await kernelApi.getBlockInfo({ id: block.id });
                  clientApi.openTab({
                    fileName: data.rootTitle,
                    rootIcon: data.rootIcon,
                    rootID: data.rootID,
                    id: block.id,
                    action: checkBlockFold
                      ? ["cb-get-focus", "cb-get-all"]
                      : ["cb-get-focus", "cb-get-context"],
                    zoomIn: checkBlockFold,
                    removeCurrentTab: true,
                    position: "right",
                  });
                  this.hideOverlay();
                },
              };

              siyuanMenu.addItem(blockItem);
            });
            siyuanMenu.open({
              x: event.params.x,
              y: event.params.y,
            });
            this.showOverlay();
          },
          enabaled: event.params.selectionText,
          visiable: event.params.selectionText,
        })
      );
      menu.popup(remote.getCurrentWindow());
    });
  }
  hideOverlay() {
    this.面板容器.querySelector(".ovelayer")
      ? this.面板容器.querySelector(".ovelayer").remove()
      : null;
  }
  showOverlay() {
    if (!this.面板容器.querySelector(".ovelayer")) {
      let div = document.createElement("div");
      div.setAttribute(
        "style",
        `position:absolute;bottom:0;left:0;height:calc(100% - 0px);width:100%`
      );
      div.setAttribute("class", "ovelayer");
      div.addEventListener("mousedown", () => {
        siyuanMenu.close();
      });
      this.面板容器.appendChild(div);
    }
  }
  绑定事件() {
    document.addEventListener(
      "mousedown",
      () => {
        this.showOverlay();
      },
      true
    );
    document.addEventListener(
      "mouseup",
      () => {
        this.hideOverlay();
      },
      true
    );
    this.地址栏容器.addEventListener("change", () => {
      this.加载URL(this.地址栏容器.value);
    });
    this.前进按钮.addEventListener("click", () => {
      this.移动历史(1);
    });
    this.后退按钮.addEventListener("click", () => {
      this.移动历史(-1);
    });
    this.页面容器.addEventListener("will-navigate", (e) => {
      e.preventDefault();
      const protocol = new URL(e.url).protocol;
      if (
        protocol === "http:" ||
        protocol === "https:" ||
        protocol === "file:"
      ) {
        this.页面容器.src = e.url;
      }
    });
    this.页面容器.addEventListener("page-title-updated", async (e) => {
      this.tilte = e.title;
      // this.标题容器.innerHTML = e.title
    });
    this.重载按钮.addEventListener("click", () => {
      this.重新加载();
    });
  }
  重新加载() {
    this.加载历史(this.页面状态.当前历史序号);
  }
  修正协议(url) {
    console.log(url);
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("file://")
    ) {
      return url;
    } else {
      return "https://" + url;
    }
  }
  加载URL(url) {
    url = this.修正协议(url);
    this.页面状态.历史记录数组.push(url);
    this.移动历史(1);
  }
  移动历史(步数) {
    let 页面状态 = this.页面状态;
    console.log(this.页面状态);
    if (页面状态.当前历史序号 + 步数 >= 页面状态.历史记录数组.length - 1) {
      this.加载历史(页面状态.历史记录数组.length - 1);
    } else if (页面状态.当前历史序号 + 步数 < 0) {
      this.加载历史(0);
    } else {
      this.加载历史(页面状态.当前历史序号 + 步数);
    }
  }
  async 加载历史(历史序号) {
    let url = this.页面状态.历史记录数组[历史序号];
    this.页面容器.setAttribute("src", url);
    this.地址栏容器.value !== url ? (this.地址栏容器.value = url) : null;
    this.页面状态.当前历史序号 = 历史序号;
    浏览记录.push({
      tab: this,
      url: url,
    });
  }
  async 查找反向链接() {
    this.backlinkListElement.innerHTML = "等待加载";
    let url = this.urlInputter.value;
    this.反向链接编辑器 = new BacklinksEditor(this.backlinkListElement, url);
  }
  加载文件(文件路径) {
    //如果没有指定file协议,就加上file协议
    if (!文件路径.startsWith("file://")) {
      文件路径 = "file://" + 文件路径;
    }
    this.加载URL(文件路径);
  }
}

//反向链接等官方编辑器接口再移植
/*class BacklinksEditor  {
    constructor(element,key){
        this.element= element
        this.element.innerHTML = ''
        this.element.classList.add('fn__flex-1')
        this.查找反向链接(key)
    }
    async 查找反向链接(key){
        if(!key){
            this.element.innerHTML='未找到相关内容'
        }
        let blocks =  await 核心api.fullTextSearchBlock({
            path:'',
            query:key,
            "types":{"document":true,"heading":true,"list":true,"listItem":true,"codeBlock":true,"htmlBlock":true,"mathBlock":true,"table":true,"blockquote":true,"superBlock":true,"paragraph":true}
        })
        if(blocks.blocks.length==0){
            this.element.innerHTML='未找到相关内容'
        }
        else{
            console.log(blocks.blocks)
            new BlockListEditor(this.element,blocks.blocks)
        }
    }
}*/
module.exports = class browserTab extends Plugin {
  onload() {
    console.log("浏览器页签加载");
    document.addEventListener("click", this.onlick, true);
    this.初始化依赖();
    this.customTab = this.addTab(BrowserTabContainer);
    siyuanMenu = new clientApi.Menu("browserTab", () => {});
  }
  async 初始化依赖() {
    kernelApi = (await import("/plugins/browserTab/pollyfills/kernelApi.js"))[
      "default"
    ];
  }
  onlick = (e) => {
    if (
      e.target.dataset &&
      e.target.dataset.type == "a" &&
      e.target.dataset.href
    ) {
      try {
        this.判定链接回调(e.target, e);
      } catch (e) {
        console.error(e);
      }
    }
  };
  判定链接回调(链接元素, 点击事件) {
    if (!链接元素.dataset.href) {
      return;
    } else {
      let _url = new URL(链接元素.dataset.href);
      console.log(_url);
      if (this.协议处理函数(_url.protocol, 链接元素)) {
        let data = this.协议处理函数(_url.protocol, 链接元素);
        let tab = clientApi.openTab({
          custom: {
            icon: "iconLanguage",
            title: data.data.title || "browserTab",
            fn: this.customTab,
            data: data.data,
          },
        });
        console.log(tab);

      }
    }

    点击事件.preventDefault();
    点击事件.stopPropagation();
  }
  协议处理函数(协议, 链接元素) {
    if (!协议) {
      return { data: { titlte: 链接元素.dataset.title,url:链接元素.dataset.href} };
    }
    if(协议=='https:'||协议==='http:'){
        return {data:{titlte: 链接元素.dataset.title,url:链接元素.dataset.href}}
    }
  }
};
