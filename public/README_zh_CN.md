<div align="center">
<img alt="图标" src="https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-wakatime/public/icon.png" style="width: 8em; height: 8em;">

---
[![GitHub 最新发行版本 (最新一次发行/预发行)](https://img.shields.io/github/v/release/Zuoqiu-Yingyi/siyuan-plugin-wakatime?include_prereleases&style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-wakatime/releases/latest)
[![GitHub 最新发行时间](https://img.shields.io/github/release-date/Zuoqiu-Yingyi/siyuan-plugin-wakatime?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-wakatime/releases/latest)
[![GitHub 许可证](https://img.shields.io/github/license/Zuoqiu-Yingyi/siyuan-plugin-wakatime?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-wakatime/blob/main/LICENSE)
[![GitHub 最后一次提交时间](https://img.shields.io/github/last-commit/Zuoqiu-Yingyi/siyuan-plugin-wakatime?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-wakatime/commits/main)
![GitHub 仓库大小](https://img.shields.io/github/repo-size/Zuoqiu-Yingyi/siyuan-plugin-wakatime?style=flat-square)
![查看次数](https://hits.b3log.org/Zuoqiu-Yingyi/siyuan-plugin-wakatime.svg)
[![GitHub 发行版本下载次数](https://img.shields.io/github/downloads/Zuoqiu-Yingyi/siyuan-plugin-wakatime/total?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-wakatime/releases)

---
简体中文 \| [English](./README.md)

---
</div>

# 思源 WakaTime

一款可以使用 [Wakapi](https://github.com/muety/wakapi) 或 [WakaTime](https://wakatime.com/) 统计编辑活动的[思源笔记](https://github.com/siyuan-note/siyuan)插件。

## 预览

![预览图片](https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-wakatime/public/preview.png)

## 常见问题

* 如何在使用 `Wakapi/WakaTime` 服务时最大程度保护个人隐私?

  * 最佳解决方案是在您自己的设备中私有化部署 [muety/wakapi](https://github.com/muety/wakapi) 项目, 该项目可以兼容大部分 [WakaTime 插件](https://wakatime.com/plugins)
  * 自定义本插件的如下设置选项

    * `Wakapi/WakaTime > 常规设置 > 项目名称`
    * `Wakapi/WakaTime > 服务设置 > 主机名称`
  * 开启本插件的如下设置选项

    * `Wakapi/WakaTime > 服务设置 > 隐藏笔记本名称`
    * `Wakapi/WakaTime > 服务设置 > 隐藏文档标题`
  * 自定义包含列表以设置白名单

    * `Wakapi/WakaTime > 服务设置 > ID 包含列表`
    * `Wakapi/WakaTime > 服务设置 > 包含列表`
  * 自定义排除列表以设置黑名单

    * `Wakapi/WakaTime > 服务设置 > ID 排除列表`
    * `Wakapi/WakaTime > 服务设置 > 排除列表`

## 介绍

### 功能介绍

[WakaTime](https://WakaTime.com/) 为其用户提供文本编辑活动的统计服务，用户可以通过在集成开发环境和文本编辑器中安装开源插件以提交自己的编辑活动供其统计、分析与可视化。

[Wakapi](https://github.com/muety/wakapi) 是 [WakaTime](https://github.com/wakatime) 项目的开源替代品，同样可以为其用户提供文本编辑活动的统计服务，并兼容大部分 [WakaTime 插件](https://wakatime.com/plugins)。

### 设置项介绍

* `常规设置`

  * `重置设置选项`

    * 重置所有设置选项为默认选项
    * 点击该按钮后会弹出确认对话框

      * 点击对话框确认按钮后会重置本插件所有选项为默认选项, 之后会自动刷新当前界面
  * `清理离线缓存`

    * 删除所有的离线缓存文件
    * 缓存文件目录: `工作空间/temp/.wakatime/cache`
    * 点击该按钮后会弹出确认对话框

      * 点击对话框确认按钮后会删除缓存文件目录, 之后会自动刷新当前界面
* `Wakapi/WakaTime`: 配置 `Wakapi` 或 `WakaTime` 功能与服务

  * `常规设置`

    * `心跳连接`

      * 开启后将在有查看/编辑文档操作时使用 API [users/current/heartbeats](https://wakatime.com/developers#heartbeats) 定时向 `Wakapi/WakaTime` 服务提交活动信息
      * 时间间隔由 `Wakapi/WakaTime > 常规设置 > 推送时间间隔` 设定
      * 提交的信息包含如下内容

        * `type`: `"file"`
        * `hostname`: 主机名称

          * 若 `Wakapi/WakaTime > 服务设置 > 主机名称名称` 不为空, 则使用自定义的主机名称
          * 若 `Wakapi/WakaTime > 服务设置 > 主机名称名称` 为空, 则使用思源笔记内核所在设备的主机名称
        * `project`: 项目名称

          * 若 `Wakapi/WakaTime > 常规设置 > 项目名称` 不为空, 则使用自定义的项目名称
          * 若 `Wakapi/WakaTime > 常规设置 > 项目名称` 为空, 则使用 `siyuan-workspace:<工作空间所在文件夹名称>`
        * `branch`: 笔记本名称或笔记本 ID

          * 当 `Wakapi/WakaTime > 服务设置 > 隐藏笔记本名称` 开关开启时为 <kbd>笔记本 ID</kbd>
        * `entity`: 文档文件路径

          * 当 `Wakapi/WakaTime > 服务设置 > 隐藏笔记本名称` 开关开启时 <kbd>笔记本名称</kbd> 替换为 <kbd>笔记本 ID</kbd>
          * 当 `Wakapi/WakaTime > 服务设置 > 隐藏文档标题` 开关开启时 <kbd>文档标题</kbd> 替换为 <kbd>文档块 ID</kbd>
        * `language`: 文件语言名称

          * 若 `Wakapi/WakaTime > 常规设置 > 语言名称` 不为空, 则使用自定义的语言名称
          * 若 `Wakapi/WakaTime > 常规设置 > 语言名称` 为空, 则使用 `Siyuan`
        * `category`: 用户操作类型

          * 查看笔记时为 `Wakapi/WakaTime > 常规设置 > 查看操作标签` 所设置的项
          * 编辑笔记时为 `Wakapi/WakaTime > 常规设置 > 编辑操作标签` 所设置的项
        * `time`: 用户进行查看/编辑操作时对应的时间戳
        * `is_write`: 是否为编辑操作
    * `项目名称`

      * 自定义当前工作空间的名称
      * 对应 `Wakapi/WakaTime` 统计结果中的 `Projects` 字段
      * 若为空, 则使用 `siyuan-workspace:<工作空间所在文件夹名称>` 作为默认的项目名称
    * `语言名称`

      * 自定义 `*.sy` 文件对应的语言名称
      * 对应 `Wakapi/WakaTime` 统计结果中的 `Languages` 字段
      * 若为空, 则使用 `Siyuan` 作为默认的语言名称
    * `推送时间间隔`

      * 在指定的时间间隔内若存在用户操作(查看/编辑), 则使用 API [users/current/heartbeats](https://wakatime.com/developers#heartbeats) 向 `Wakapi/WakaTime` 服务提交操作信息
      * 单位: 秒
      * 提交的信息详情请参考 `Wakapi/WakaTime > 常规设置 > 心跳连接`
    * `查看操作标签`

      * 用户查看操作对应的活动标签

        * 打开某一篇文档
        * 光标焦点在文档中移动
      * 对应 `WakaTime` 统计结果中的 `Category`
    * `编辑操作标签`

      * 用户编辑操作对应的活动标签

        * 文档内容发生更改
        * 文档属性发生更改
      * 对应 `WakaTime` 统计结果中的 `Category`
    * `操作系统名称`

      * 内核所在操作系统的名称
      * 对应 `WakaTime` 统计结果中的 `Operating Systems`
    * `操作系统版本`

      * 当前操作系统的版本号
      * 默认为 `unknown` 以保护隐私
      * 置空则使用查询到的版本号
    * `操作系统架构`

      * 当前操作系统的处理器架构
      * 默认为 `unknown` 以保护隐私
      * 置空则使用查询到的架构
    * `用户代理字段 User-Agent`

      * 详情请参考 [User-Agent - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/User-Agent)
      * 置空则使用自动生成的字段

        * 强烈建议置空以自动生成该字段
        * 自定义该字段可能导致 `Wakapi/WakaTime` 服务无法识别该插件
      * 代理中存在如下信息

        * `wakatime-cli` 版本号

          * 本插件未使用
        * 操作系统名称
        * 操作系统版本
        * 操作系统架构
        * 思源应用版本
        * 本插件版本
  * `服务设置`

    * `测试`

      * 测试使用 `Wakapi/WakaTime > 服务设置 > API 密钥` 能否成功访问 `Wakapi/WakaTime > 服务设置 > API URL` 对应的服务
    * `API URL`

      * 自定义 `Wakapi/WakaTime` API 服务地址
      * 对应 `Wakapi/WakaTime` 配置文件 `.wakatime.cfg` 中的 `api_url` 配置项
      * 若为空, 则使用 `WakaTime` 的服务地址 `https://wakatime.com/api/v1`
      * 若使用托管的 `Wakapi` 服务, 应设置为 `https://wakapi.dev/api`
      * 若使用私有部署的 `Wakapi` 服务, 应设置为 `http(s)://host[:port]/api`

        * 示例

          * `http://localhost:3000/api`
          * `https://wakapi.your.domain.name/api`
      * 注意

        * 故需要保证思源内核所在的设备能够访问所设置的服务地址
    * `API 密钥`

      * 自定义 `Wakapi/WakaTime` API 服务访问密钥
      * 对应 `Wakapi/WakaTime` 配置文件 `.wakatime.cfg` 中的 `api_key` 配置项
      * 必填项, 若未设置则无法与 `Wakapi/WakaTime` 建立连接
    * `主机名称`

      * 自定义设备名称
      * 对应 `Wakapi/WakaTime` 配置文件 `.wakatime.cfg` 中的 `hostname` 配置项
      * 若为空, 则使用思源内核所在设备的主机名
    * `超时时间`

      * 调用 `Wakapi/WakaTime` API 时的超时时间
      * 对应 `Wakapi/WakaTime` 配置文件 `.wakatime.cfg` 中的 `timeout` 配置项
      * 单位: 秒
    * `隐藏笔记本名称`

      * 在提交的操作活动信息中是否隐藏笔记本名称
      * 对应 `Wakapi/WakaTime` 配置文件 `.wakatime.cfg` 中的 `hide_branch_names` 配置项
      * 若开启, 则提交的信息中所有 <kbd>笔记本名称</kbd> 都替换为 <kbd>笔记本 ID</kbd>
    * `隐藏文档标题`

      * 在提交的操作活动信息中是否隐藏文档标题
      * 对应 `Wakapi/WakaTime` 配置文件 `.wakatime.cfg` 中的 `hide_file_names` 配置项
      * 若开启, 则提交的信息中所有 <kbd>文档标题</kbd> 都替换为 <kbd>文档块 ID</kbd>
    * `离线缓存`

      * 是否将活动信息缓存在本地文件中
      * 触发离线缓存的条件

        * 关闭 `Wakapi/WakaTime > 常规设置 > 心跳连接`
        * 或无法访问 `Wakapi/WakaTime` 服务
      * 缓存文件目录: `工作空间/temp/.wakatime/cache`
      * 对应 `Wakapi/WakaTime` 配置文件 `.wakatime.cfg` 中的 `offline` 配置项
    * `ID 包含列表`

      * 仅提交 ID 路径中包含列表字段的文档
      * 若为空则包含所有笔记本与文档
      * 若不为空则仅提交 ID 路径中包含列表字段的文档

        * ID 路径格式: `<笔记本 ID>/<文档 ID>/.../<文档 ID>.sy`
        * ID 路径示例

          * `20210808180117-czj9bvb/20200812220555-lj3enxa.sy`
          * `20210808180117-czj9bvb/20200812220555-lj3enxa/20210808180320-fqgskfj.sy`
      * 每行一个记录, 可以为文本或者正则表达式, 正则表达式首尾需要使用 `/` 包裹, 如下所示

        ```plaintext
        20200812220555-lj3enxa
        /^20210917000226-w9fa32i\/20230522022822-roxea7p/
        ```

        上述列表与下述 `JavaScript` 代码等价

        ```javascript
        path.includes("20200812220555-lj3enxa") && /^20210917000226-w9fa32i\/20230522022822-roxea7p/.test(path)
        ```

        * `20200812220555-lj3enxa`

          * 提交 ID 为 `20200812220555-lj3enxa` 的笔记本或者文档本身及其下级的文档

            * 示例

              * `20210808180117-czj9bvb/20200812220555-lj3enxa.sy`: 包含
              * `20210808180117-czj9bvb/20200812220555-lj3enxa/20210808180320-fqgskfj.sy`: 包含
              * `20210808180117-czj9bvb/20210117211155-56n4odu.sy`: 不包含
        * `/^20210917000226-w9fa32i\/20230522022822-roxea7p/`

          * 提交匹配正则表达式 `^20210917000226-w9fa32i/20230522022822-roxea7p`` 的文档

            * 示例

              * `20210917000226-w9fa32i/20230522022822-roxea7p.sy`: 包含
              * `20210917000226-w9fa32i/20230522022822-roxea7p/20230522022929-ojqqfyn.sy`: 包含
              * `20210917000226-w9fa32i/20220424113742-2eznev2.sy`: 不包含
              * `20210808180117-czj9bvb/20210917000226-w9fa32i/20230522022822-roxea7p.sy`: 不包含
    * `ID 排除列表`

      * 提交时排除 ID 路径中包含列表字段的文档
      * 若为空则不排除所有笔记本与文档
      * 若不为空则排除 ID 路径中包含列表字段的文档

        * ID 路径格式与匹配规则请参考 `Wakapi/WakaTime > 服务设置 > ID 包含列表`
      * 每行一个记录, 可以为文本或者正则表达式, 正则表达式首尾需要使用 `/` 包裹
      * 排除列表的优先级高于包含列表

        * 若一个文档的 ID 路径同时匹配 ID 包含列表与 ID 排除列表, 则该文件会被排除
    * `包含列表`

      * 仅提交路径中包含列表字段的文档
      * 对应 `Wakapi/WakaTime` 配置文件 `.wakatime.cfg` 中的 `include` 配置项
      * 若为空则包含所有笔记本与文档
      * 若不为空则仅提交路径中包含列表字段的文档

        * 路径格式与示例

          |                   | `隐藏笔记本名称`: ✔                                                                                    | `隐藏笔记本名称`: ✖<br />                                                                         |
          | ----------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
          | `隐藏文档标题`: ✔ | `<笔记本 ID>/<文档 ID>/.../<文档 ID>.sy`<br />`20210808180117-czj9bvb/20200812220555-lj3enxa.sy`<br /> | `<笔记本名称>/<文档 ID>/.../<文档 ID>.sy`<br />`思源笔记用户指南/20200812220555-lj3enxa.sy`<br /> |
          | `隐藏文档标题`: ✖ | `<笔记本 ID>/<文档标题>/.../<文档标题>.sy`<br />`20210808180117-czj9bvb/请从这里开始.sy`               | `思源笔记用户指南/<文档标题>/.../<文档标题>.sy`<br />`思源笔记用户指南/请从这里开始.sy`<br />     |
      * 每行一个记录, 可以为文本或者正则表达式, 正则表达式首尾需要使用 `/` 包裹, 如下所示

        ```plaintext
        请从这里开始
        /^思源笔记用户指南\/请从这里开始/
        ```

        上述列表与下述 `JavaScript` 代码等价

        ```javascript
        path.includes("请从这里开始") && /^思源笔记用户指南\/请从这里开始/.test(path)
        ```
    * `排除列表`

      * 提交时排除路径中包含列表字段的文档
      * 对应 `Wakapi/WakaTime` 配置文件 `.wakatime.cfg` 中的 `exclude` 配置项
      * 若为空则不排除所有笔记本与文档
      * 若不为空则排除路径中包含列表字段的文档

        * 路径格式与匹配规则请参考 `Wakapi/WakaTime > 服务设置 > 包含列表`
      * 每行一个记录, 可以为文本或者正则表达式, 正则表达式首尾需要使用 `/` 包裹
      * 排除列表的优先级高于包含列表

        * 若一个文档的路径同时匹配包含列表与排除列表, 则该文件会被排除

## 更改日志

[CHANGELOG.md](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-wakatime/blob/main/CHANGELOG.md)
