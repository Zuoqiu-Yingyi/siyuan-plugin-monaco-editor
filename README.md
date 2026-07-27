> **Git submodule of the [siyuan-packages-monorepo](https://github.com/Zuoqiu-Yingyi/siyuan-packages-monorepo) at [/workspace/plugins/monaco-editor](https://github.com/Zuoqiu-Yingyi/siyuan-packages-monorepo/tree/main/workspace/plugins/monaco-editor)**

<div align="center">
<img alt="icon" src="./public/icon.png" style="width: 8em; height: 8em;">

---
[![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor?include_prereleases&style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor/releases/latest)
[![GitHub Release Date](https://img.shields.io/github/release-date/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor/releases/latest)
[![GitHub License](https://img.shields.io/github/license/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor/blob/main/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor/commits/main)
![GitHub repo size](https://img.shields.io/github/repo-size/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor?style=flat-square)
![GitHub code size](https://img.shields.io/github/languages/code-size/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor.svg?style=flat-square)
![hits](https://hits.b3log.org/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor.svg)
[![GitHub all releases](https://img.shields.io/github/downloads/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor/total?style=flat-square)](https://github.com/Zuoqiu-Yingyi/siyuan-plugin-monaco-editor/releases)
---

</div>

## USER GUIDE

[简体中文](./public/README_zh_CN.md) \| [English](./public/README.md)

## DEVELOPER GUIDE

### RELEASE STEPS

1. Update the version number in `<subrepo-root-dir>/package.json` and `<subrepo-root-dir>/public/plugin.json`, then commit the changes in this sub-repository on the `dev` branch.
2. Push the `dev` branch to `origin`.
   ```bash
   git push origin dev
   ```
3. Update the submodule pointer in [monorepo](https://github.com/Zuoqiu-Yingyi/siyuan-packages-monorepo) to this sub-repository commit, then commit the pointer change in monorepo.
   ```bash
   cd <monorepo-root-dir>
   git add workspace/plugins/monaco-editor
   git commit -m "chore(submodule): update monaco-editor"
   ```
4. Create a pull request from `dev` branch to `main` branch in sub-repository.
5. Merge the pull request.
6. Await for the CD workflow `release-please.yml` to complete, it will create a _release pull request_ in sub-repository.
7. Merge the _release pull request_, it will create a new _pre-release_ with current [changelog](./CHANGELOG.md) and a new _tag_ with [semantic version](https://semver.org/) in sub-repository.
8. Await for the CD workflow `build.yml` to complete, it will update the distribution files to `publish` branch in sub-repository.
9. Await for the CD workflow `release-distribution.yml` to complete, it will create a new _pre-release_ with an asset named `package.zip` and a new _tag_ with timestamp in sub-repository.

## CHANGELOG

[CHANGE LOG](./CHANGELOG.md)
