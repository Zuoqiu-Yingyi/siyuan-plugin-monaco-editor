<div align="center">
<img alt="icon" src="https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-typewriter/public/icon.png" style="width: 8em; height: 8em;">

---
[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/Zuoqiu-Yingyi/siyuan-plugin-typewriter?include_prereleases&style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-typewriter/releases/latest)
[![GitHub Release Date](https://img.shields.io/github/release-date/Zuoqiu-Yingyi/siyuan-plugin-typewriter?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-typewriter/releases/latest)
[![GitHub License](https://img.shields.io/github/license/Zuoqiu-Yingyi/siyuan-plugin-typewriter?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-typewriter/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/Zuoqiu-Yingyi/siyuan-plugin-typewriter?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-typewriter/commits/main)
![GitHub repo size](https://img.shields.io/github/repo-size/Zuoqiu-Yingyi/siyuan-plugin-typewriter?style=flat-square)
![hits](https://hits.b3log.org/Zuoqiu-Yingyi/siyuan-plugin-typewriter.svg)
<!-- ![jsDelivr hits (GitHub)](https://img.shields.io/jsdelivr/gh/hy/Zuoqiu-Yingyi/siyuan-packages-typewriter?style=flat-square) -->
[![GitHub all releases](https://img.shields.io/github/downloads/Zuoqiu-Yingyi/siyuan-plugin-typewriter/total?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-typewriter/releases)

---
[简体中文](./README_zh_CN.md) \| English

---
</div>

# Typewriter Mode Plugin for SiYuan

This is a plug-in for [SiYuan Note](https://github.com/siyuan-note/siyuan) that can highlight the currently edited block and automatically scroll it to the center of the editing area.

## Preview

![Preview Image](https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-typewriter/public/preview.png)

## Frequently Asked Questions

## Introduction

### Features

* `Focus Display`

  * Show the currently edited block (block where the cursor is located) in the editor

    * Each currently edited block (cell in a table) in the editor will have the attribute `data-plugin-focus="true"`
    * The currently edited block (cell where the cursor is located) will have the `id` attribute `plugin-focus-unique-id`
  * `CSS` style variables can be modified in <kbd>SiYuan Settings &gt; Appearance &gt; Code Snippet</kbd>

    * ```css
      :root {
          /* Focus shadow blur radius */
          --custom-focus-shadow-blur: 0.25em;
          /* Focus shadow color */
          --custom-focus-shadow-color: var(--b3-theme-secondary);

          /* Global unique focus shadow color */
          --custom-focus-unique-shadow-color: var(--b3-theme-primary);

          /* Outline width of the table row with focus */
          --custom-focus-table-row-outline-width: 1px;
          /* Outline color of the table row with focus */
          --custom-focus-table-row-outline-color: var(--b3-theme-on-surface);

          /* Shadow blur radius of the table cell with focus */
          --custom-focus-table-cell-shadow-blur: 0.25em;
      }
      ```
* `Typewriter Mode`

  * Keep the currently edited block (block where the cursor is located) in the middle of the editor

    * If the cursor is in a table block, the cell where the cursor is located can be kept in the middle of the editor
    * If the cursor is in a code block, the line where the cursor is located can be kept in the middle of the editor
  * This mode can be enabled/disabled in the following ways

    * <kbd>This Plugin Settings Panel &gt; Typewriter Settings &gt; Enable Typewriter Mode</kbd>
    * `Typewriter Mode` button in the top-right corner of the menu bar
    * Shortcut key <kbd>Shift + Alt + T</kbd>
    * Command Palette option `Toggle Typewriter Mode`

### Settings

* General Settings

  * `Reset Settings`

    * This button will reset all settings to their default values
    * The page will be refreshed after resetting
* Focus Settings

  * `Display Current Focus`

    * When enabled, the currently edited block will be highlighted in the editor (outline will be added to the currently edited block)

      * The element of the currently edited block will have attributes `data-plugin-focus="true"` and `id="plugin-focus-unique-id"`
    * When disabled, the currently edited block will no longer be highlighted

      * All attributes `data-plugin-focus="true"` and `id="plugin-focus-unique-id"` will be removed
    * This option does not apply the features of Typewriter Mode
* Typewriter Settings

  * `Enable Typewriter Mode`

    * When enabled, the block where the cursor is located will automatically scroll to the middle of the editor while editing
  * `Code Block Line Focus Follow`

    * When enabled, the line of code where the cursor is located will be scrolled to the middle of the editor while editing a code block
    * When disabled, the code block will be scrolled to the middle of the editor while editing a code block
  * `Table Block Cell Focus Follow`

    * When enabled, the table cell where the cursor is located will be scrolled to the middle of the editor while editing a table block
    * When disabled, the table block will be scrolled to the middle of the editor while editing a table block
  * `Database Block Cell Focus Follow`

    * When enabled, the cell where the cursor is located will be scrolled to the middle of the editor while editing a database block (property view).
    * When disabled, the entire database block will be scrolled to the middle of the editor while editing a database block (property view).
  * `Scroll Delay`

    * After the cursor moves to another block, the block where the cursor is located will scroll to the middle of the editor after a certain delay
    * Unit: Milliseconds

## Changelog

[CHANGELOG.md](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-typewriter/blob/main/CHANGELOG.md)
