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
  * `服务设置`

    * `测试`

      * 测试使用 `Wakapi/WakaTime > 服务设置 > API 密钥` 能否成功访问 `Wakapi/WakaTime > 服务设置 > API URL` 对应的服务
    * `API URL`

      * 自定义 `Wakapi/WakaTime` API 服务地址
      * 对应 `Wakapi/WakaTime` 配置文件中的 `api_url` 配置项
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
      * 必填项, 若未设置则无法与 `Wakapi/WakaTime` 建立连接
    * `主机名称`

      * 自定义设备名称
      * 若为空, 则使用思源内核所在设备的主机名
    * `超时时间`

      * 调用 `Wakapi/WakaTime` API 时的超时时间
      * 单位: 秒
    * `隐藏笔记本名称`

      * 在提交的操作活动信息中是否隐藏笔记本名称
      * 若开启, 则提交的信息中所有 <kbd>笔记本名称</kbd> 都替换为 <kbd>笔记本 ID</kbd>
    * `隐藏文档标题`

      * 在提交的操作活动信息中是否隐藏文档标题
      * 若开启, 则提交的信息中所有 <kbd>文档标题</kbd> 都替换为 <kbd>文档块 ID</kbd>

## 更改日志

[CHANGELOG.md](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-wakatime/blob/main/CHANGELOG.md)
