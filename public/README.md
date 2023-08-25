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
  * Customize the inclusion list to set a whitelist

    * `Wakapi/WakaTime > Service Settings > ID Inclusion List`
    * `Wakapi/WakaTime > Service Settings > Inclusion List`
  * Customize the exclusion list to set a blacklist

    * `Wakapi/WakaTime > Service Settings > ID Exclusion List`
    * `Wakapi/WakaTime > Service Settings > Exclusion List`

## INTRODUCTION

### Features Introduction

[WakaTime](https://WakaTime.com/) provides its users with a tracking service for text editing activities. Users can install [open-source plugins](https://wakatime.com/plugins) in their integrated development environments and text editors to submit their editing activities for tracking, analysis, and visualization.

[Wakapi](https://github.com/muety/wakapi) is an open-source alternative to the [WakaTime](https://github.com/wakatime) project. It also provides its users with a tracking service for text editing activities and is compatible with most [WakaTime plugins](https://wakatime.com/plugins).

### Settings Introduction

* `General`

  * `Reset Settings Options`

    * Reset all settings options to their default values.
    * After clicking this button, a confirmation dialog will appear.

      * After clicking the confirmation button in the dialog, all options for this plugin will be reset to their default values, and the current interface will be automatically refreshed.
  * `Clean offline cache`

    * Delete all offline cache files
    * Cache file directory: `workspace/temp/.wakatime/cache`
    * After clicking this button, a confirmation dialog box will appear

      * After clicking the confirm button on the dialog box, the cache file directory will be deleted and the current interface will be automatically refreshed.
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
    * `Operating System Name`

      * The name of the operating system where the kernel is located
      * Corresponds to the "Operating Systems" category in WakaTime statistics
    * `Operating System Version`

      * The version number of the current operating system
      * Default is "unknown" to protect privacy
      * Leave empty to use the retrieved version number
    * `Operating System Architecture`

      * The processor architecture of the current operating system
      * Default is "unknown" to protect privacy
      * Leave empty to use the retrieved architecture
    * `User Agent`

      * For more details, please refer to [User-Agent - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent)
      * Leave empty to use the automatically generated field

        * It is highly recommended to leave it empty to automatically generate this field
        * Customizing this field may cause the Wakapi/WakaTime service to be unable to recognize the plugin
      * The agent contains the following information

        * Version number of `wakatime-cli`

          * Not used by this plugin
        * Operating System Name
        * Operating System Version
        * Operating System Architecture
        * Source app version
        * Plugin version
  * `Service Settings`

    * `Test`

      * Test whether using the `Wakapi/WakaTime > Service Settings > API Key` can successfully access the service corresponding to the `Wakapi/WakaTime > Service Settings > API URL`.
    * `API URL`

      * Customize the API service address for `Wakapi/WakaTime`.
      * Corresponds to the `api_url` configuration option in the `.wakatime.cfg` configuration file of `Wakapi/WakaTime`.
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
      * Corresponds to the `api_key` configuration option in the `.wakatime.cfg` configuration file of `Wakapi/WakaTime`.
      * This is a required field, and if not set, a connection cannot be established with `Wakapi/WakaTime`.
    * `Hostname`

      * Customize the device name.
      * Corresponds to the `hostname` configuration option in the `.wakatime.cfg` configuration file of `Wakapi/WakaTime`.
      * If empty, the host name of the device where Obsidian is located will be used.
    * `Timeout`

      * Timeout duration when calling the `Wakapi/WakaTime` API.
      * Corresponds to the `timeout` configuration option in the `.wakatime.cfg` configuration file of `Wakapi/WakaTime`.
      * Unit: seconds
    * `Hide Notebook Name`

      * Whether to hide the notebook name in the submitted action information.
      * Corresponds to the `hide_branch_names` configuration option in the `.wakatime.cfg` configuration file of `Wakapi/WakaTime`.
      * If enabled, all <kbd>Notebook Name</kbd> in the submitted information will be replaced with <kbd>Notebook ID</kbd>.
    * `Hide Document Title`

      * Whether to hide the document title in the submitted activity information.
      * Corresponds to the `hide_file_names` configuration option in the `.wakatime.cfg` configuration file of `Wakapi/WakaTime`.
      * If enabled, all <kbd>Document Title</kbd> in the submitted information will be replaced with <kbd>Block ID</kbd>.
    * `Offline caching`

      * Whether to cache action information in local files
      * Conditions for triggering offline caching

        * Disable `Wakapi/WakaTime > General > Heartbeat Connections`
        * Or unable to access `Wakapi/WakaTime` service
      * Cache file directory: `workspace/temp/.wakatime/cache`
      * Corresponds to the `offline` configuration option in the `.wakatime.cfg` configuration file of `Wakapi/WakaTime`.
    * `ID Include List`

      * Only submit documents whose ID path includes the list field.
      * If empty, it includes all notebooks and documents.
      * If not empty, only submit documents whose ID path includes the list field.

        * ID path format: `notebook/document/.../document.sy`
        * ID path examples:

          * `20210808180117-czj9bvb/20200812220555-lj3enxa.sy`
          * `20210808180117-czj9bvb/20200812220555-lj3enxa/20210808180320-fqgskfj.sy`
      * One record per line, can be text or regular expression. Regular expressions need to be wrapped in `/` as shown below:

        ```plaintext
        20200812220555-lj3enxa
        /^20210917000226-w9fa32i\/20230522022822-roxea7p/
        ```

        The above list is equivalent to the following JavaScript code:

        ```javascript
        path.includes("20200812220555-lj3enxa") && /^20210917000226-w9fa32i\/20230522022822-roxea7p/.test(path)
        ```

        * `20200812220555-lj3enxa`

          * Submit documents that have the ID `20200812220555-lj3enxa`, including itself and its sub-documents.

            * Example:

              * `20210808180117-czj9bvb/20200812220555-lj3enxa.sy`: included
              * `20210808180117-czj9bvb/20200812220555-lj3enxa/20210808180320-fqgskfj.sy`: included
              * `20210808180117-czj9bvb/20210117211155-56n4odu.sy`: not included
        * `/^20210917000226-w9fa32i\/20230522022822-roxea7p/`

          * Submit documents that match the regular expression `^20210917000226-w9fa32i/20230522022822-roxea7p`.

            * Example:

              * `20210917000226-w9fa32i/20230522022822-roxea7p.sy`: included
              * `20210917000226-w9fa32i/20230522022822-roxea7p/20230522022929-ojqqfyn.sy`: included
              * `20210917000226-w9fa32i/20220424113742-2eznev2.sy`: not included
              * `20210808180117-czj9bvb/20210917000226-w9fa32i/20230522022822-roxea7p.sy`: not included
    * `ID Exclude List`

      * Exclude documents whose ID path includes the list field when submitting.
      * If empty, do not exclude any notebooks or documents.
      * If not empty, exclude documents whose ID path includes the list field.

        * ID path format and matching rules can be found in `Wakapi/WakaTime > Service Settings > ID Inclusion List`.
      * One record per line, can be text or regular expression. Regular expressions need to be wrapped in `/`.
      * The exclusion list takes precedence over the inclusion list.

        * If a document's ID path matches both the ID inclusion list and the ID exclusion list, the document will be excluded.
    * `Include List`

      * Only submit documents whose path includes the list field.
      * Corresponds to the `include` configuration option in the `.wakatime.cfg` configuration file of `Wakapi/WakaTime`.
      * If empty, it includes all notebooks and documents.
      * If not empty, only submit documents whose path includes the list field.

        * Path format and examples:

          |                           | `Hide notebook names`: ✔                                                                                         | `Hide notebook names`: ✖<br />                                                                         |
          | ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
          | `Hide document titles`: ✔ | `<Notebook ID>/<Document ID>/.../<Document ID>.sy`<br />`20210808180117-czj9bvb/20200812220555-lj3enxa.sy`<br /> | `<Notebook Name>/<Document ID>/.../<Document ID>.sy`<br />`User Guide/20200812220555-lj3enxa.sy`<br /> |
          | `Hide document titles`: ✖ | `<Notebook ID>/<Document Title>/.../<Document Title>.sy`<br />`20210808180117-czj9bvb/Start Here.sy`             | `<Notebook Name>/<Document Title>/.../<Document Title>.sy`<br />`User Guide/Start Here.sy`<br />       |
      * One record per line, can be text or regular expression. Regular expressions need to be wrapped in `/` as shown below:

        ```plaintext
        Start Here
        /^User Guide\/Start Here/
        ```

        The above list is equivalent to the following JavaScript code:

        ```javascript
        path.includes("Start Here") && /^User Guide\/Start Here/.test(path)
        ```
    * `Exclude List`

      * Exclude documents whose path includes the list field when submitting.
      * Corresponds to the `exclude` configuration option in the `.wakatime.cfg` configuration file of `Wakapi/WakaTime`.
      * If empty, do not exclude any notebooks or documents.
      * If not empty, exclude documents whose path includes the list field.

        * Path format and matching rules can be found in `Wakapi/WakaTime > Service Settings > Inclusion List`.
      * One record per line, can be text or regular expression. Regular expressions need to be wrapped in `/`.
      * The exclusion list takes precedence over the inclusion list.

        * If a document's path matches both the inclusion list and the exclusion list, the document will be excluded.

## CHANGELOG

[CHANGELOG.md](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-wakatime/blob/main/CHANGELOG.md)
