<div align="center">
<img alt="icon" src="https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-webview/public/icon.png" style="width: 8em; height: 8em;">

---
[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/Zuoqiu-Yingyi/siyuan-plugin-webview?include_prereleases&style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/releases/latest)
[![GitHub Release Date](https://img.shields.io/github/release-date/Zuoqiu-Yingyi/siyuan-plugin-webview?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/releases/latest)
[![GitHub License](https://img.shields.io/github/license/Zuoqiu-Yingyi/siyuan-plugin-webview?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/Zuoqiu-Yingyi/siyuan-plugin-webview?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/commits/main)
![GitHub repo size](https://img.shields.io/github/repo-size/Zuoqiu-Yingyi/siyuan-plugin-webview?style=flat-square)
![hits](https://hits.b3log.org/Zuoqiu-Yingyi/siyuan-plugin-webview.svg)
[![GitHub all releases](https://img.shields.io/github/downloads/Zuoqiu-Yingyi/siyuan-plugin-webview/total?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/releases)

---
[简体中文](./README_zh_CN.md) \| English

---
</div>

# SiYuan Webpage View

A plugin for [SiYuan Note](https://github.com/siyuan-note/siyuan) that allows you to browse web pages in a tab or new window like a browser.

## PREVIEW

![preview image](https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-webview/public/preview.png)

## INTRODUCTION

### Function Introduction

- Open hyperlinks in SiYuan Note new tabs (desktop only)
- Open hyperlinks in a new window
- Open the SiYuan Note editor in a new window
- Block reference context menu
- Hyperlink context menu

### Setting Introduction

After installing this plugin, click <kbd>SiYuan Settings</kbd> > <kbd>Marketplace</kbd> > <kbd>Downloaded</kbd> > <kbd>Plugins</kbd> > <kbd>Web View (this plugin)</kbd> > <kbd>Settings</kbd> button to open the plugin's settings panel.

- General Settings
  - `User-Agent field (User-Agent, UA)`
    - This is an input field.
    - Default content: `<empty>`
    - For details on this field, please refer to [User-Agent - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent).
    - Users can browse web pages using a custom UA to replace the default UA.
    - This option can only be used on desktop devices.
      - When opening hyperlinks in a tab
      - When opening hyperlinks in a new window
    - When the input field is empty, the default UA `SiYuan/x.y.z https://b3log.org/siyuan Electron` will be used.
      - `x.y.z` is the current version number of SiYuan.
  - `Web Page Background`
    - This is an input field
    - Default content: `transparent`
    - User can define the background color or background image of the web page.
    - For details on this field, please refer to [background - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/background).
  - `Reset Settings Options`
    - This is a button.
    - Resets all settings options to their default settings.
    - After clicking this button, a confirmation dialog will pop up.
      - Clicking the confirmation dialog button will reset all options for this plugin to their default settings, and the current interface will be automatically refreshed.
- Open in a Tab
  - `General Settings`
    - `Enable`
      - This is a switch.
      - Default status: *on*
      - Once turned on, it enables the feature to **open hyperlinks in a tab**.
      - Due to the security restrictions of the browser, this feature can only be used on desktop devices.
    - `Editor Hyperlinks`
      - This is a switch.
      - Default status: *on*
      - Only available when the `Enable` switch in the `General Settings` tab is turned on.
      - Once turned on, clicking on hyperlinks in the editor will open them in a new tab.
    - `Other Hyperlinks`
      - This is a switch.
      - Default status: *on*
      - Only available when the `Enable` switch in the `General Settings` tab is turned on.
      - Once turned on, clicking on hyperlinks outside of the editor will open them in a new tab.
        - For example, clicking on hyperlinks in the export preview page.
  - `Protocol`
    - This is a group of switches.
    - Default status: *all on*
    - Only available when the `Enable` switch in the `General Settings` tab is turned on.
    - Only active network protocols can be opened in a tab.
      - Other protocols/inactive protocols can be opened with the default program.
  - `Shortcut Keys`
    - This is a group of switches.
    - Default status: *left mouse button single click*
    - Only available when the `Enable` switch in the `General Settings` tab is turned on.
    - Configures the keyboard shortcut needed to open hyperlinks in a tab.
- Open in a Window
  - `General Settings`
    - `Enable`
      - This is a switch.
      - Default status: *on*
      - Once turned on, it enables the feature to **open hyperlinks in a new window**.
    - `Editor Hyperlinks`
      - This is a switch.
      - Default status: *on*
      - Only available when the `Enable` switch in the `General Settings` tab is turned on.
      - Once turned on, clicking on hyperlinks in the editor with the middle mouse button will open them in a new window.
    - `Other Hyperlinks`
      - This is a switch.
      - Default status: *off*
      - Only available when the `Enable` switch in the `General Settings` tab is turned on.
      - Once turned on, clicking on hyperlinks outside of the editor with the middle mouse button will open them in a new window.
        - For example, clicking on hyperlinks in the export preview page.
        - The hyperlink will also be opened with the default browser.
  - `Protocol`
    - This is a group of switches.
    - Default status: *all on*
    - Only available when the `Enable` switch in the `General Settings` tab is turned on.
    - Only active network protocols can be opened in a new window.
      - Inactive protocols will not respond.
      - Clicking on the `siyuan://` protocol will open the SiYuan Note editor in a new window and jump to the specified block.
  - `Shortcut Keys`
    - This is a group of switches.
    - Default status: *middle mouse button click*
    - Only available when the `Enable` switch in the `General Settings` tab is turned on.
    - Configures the keyboard shortcuts needed to open hyperlinks in a new window.
  - `SiYuan Editor`
    - `Enable`
      - This is a switch.
      - Default status: *on*
      - Once turned on, it enables the feature to **open the SiYuan editor in a new window**.
        - Clicking on elements in the SiYuan interface with the configured keyboard shortcut will open the SiYuan editor in a new window and jump to the corresponding position.
        - Clickable elements include:
          - `Block`: any block in the editor
          - `Block Icon`: the icon displayed when hovering over a block with the mouse
          - `Block Reference`: inline element block reference
          - `Breadcrumb`: each item in the breadcrumb
          - `Document Title`: the title area of the document
          - `Outline`: each item in the outline panel
          - `Document Tree`: each item in the document tree
          - `Backlink Panel`: each item in the backlink panel
          - `Floating Preview Window`: the title bar of the floating preview window.
    - `Desktop Editor`
      - This is a button.
      - Clicking it will open a desktop SiYuan editor in a new window.
    - `Mobile Editor`
      - This is a button.
      - Clicking it will open a mobile SiYuan editor in a new window.
    - `Focus`
      - This is a switch.
      - Default status: *off*
      - Once turned on, when the SiYuan editor is opened in a new window, the corresponding block will be focused.
    - `Editor Type`
      - This is a drop-down selector.
      - Default status: *Mobile Editor*
      - You can choose which type of SiYuan editor to open in a new window.

## CHANGELOG

[CHANGELOG.md](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-webview/blob/main/CHANGELOG.md)
