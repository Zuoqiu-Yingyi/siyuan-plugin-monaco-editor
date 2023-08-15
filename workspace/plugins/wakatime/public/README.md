<div align="center">
<img alt="icon" src="https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-wakatime/public/icon.png" style="width: 8em; height: 8em;">

---
[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/Zuoqiu-Yingyi/siyuan-plugin-wakatime?include_prereleases&style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-wakatime/releases/latest)
[![GitHub Release Date](https://img.shields.io/github/release-date/Zuoqiu-Yingyi/siyuan-plugin-wakatime?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-wakatime/releases/latest)
[![GitHub License](https://img.shields.io/github/license/Zuoqiu-Yingyi/siyuan-plugin-wakatime?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-wakatime/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/Zuoqiu-Yingyi/siyuan-plugin-wakatime?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-wakatime/commits/main)
![GitHub repo size](https://img.shields.io/github/repo-size/Zuoqiu-Yingyi/siyuan-plugin-wakatime?style=flat-square)
![hits](https://hits.b3log.org/Zuoqiu-Yingyi/siyuan-plugin-wakatime.svg)
[![GitHub all releases](https://img.shields.io/github/downloads/Zuoqiu-Yingyi/siyuan-plugin-wakatime/total?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-wakatime/releases)

---
[简体中文](./README_zh_CN.md) \| English

---
</div>

# SiYuan WakaTime

A plugin for [SiYuan Note](https://github.com/siyuan-note/siyuan) that can use [Wakapi](https://github.com/muety/wakapi) or [WakaTime](https://wakatime.com/) to generate metrics, insights, and time tracking automatically from your editing activity.

## PREVIEW

![preview image](https://cdn.jsdelivr.net/gh/Zuoqiu-Yingyi/siyuan-plugin-wakatime/public/preview.png)

## Q & A

* How can I protect my personal privacy when using the Wakapi/WakaTime service?

  * The best solution is to deploy the `muety/wakapi` project privately on your own device, which is compatible with most [WakaTime plugins](https://wakatime.com/plugins).
  * Customize the following settings options for this plugin:

    * `Wakapi/WakaTime > General Settings > Project Name`
    * `Wakapi/WakaTime > Service Settings > Host Name`
  * Enable the following settings options for this plugin:

    * `Wakapi/WakaTime > Service Settings > Hide Notebook Name`
    * `Wakapi/WakaTime > Service Settings > Hide Document Title`

## INTRODUCTION

### Features Introduction

[WakaTime](https://WakaTime.com/) provides its users with a tracking service for text editing activities. Users can install open-source plugins in their integrated development environments and text editors to submit their editing activities for tracking, analysis, and visualization.

[Wakapi](https://github.com/muety/wakapi) is an open-source alternative to the [WakaTime](https://github.com/wakatime) project. It also provides its users with a tracking service for text editing activities and is compatible with most [WakaTime plugins](https://wakatime.com/plugins).

### Settings Introduction

* `General`

  * `Reset Settings Options`

    * Reset all settings options to their default values.
    * After clicking this button, a confirmation dialog will appear.

      * After clicking the confirmation button in the dialog, all options for this plugin will be reset to their default values, and the current interface will be automatically refreshed.
* `Wakapi/WakaTime`: Configure the functionality and service of `Wakapi` or `WakaTime`

  * `General`

    * `Heartbeat Connection`

      * Enable this option to use the API [users/current/heartbeats](https://wakatime.com/developers#heartbeats) to periodically submit activity information to the `Wakapi/WakaTime` service when viewing/editing documents.
      * The time interval is set by `Wakapi/WakaTime > General Settings > Push Interval`.
      * The submitted information includes:

        * `type`: `"file"`
        * `hostname`: Host name

          * If `Wakapi/WakaTime > Service Settings > Host Name` is not empty, a custom host name will be used.
          * If `Wakapi/WakaTime > Service Settings > Host Name` is empty, the host name of the device where the Obsidian is running will be used.
        * `project`: Project name

          * If `Wakapi/WakaTime > General Settings > Project Name` is not empty, a custom project name will be used.
          * If `Wakapi/WakaTime > General Settings > Project Name` is empty, `siyuan-workspace:workspace` will be used as the default project name.
        * `branch`: <kbd>Notebook name</kbd> or <kbd>notebook ID</kbd>

          * When the `Wakapi/WakaTime > Service Settings > Hide Notebook Name` toggle is enabled, it will be the <kbd>Notebook ID</kbd>.
        * `entity`: Document file path

          * When the `Wakapi/WakaTime > Service Settings > Hide Notebook Name` toggle is enabled, the <kbd>Notebook Name</kbd> will be replaced with the <kbd>Notebook ID</kbd>.
          * When the `Wakapi/WakaTime > Service Settings > Hide Document Title` toggle is enabled, the <kbd>Document Title</kbd> will be replaced with the <kbd>Block ID</kbd>.
        * `language`: File language name

          * If `Wakapi/WakaTime > General Settings > Language Name` is not empty, a custom language name will be used.
          * If `Wakapi/WakaTime > General Settings > Language Name` is empty, `Siyuan` will be used as the default language name.
        * `category`: User operation type

          * When viewing a note, it is set to the item specified by `Wakapi/WakaTime > General Settings > View Operation Tag`.
          * When editing a note, it is set to the item specified by `Wakapi/WakaTime > General Settings > Edit Operation Tag`.
        * `time`: Timestamp corresponding to the view/edit operation performed by the user.
        * `is_write`: Whether it is an editing operation.
    * `Project Name`

      * Customize the name of the current workspace.
      * Corresponds to the `Projects` field in the `Wakapi/WakaTime` statistics results.
      * If empty, `siyuan-workspace:workspace` will be used as the default project name.
    * `Language Name`

      * Customize the language name corresponding to `*.sy` files.
      * Corresponds to the `Languages` field in the `Wakapi/WakaTime` statistics results.
      * If empty, `Siyuan` will be used as the default language name.
    * `Push Interval`

      * If there are user operations (view/edit) within the specified time interval, the operation information will be submitted to the `Wakapi/WakaTime` service using the API [users/current/heartbeats](https://wakatime.com/developers#heartbeats).
      * Unit: seconds
      * For more details about the submitted information, please refer to `Wakapi/WakaTime > General Settings > Heartbeat Connection`.
    * `View Operation Tag`

      * Activity tags corresponding to user view operations

        * Open a document
        * Move the cursor focus in the document
      * Corresponds to the `Category` in the WakaTime statistics results.
    * `Edit Operation Tag`

      * Activity tags corresponding to user editing operations

        * Document content is modified
        * Document attributes are modified
      * Corresponds to the `Category` in the WakaTime statistics results.
  * `Service Settings`

    * `Test`

      * Test whether using the `Wakapi/WakaTime > Service Settings > API Key` can successfully access the service corresponding to the `Wakapi/WakaTime > Service Settings > API URL`.
    * `API URL`

      * Customize the API service address for `Wakapi/WakaTime`.
      * Corresponds to the `api_url` configuration item in the `Wakapi/WakaTime` configuration file.
      * If empty, the service address of `WakaTime` will be used (`https://wakatime.com/api/v1`).
      * If using a hosted `Wakapi` service, it should be set to `https://wakapi.dev/api`.
      * If using a privately deployed `Wakapi` service, it should be set to `http(s)://host[:port]/api`.

        * Examples

          * `http://localhost:3000/api`
          * `https://wakapi.your.domain.name/api`
      * Note

        * Therefore, it is necessary to ensure that the device where Obsidian is located can access the set service address.
    * `API KEY`

      * Customize the access key for the `Wakapi/WakaTime` API service.
      * This is a required field, and if not set, a connection cannot be established with `Wakapi/WakaTime`.
    * `Hostname`

      * Customize the device name.
      * If empty, the host name of the device where Obsidian is located will be used.
    * `Timeout`

      * Timeout duration when calling the `Wakapi/WakaTime` API.
      * Unit: seconds
    * `Hide Notebook Name`

      * Whether to hide the notebook name in the submitted activity information.
      * If enabled, all <kbd>Notebook Name</kbd> in the submitted information will be replaced with <kbd>Notebook ID</kbd>.
    * `Hide Document Title`

      * Whether to hide the document title in the submitted activity information.
      * If enabled, all <kbd>Document Title</kbd> in the submitted information will be replaced with <kbd>Block ID</kbd>.

## CHANGELOG

[CHANGELOG.md](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-wakatime/blob/main/CHANGELOG.md)
