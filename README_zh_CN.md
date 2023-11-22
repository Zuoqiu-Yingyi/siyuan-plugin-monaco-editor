<div align="center">
<img alt="图标" src="https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor/public/icon.png" style="width: 8em; height: 8em;">

---
[![GitHub 最新发行版本 (最新一次发行/预发行)](https://img.shields.io/github/v/release/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor?include_prereleases&style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor/releases/latest)
[![GitHub 最新发行时间](https://img.shields.io/github/release-date/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor/releases/latest)
[![GitHub 许可证](https://img.shields.io/github/license/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor/blob/main/LICENSE)
[![GitHub 最后一次提交时间](https://img.shields.io/github/last-commit/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor/commits/main)
![GitHub 仓库大小](https://img.shields.io/github/repo-size/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor?style=flat-square)
![GitHub 代码大小](https://img.shields.io/github/languages/code-size/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor.svg?style=flat-square)
![查看次数](https://hits.b3log.org/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor.svg)
[![GitHub 发行版本下载次数](https://img.shields.io/github/downloads/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor/total?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor/releases)

---
简体中文 \| [English](./README.md)

---
</div>

# 集成编辑环境 (Integrated Edit Environment, IEE)

这是一个不仅能够管理工作空间目录下文件与文件夹, 而且能够使用 [Monaco Editor](https://github.com/Microsoft/monaco-editor) 文本编辑器编辑文件与文档的 [思源笔记](https://github.com/siyuan-note/siyuan) 插件。

## 预览

![预览图片](https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor/public/preview.png)

## 功能介绍

### 文件资源管理器面板

该面板可以管理工作空间目录下的所有文件与文件夹

| 功能                | 操作                                                        | 适用对象               | 备注                                         |
| ------------------- | ----------------------------------------------------------- | ---------------------- | -------------------------------------------- |
| 上下文菜单菜单      | 鼠标右键点击文件/文件夹/根目录                              | 文件 & 文件夹 & 根目录 | 也可以通过点击菜单按钮打开菜单<br />         |
| 移动文件/文件夹     | 拖动文件/文件夹                                             | 文件 & 文件夹          | 移动目标位置不能存在同名的文件/文件夹        |
| 批量上传文件/文件夹 | 将文件/文件夹从系统文件资源管理器中拖拽至想要上传的文件夹中 | 文件夹                 | 拖拽后显示将要上传的文件列表, 确认后开始上传 |
| 下载文件/文件夹     | 拖拽文件/文件夹到窗口外部                                   | 文件 & 文件夹          | 文件夹将打包为压缩文件后下载                 |

### 编辑器面板

该面板可以显示当前正在编辑的块的 markdown/kramdown 源代码, 编辑并保存所有块的 kramdown 代码与叶子块的 markdown 代码

| 功能          | 操作                | 备注                                                                                                                                                                                                            |
| ------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 代码自动换行  | <kbd>Alt + Z</kbd>  | 打开/关闭自动折行功能<br />默认为思源设置中 <kbd>编辑器</kbd>><kbd>代码块换行</kbd> 选项<br />                                                                                                                  |
| 保存          | <kbd>Ctrl + S</kbd> | 若当前正在编辑的块可以保存 (正在编辑叶子块的 markdown 或者任何块的 kramdown 源代码)<br />则保存当前更改<br />                                                                                                   |
| 自动保存      | 面板按钮            | 开启后若当前正在编辑的块可以保存<br />则在编辑器中内容啊每次发生变更时都会更新对应的块<br />                                                                                                                    |
| kramdown 模式 | 面板按钮            | 是否开启 kramdown 模式<br />开启后, 编辑器显示当前正在编辑的块的 kramdown 源代码<br />关闭后, 编辑器显示当前正在编辑的块的 markdown 源代码                                                                      |
| 编辑方案切换  | 面板按钮            | kramdown 模式下<br />关闭时行内元素使用 markdown 标志符<br />开启时行内元素使用 `<span>`标签<br />markdown 模式下<br />关闭时行内元素使用扩展的 markdown 标志符<br />开启时行内元素仅使用基础的 markdown 标志符 |

## 设置项介绍

* `常规设置`

  * `文本编辑器`

    * 这是一个开关
    * 默认状态: *打开*
    * 该开关控制是否启用文本编辑器侧边面板

      * 该面板可以显示当前正在编辑的内容块对应的 markdown/kramdown 源代码
    * 更改该开关状态后界面将刷新以关闭文本编辑器面板
  * `资源管理器`

    * 这是一个开关
    * 默认状态: *打开*
    * 该开关控制是否启用文件资源管理器侧边面板
    * 更改该开关状态后界面将刷新以关闭文件资源管理面板
  * `安全模式`

    * 这是一个开关
    * 默认状态: *关闭*
    * 开启后将禁用在重要目录下的部分危险操作
    * 关闭后在进行重要目录下的危险操作前会进行三次确认
  * `重置设置选项`

    * 这是一个按钮
    * 重置所有设置选项为默认选项
    * 点击该按钮后会弹出确认对话框

      * 点击对话框确认按钮后会重置本插件所有选项为默认选项, 之后会自动刷新当前界面
* `菜单设置`

  * `代码片段菜单`

    * 这是一个开关
    * 默认状态: *打开*
    * 该开关控制是否启用 <kbd>设置</kbd>><kbd>外观</kbd>><kbd>代码片段</kbd>中的右键菜单, 该菜单可以打开 Monaco Editor 以查看/编辑代码片段
  * `收集箱菜单`

    * 这是一个开关
    * 默认状态: *打开*
    * 该开关控制是否启用收集箱的右键菜单, 该菜单可以打开 Monaco Editor 以查看收集箱中的内容
  * `文件历史菜单`

    * 这是一个开关
    * 默认状态: *打开*
    * 该开关控制是否启用文件历史对话框中文件历史选项卡的右键菜单, 该菜单可以打开 Monaco Editor 以对比模式查看/编辑文件的变更历史
  * `文档历史菜单`

    * 这是一个开关
    * 默认状态: *打开*
    * 该开关控制是否启用文档历史对话框中的右键菜单, 该菜单可以打开 Monaco Editor 以对比模式查看/编辑文档历史版本与当前版本
  * `快照菜单`

    * 这是一个开关
    * 默认状态: *打开*
    * 该开关控制是否启用文件历史对话框中快照选项卡页签的右键菜单, 该菜单可以打开 Monaco Editor 以对比模式查看快照的更改
* `编辑器设置`

  * `全局设置`

    * `Markdown 文件默认编辑器`

      * 设置打开 `*.md` 文件的默认编辑器
      * 默认使用 `Vditor` 编辑器打开 `*.md` 文件
  * `Vditor 编辑器`

    * `资源文件保存方案`

      * 指定保存(图片等)资源文件的方案, 不同的方案会将资源文件文件保存至不同的目录, 具体的保存目录还会受到 <kbd>编辑器设置 &gt; Vditor 编辑器 &gt; 资源文件保存目录</kbd> 设置项的影响
    * `资源文件保存目录`

      * 指定资源文件具体的保存目录, 实际的保存目录还受到 <kbd>编辑器设置 &gt; Vditor 编辑器 &gt; 资源文件保存方案</kbd> 设置项的影响
      * 示例

        * `资源文件保存方案`: `上传至 data/assets 目录`

          * `/assets/`: 将资源文件保存至 `工作空间/data/assets/` 目录下
          * `/assets/vditor/`: 将资源文件保存至 `工作空间/data/assets/vditor/` 目录下
        * `资源文件保存方案`: `使用相对路径指定目录`

          * `./`: 将资源文件保存至当前文件所在目录下
          * `./../`: 将资源文件保存至当前文件所在目录的上层目录下
          * `./assets/`: 将资源文件保存至当前文件所在目录的 `assets` 文件夹下
        * `资源文件保存方案`: `使用绝对路径指定目录`

          * `/`: 将资源文件保存至 `工作空间/` 目录下
          * `/assets/`: 将资源文件保存至 `工作空间/assets/` 目录下
          * `/vditor/assets/`: 将资源文件保存至 `工作空间/vditor/assets/` 目录下

## 更改日志

[CHANGELOG.md](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor/blob/main/CHANGELOG.md)
