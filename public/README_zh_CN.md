<div align="center">
<img alt="图标" src="https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-typewriter/public/icon.png" style="width: 8em; height: 8em;">

---
[![GitHub 最新发行版本 (最新一次发行/预发行)](https://img.shields.io/github/v/release/Zuoqiu-Yingyi/siyuan-plugin-typewriter?include_prereleases&style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-typewriter/releases/latest)
[![GitHub 最新发行时间](https://img.shields.io/github/release-date/Zuoqiu-Yingyi/siyuan-plugin-typewriter?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-typewriter/releases/latest)
[![GitHub 许可证](https://img.shields.io/github/license/Zuoqiu-Yingyi/siyuan-plugin-typewriter?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-typewriter/blob/main/LICENSE)
[![GitHub 最后一次提交时间](https://img.shields.io/github/last-commit/Zuoqiu-Yingyi/siyuan-plugin-typewriter?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-typewriter/commits/main)
![GitHub 仓库大小](https://img.shields.io/github/repo-size/Zuoqiu-Yingyi/siyuan-plugin-typewriter?style=flat-square)
![查看次数](https://hits.b3log.org/Zuoqiu-Yingyi/siyuan-plugin-typewriter.svg)
<!-- ![jsDelivr 查看次數 (GitHub)](https://img.shields.io/jsdelivr/gh/hy/Zuoqiu-Yingyi/siyuan-packages-typewriter?style=flat-square) -->
[![GitHub 发行版本下载次数](https://img.shields.io/github/downloads/Zuoqiu-Yingyi/siyuan-plugin-typewriter/total?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-typewriter/releases)

---
简体中文 \| [English](./README.md)

---
</div>

# 思源打字机模式插件

这是一款可以突出显示当前正在编辑的块, 并将其自动滚动至编辑区中间的[思源笔记](https://github.com/siyuan-note/siyuan)插件。

## 预览

![预览图片](https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-typewriter/public/preview.png)

## 常见问题

## 介绍

### 功能介绍

* `焦点显示`

  * 在编辑器中显示当前正在编辑的块 (光标所在的块)

    * 每个编辑器中当前正在编辑的块 (表格中当前正在编辑的单元格) 元素会设置属性 `data-plugin-focus="true"`
    * 当前光标所在的块 (表格中当前光标所在的单元格) 元素会设置 `id` 属性 `plugin-focus-unique-id`
  * `CSS` 样式变量, 可以在 <kbd>思源设置 &gt; 外观 &gt; 代码片段</kbd> 中修改

    * ```css
      :root {
          /* 焦点阴影模糊半径 */
          --custom-focus-shadow-blur: 0.25em;
          /* 焦点阴影的颜色 */
          --custom-focus-shadow-color: var(--b3-theme-secondary);

          /* 全局唯一焦点阴影的颜色 */
          --custom-focus-unique-shadow-color: var(--b3-theme-primary);

          /* 焦点所在表格行的轮廓宽度 */
          --custom-focus-table-row-outline-width: 1px;
          /* 焦点所在表格行的轮廓颜色 */
          --custom-focus-table-row-outline-color: var(--b3-theme-on-surface);

          /* 焦点所在表格单元格的阴影模糊半径 */
          --custom-focus-table-cell-shadow-blur: 0.25em;
      }
      ```
* `打字机模式`

  * 将当前正在编辑的块 (光标所在的块) 保持在编辑区中间

    * 若光标位于表格块中, 可以将光标所在的单元格保持在编辑区中间
    * 若光标位于代码块中, 可以将光标所在的行保持在编辑区中间
  * 可以通过如下方式打开/关闭该模式

    * <kbd>本插件设置面板 &gt; 打字机设置 &gt; 启用打字机模式</kbd>
    * 右上角顶部菜单栏中的 `打字机模式` 按钮
    * 快捷键 <kbd>Shift + Alt + T</kbd>
    * 命令面板 `打开/关闭打字机模式` 选项

### 设置项介绍

* 常规设置

  * `重置设置选项`

    * 该按钮将重置所有设置选项为默认选项
    * 重置后将刷新页面
* 焦点设置

  * `显示当前焦点`

    * 开启后将在编辑器中显示当前正在编辑的块 (为当前正在编辑的块添加一个轮廓)

      * 当前正在编辑的块元素将设置属性 `data-plugin-focus="true"` 与 `id="plugin-focus-unique-id"`
    * 关闭后将不再突出显示当前正在编辑的块

      * 移除所有的属性 `data-plugin-focus="true"` 与 `id="plugin-focus-unique-id"`
    * 该选项不会应用打字机模式的功能
* 打字机设置

  * `启用打字机模式`

    * 开启后在编辑时焦点所在块将自动滚动至编辑区中间
  * `代码块焦点跟随行`

    * 开启后在编辑代码块时, 将光标所在的代码行滚动至编辑区中间
    * 关闭后在编辑代码块时, 将该代码块滚动至编辑区中间
  * `表格块焦点跟随单元格`

    * 开启后在编辑表格块时, 将光标所在的表格单元格滚动至编辑区中间
    * 关闭后在编辑表格块时, 将该表格块滚动至编辑区中间
  * `数据库焦点跟随单元格`

    * 开启后在编辑数据库块(属性视图)时, 将光标所在的单元格滚动至编辑区中间
    * 关闭后在编辑数据库块(属性视图)时, 将该数据库块滚动至编辑区中间
  * `滚动延时时间`

    * 当光标位置移动至其他块时, 经过一定延时后光标所在的块再滚动至编辑区中间
    * 单位: 毫秒

## 更改日志

[CHANGELOG.md](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-typewriter/blob/main/CHANGELOG.md)
