<div align="center">
<img alt="icon" src="https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts/public/icon.png" style="width: 8em; height: 8em;">

---
[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts?include_prereleases&style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts/releases/latest)
[![GitHub Release Date](https://img.shields.io/github/release-date/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts/releases/latest)
[![GitHub License](https://img.shields.io/github/license/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts/commits/main)
![GitHub repo size](https://img.shields.io/github/repo-size/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts?style=flat-square)
![hits](https://hits.b3log.org/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts.svg)
[![GitHub all releases](https://img.shields.io/github/downloads/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts/total?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts/releases)

---
[简体中文](./README_zh_CN.md) \| English

---
</div>

# SiYuan Custom Fonts

A plugin for [SiYuan Note](https://github.com/siyuan-note/siyuan) that allows you to customize the list of fonts used by various elements in the interface.

## PREVIEW

![preview image](https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts/public/preview.png)

## INTRODUCTION

### Function Introduction

* Built-in [Twitter emoji (Twemoji)](https://github.com/mozilla/twemoji-colr) font

  * This font can be referenced by the font family name `Twemoji Mozilla`
* Check the font list in the system where the kernel is located

  * Some fonts in this list cannot be loaded when using a server.
* Check the font list supported by the current application (desktop/browser)

  * The font list that can be used in the current application.
* Custom CSS code snippets

  * Can dynamically load local/network font files through [@font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face).
* Customize the font list of various elements in the interface:

  * `Basic font`: the font used in the interface
  * `Code font`: the font used in inline code and code blocks
  * `Chart font`: the font used in relationship diagrams
  * `Math font`: the font used in inline formulas and formula blocks
  * `Emoji font`: the font used in emojis (used for document icons)

### Setting Introduction

After installing this plugin, click <kbd>SiYuan Settings</kbd> > <kbd>Marketplace</kbd> > <kbd>Downloaded</kbd> > <kbd>Plugins</kbd> > <kbd>Custom Fonts (this plugin)</kbd> > <kbd>Settings</kbd> button to open the plugin's settings panel.

* `General Settings`

  * `Reset Settings Options`

    * This is a button
    * Reset all settings options to their default options
    * Clicking this button will prompt a confirmation dialogue

      * Clicking the dialogue confirmation button will reset all options in this plugin to their default options and then automatically refresh the current interface
  * `System Font List`

    * This is a button
    * View the font list of the system in which the kernel is located
    * Clicking this button will prompt a dialogue displaying the system font list
  * `Available Font List`

    * This is a button
    * View the list of fonts currently supported by the application
    * Clicking this button will prompt a dialogue displaying the available font list

      * The font family reference name is displayed on the right-hand side of the top-level list item, which is needed when customizing fonts
      * When the top-level list item is expanded, all font styles in that family can be viewed
* `CSS Snippet`

  * `Enabled`

    * This is a toggle
    * Default state: *On*
    * When the toggle is turned on, the CSS code snippet below this setting will be applied to the current interface
  * `CSS Snippet`

    * This is a text input box
    * A `@font-face` rule is registered by default, used to load the [Twemoji Mozilla](https://github.com/mozilla/twemoji-colr) emoji font included with the plugin
    * For details, please refer to [@font-face - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
* `Font Settings`

  * Font lists need to specify the font family name to determine the font being used

    * For example, the font family name for `微软雅黑` is `Microsoft YaHei`
    * The font families currently supported by the application can be viewed by going to `General Settings` > `Available Font List`
    * One font family name is set per line in the font list, with higher priority fonts listed first
  * `Base Font`: Font used for the user interface

    * Customizable font list for text outside of the editor
  * `Code Font`: Font used for inline code and code blocks

    * Customizable font list for text in `inline code` and `code blocks` within the editor
  * `Chart Font`: Font used for relationship diagrams

    * Customizable font list for text in relationship diagrams
  * `Math Font`: Font used for inline formulas and formula blocks

    * Customizable font list for text in `inline formulas` and `math formula blocks` within the editor
  * `Emoji Font`: Font used for emoji symbols (used in document icons)

    * Customizable font list for emoji symbols used in document icons

## CHANGELOG

[CHANGELOG.md](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-custom-fonts/blob/main/CHANGELOG.md)
