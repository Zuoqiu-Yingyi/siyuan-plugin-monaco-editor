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

export function span(text: string, className: string, tag: string = "span"): string {
    return `<${tag} class="${className}">${text}</${tag}>`;
}

export function fn__code(text: string): string {
    return span(text, "fn__code", "code");
}

export function ft__breakword(text: string): string {
    return span(text, "ft__breakword");
}

export function ft__smaller(text: string): string {
    return span(text, "ft__smaller");
}

export function ft__center(text: string): string {
    return span(text, "ft__center");
}

export function ft__on_background(text: string): string {
    return span(text, "ft__on-background");
}

export function ft__on_surface(text: string): string {
    return span(text, "ft__on-surface");
}

export function ft__pink(text: string): string {
    return span(text, "ft__pink");
}

export function ft__error(text: string): string {
    return span(text, "ft__error");
}

export function ft__primary(text: string): string {
    return span(text, "ft__primary");
}

export function ft__secondary(text: string): string {
    return span(text, "ft__secondary");
}
