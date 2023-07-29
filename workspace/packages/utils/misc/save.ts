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

import { saveAs } from "file-saver";

export function saveFileAs(options: {
    data: BlobPart,
    filename?: string,
    filetype?: string,
    lastModified?: number,
}): File | Blob {
    if (options.filename) {
        const file = new File(
            [options.data],
            options.filename,
            {
                type: options.filetype,
                lastModified: options.lastModified,
            },
        );
        saveAs(file, file.name);
        return file;
    }
    else {
        switch (true) {
            case options.data instanceof File: {
                const file = options.data as File;
                saveAs(file, file.name);
                return file;
            }
            case options.data instanceof Blob: {
                const blob = options.data as Blob;
                saveAs(blob);
                return blob;
            }
            default: {
                const blob = new Blob(
                    [options.data],
                    {
                        type: options.filetype,
                    },
                );
                saveAs(blob);
                return blob;
            }
        }
    }
}
