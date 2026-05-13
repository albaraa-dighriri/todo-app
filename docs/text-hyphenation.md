# Task Title Hyphenation

When a task title contains a long word that doesn't fit in its card, the platform
breaks it at a random character with no hyphen:

```
update npm dependenci
es
```

The fix makes it break cleanly with a visible `-`:

```
update npm dependenc-
ies
```

---

## Why it happens

When a long word is wider than the card it lives in, the platform has no choice
but to break it mid-word. Without a break opportunity in the string, it cuts at
a random character and shows no hyphen.

---

## The fix

The fix has three layers:

### Layer 1 — Stable box

The `Text` component can only wrap correctly if every parent in the layout chain
accepts the grid cell's width instead of expanding to fit the long word.

- `taskContent` uses `flex: 1` so it claims the remaining row width after the
  checkbox, instead of being sized by its content.
- `minWidth: 0` on `container`, `taskContent`, and `title` prevents any box from
  using the word's intrinsic width as a minimum width floor.
- `flexShrink: 1` on `title` allows the text to accept the narrow width provided
  by its parent instead of pushing outward.

### Layer 2 — Android native hyphenation

Android has a built-in hyphenator. Two props on the title `Text` activate it:

```tsx
<Text android_hyphenationFrequency="full" textBreakStrategy="balanced">
```

`android_hyphenationFrequency="full"` tells Android to hyphenate whenever a word
doesn't fit. It picks the best linguistic break point and renders a real `-`.
No JS needed.

### Layer 3 — iOS soft hyphens via JS

React Native does not expose iOS's native hyphenation API as a prop, so we insert
break opportunities manually using the soft hyphen character (`\u00AD`).

The JS utility in `src/utils/text.ts` scans for words with 12+ letters and places a `\u00AD` break point after every 9 characters, leaving at least 3 characters of the word after each `\u00AD`.

`\u00AD` has a contract baked into every text renderer:

- **Word fits on the line** -> `\u00AD` stays invisible, nothing is shown.
- **Word does not fit and wraps** -> `\u00AD` becomes a visible `-` at the break point.

This runs on iOS only. Android already handles it natively from Layer 2.

---

## How the JS utility works — step by step
`addSoftHyphensToLongWords` runs when a word has 12 or more characters. It scans the full string and calls `addSoftHyphensToLongWord` on each matching word.

### Example A — word gets a break point inserted

Input: `"update npm dependencies"`

The regex `/[A-Za-z]{12,}/g` scans each word:

```
"update"       ->  6 chars  ->  no match, skipped
"npm"          ->  3 chars  ->  no match, skipped
"dependencies" -> 12 chars  ->  match, addSoftHyphensToLongWord is called
```

Tracing `addSoftHyphensToLongWord("dependencies")` (length 12):

```
start=0, chunks=[]

loop check: 12 - 0 = 12  >=  9 + 3 = 12  ->  true
  push slice(0, 9)  ->  "dependenc"
  start = 9

loop check: 12 - 9 = 3  >=  12  ->  false, exit

push slice(9)  ->  "ies"
chunks = ["dependenc", "ies"]

join with \u00AD  ->  "dependenc\u00ADies"
```

Output: `"update npm dependenc\u00ADies"`

The `\u00AD` is always present in the string.  
The platform decides how to render it at layout time.

| Scenario | Rendered output |
|---|---|
| Word fits on the line | `dependencies` |
| Word doesn't fit; text wraps at `\u00AD` and displays `-` | `dependenc-`<br>`ies` |

### Example B — nothing changes

Input: `"add a new test"`

```
"add"  ->  3 chars  ->  no match
"a"    ->  1 char   ->  no match
"new"  ->  3 chars  ->  no match
"test" ->  4 chars  ->  no match
```

No matches. `.replace()` returns the original string unchanged.

Output: `"add a new test"`

---

## The key insight

The JS utility is **layout-blind** — it doesn't know about screen
width. It just plants invisible break opportunities. The platform's text renderer
decides whether to use them based on the actual available width at paint time.

That is why the same string produces different results in different card widths —
the string is identical, only the box width changes.
