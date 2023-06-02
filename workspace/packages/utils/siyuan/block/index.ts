/**
 * Copyright (C) 2023 Zuoqiu Yingyi
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export enum BlockType {
    /* 容器块 */
    NodeDocument = "NodeDocument", // 文档块

    NodeBlockquote = "NodeBlockquote", // 引述
    NodeList = "NodeList", // 列表块
    NodeListItem = "NodeListItem", // 列表项
    NodeSuperBlock = "NodeSuperBlock", // 超级块

    /* 叶子块 */
    NodeAudio = "NodeAudio", // 音频块
    NodeBlockQueryEmbed = "NodeBlockQueryEmbed", // 嵌入块
    NodeCodeBlock = "NodeCodeBlock", // 代码块
    NodeHTMLBlock = "NodeHTMLBlock", // HTML 块
    NodeHeading = "NodeHeading", // 标题块
    NodeIFrame = "NodeIFrame", // iframe 块
    NodeMathBlock = "NodeMathBlock", // 公式块
    NodeParagraph = "NodeParagraph", // 段落块
    NodeTable = "NodeTable", // 表格块
    NodeThematicBreak = "NodeThematicBreak", // 分割线
    NodeVideo = "NodeVideo", // 视频块
    NodeWidget = "NodeWidget", // 挂件块
}
