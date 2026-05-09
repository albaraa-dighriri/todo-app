const LONG_WORD_PATTERN = /[A-Za-z]{12,}/g;
const SOFT_HYPHEN = '\u00AD';
const SOFT_HYPHEN_INTERVAL = 9;
const MIN_TRAILING_CHARS = 3;

function addSoftHyphensToLongWord(word: string) {
    const chunks: string[] = [];
    let start = 0;

    while (word.length - start >= SOFT_HYPHEN_INTERVAL + MIN_TRAILING_CHARS) {
        chunks.push(word.slice(start, start + SOFT_HYPHEN_INTERVAL));
        start += SOFT_HYPHEN_INTERVAL;
    }

    // Leave the remaining tail unbroken so short endings do not wrap alone.
    chunks.push(word.slice(start));

    return chunks.join(SOFT_HYPHEN);
}

/**
 * Adds optional break points inside long words without changing how they look
 * when they fit on one line.
 *
 * A soft hyphen (\u00AD) stays invisible until the platform wraps text at that
 * position, then it renders as a visible "-". This helps narrow cards wrap long
 * task titles cleanly instead of splitting words at arbitrary characters.
 */
export function addSoftHyphensToLongWords(text: string) {
    return text.replace(LONG_WORD_PATTERN, addSoftHyphensToLongWord);
}
