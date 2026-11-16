/** Join class names, dropping falsy entries. */
export const cx = (...parts: Array<string | undefined | false>): string =>
    parts.filter(Boolean).join(' ');
