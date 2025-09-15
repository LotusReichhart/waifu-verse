export function isEmpty(text) {
    return !text || text.trim() === '';
}

export function isTooLong(text, maxLength = 60) {
    return text.trim().length > maxLength;
}

export function isTooShort(text, minLength = 2) {
    return text.trim().length < minLength;
}

export function isLink(text) {
    return /https?:\/\/|www\./i.test(text.trim());
}

export function isCode(text) {
    const trimmed = text.trim();

    if (/[<>]/.test(trimmed) || /<script\b[^>]*>.*?<\/script>/i.test(trimmed)) {
        return true;
    }

    const jsPattern = /\b(if|else|function|while|for|return|var|let|const|=>|true|false|null|undefined)\b/;
    if (jsPattern.test(trimmed)) {
        return true;
    }

    const codeChars = /[{}();=\[\]]/;
    if (codeChars.test(trimmed)) {
        return true;
    }

    const sqlPattern = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|FROM|WHERE|TABLE|VALUES)\b/i;
    return sqlPattern.test(trimmed);
}


export function isNumeric(text) {
    return /^\d+$/.test(text.trim());
}

export function isEmail(text) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim());
}
