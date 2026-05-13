const LONG_WORD_PATTERN = /[A-Za-z]{12,}/g; // matches runs of 12+ letters; g = find all matches, not just the first
const SOFT_HYPHEN = "\u00AD";               // invisible character that becomes a visible "-"
const SOFT_HYPHEN_INTERVAL = 9;             // how many chars between each break point
const MIN_TRAILING_CHARS = 3;               // minimum chars required after the last break point

function addSoftHyphensToLongWord(word: string) {
  const chunks: string[] = []; // collects pieces of the word to join with soft hyphens
  let start = 0; // current position in the word

  // "is there room for a full 9-char chunk AND at least 3 chars after it?"
  // (interval 9 + min trailing 3) = 12 or more needed chars for add break point
  while (word.length - start >= SOFT_HYPHEN_INTERVAL + MIN_TRAILING_CHARS) {
    chunks.push(word.slice(start, start + SOFT_HYPHEN_INTERVAL)); // grab next 9-char chunk
    start += SOFT_HYPHEN_INTERVAL; // advance position by 9
  }

  // push whatever is left after the last break point
  chunks.push(word.slice(start));

  // join chunks with the invisible break character
  return chunks.join(SOFT_HYPHEN);
}

/**
 * Inserts soft hyphens (\u00AD) into long words so the platform can break them
 * cleanly with a visible "-" instead of an ugly bare cut.
 * 
 * This function is layout-blind - it always inserts the soft hyphens (\u00AD) regardless
 * of screen width. The platform renderer decides at paint time weather to show hyphenation or not based on available space.
 * This means:
 * * word fits on one line, soft hyphen stays invisible.
 * * word doesn't fit; text wraps. platform breaks at the soft hyphen and shows "-" then continues the rest of the word on the next line, and so on.
 *
 * @example
 * addSoftHyphensToLongWords("update npm dependencies")
 * // "dependencies" is 12 letters, gets a break point
 * // => "update npm dependenc\u00ADies"  ( the \u00AD is invisible until the word wraps)
 *
 * @example
 * addSoftHyphensToLongWords("add a new test")
 * // no word is 12+ letters, nothing changes
 */
export function addSoftHyphensToLongWords(text: string) {
  return text.replace(LONG_WORD_PATTERN, addSoftHyphensToLongWord);
}
