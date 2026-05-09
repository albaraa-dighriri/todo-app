# Fixing Ugly Word Splits in Task Cards

> A walkthrough of how the task list went from this…
>
> ```
> update npm dependenci
> es
> ```
>
> …to this:
>
> ```
> update npm dependenc-
> ies
> ```

This document explains what was actually broken, what React Native does internally when it lays out text, and how the final fix works on both iOS and Android. It is written for programmers, but starts from first principles — no prior layout-engine knowledge required.

---

## Table of contents

1. [The symptom](#1-the-symptom)
2. [Mental model: how RN renders text](#2-mental-model-how-rn-renders-text)
3. [Why the word was being chopped](#3-why-the-word-was-being-chopped)
4. [Why iOS and Android disagree](#4-why-ios-and-android-disagree)
5. [The fix, in three layers](#5-the-fix-in-three-layers)
6. [Layer 1 — Layout (Yoga / flexbox)](#6-layer-1--layout-yoga--flexbox)
7. [Layer 2 — Android native hyphenation](#7-layer-2--android-native-hyphenation)
8. [Layer 3 — iOS soft hyphens via JS](#8-layer-3--ios-soft-hyphens-via-js)
9. [Tracing one render, end-to-end](#9-tracing-one-render-end-to-end)
10. [Tradeoffs and known limitations](#10-tradeoffs-and-known-limitations)
11. [How to verify](#11-how-to-verify)

---

## 1. The symptom

The tasks screen renders `Sortable.Grid` with two columns. Each cell holds a `TaskCard`, which contains a checkbox, a title `Text`, and two action buttons.

When a title contained a long word that did not fit in the available width — for example `"update npm dependencies"` — the renderer broke the word at an arbitrary character with **no hyphen**:

```
update npm dependenci
es
```

This is not a styling bug per se. It is the engine's last-resort behavior when a single unbroken word is wider than the box that holds it. The visual result is ugly because nothing tells the reader that `dependenci` and `es` are halves of one word.

The goal: have the engine render a real `-` at the break point, in the right place, on **both platforms**.

---

## 2. Mental model: how RN renders text

Before reading the fix, it helps to have a clear picture of the rendering pipeline.

### 2.1 Two engines, not one

React Native does **not** ship its own text layout engine. It hands strings off to the platform:

| Platform | Layout engine                           | Hyphenation engine |
|----------|------------------------------------------|--------------------|
| iOS      | `CoreText` / `TextKit`                   | `CoreText` (`NSParagraphStyle.hyphenationFactor`) |
| Android  | `android.text.Layout` / `StaticLayout`  | `android.text.Hyphenator` |

Each engine has its own rules, its own dictionary files, and its own opinions about where words "should" break.

### 2.2 The layout pipeline

For every `<Text>` you write, this roughly happens:

1. **Yoga (flexbox)** receives constraints from the parent layout. The important constraint here is the maximum width the title is allowed to use.
2. Yoga asks the native text system how large the text wants to be inside that width.
3. The native text system builds lines using available break opportunities: spaces, newlines, punctuation rules, soft hyphens, and platform hyphenation settings.
4. The text system tries to fit as much text as it can on each line without crossing the measured width.
5. If one long word has no acceptable break point and is still wider than the line by itself, the platform may use an emergency character-level break so the text does not overflow outside its box.

That emergency break is the ugly case. It is not random, but it can look random because the platform is simply cutting at the last character that fits the measured width. Without a real hyphenation opportunity, it has no reason to draw `-`.

### 2.3 Why this is normally fine

For most text, normal word wrapping is enough. The emergency fallback only triggers for an unbroken run of characters that is longer than its containing box. In a wide 1-column card, that is rare. In a narrow 2-column card on a phone, it happens much more easily.

---

## 3. Why the word was being chopped

Let's quantify it for this app. Roughly, on a 390 pt iPhone with `paddingHorizontal: 16` around the grid:

**With 1 column:**

```
Screen width                    ≈ 390 pt
- Horizontal padding (16 each)  =  32 pt
                                 ─────
Card width                      ≈ 358 pt

Inside one card:
- Card horizontal padding       =  32 pt
- Checkbox                      =  24 pt
- Gap between checkbox and text =  16 pt
                                 ─────
Width left for title text       ≈ 286 pt
```

That is plenty of room for a word like `dependencies`, so the title displays normally.

**With 2 columns:**

```
Screen width                    ≈ 390 pt
- Horizontal padding (16 each)  =  32 pt
- Column gap                    =  16 pt
                                 ─────
Width remaining for 2 columns   = 342 pt
Each column                     ≈ 171 pt

Inside one card:
- Card horizontal padding       =  32 pt
- Checkbox                      =  24 pt
- Gap between checkbox and text =  16 pt
                                 ─────
Width left for title text       ≈  99 pt
```

The exact text width depends on the platform font, but at `fontSize: 18`, the word **`dependencies`** can be wider than that ~99 pt title area. So the engine takes the path it has to take:

> "I cannot fit `dependencies` on a line, even alone. Falling back to character break."

It cuts at whatever character makes the prefix fit and dumps the rest onto the next line. Depending on the platform font and exact card width, that might look like:

```
dependenci
es
```

There is no hyphen because no hyphen was ever in the source string and the platform was not asked to insert one.

That is the bug, in one sentence: **a single unbroken word did not fit and we never gave the engine a clean break point.**

---

## 4. Why iOS and Android disagree

Once you decide to fix this, you immediately hit the asymmetry from §2.1.

### 4.1 Android — easy mode

`android.text.Hyphenator` is a Knuth–Liang implementation that ships with the OS. Android exposes it to React Native through a `Text` prop:

```tsx
<Text android_hyphenationFrequency="full">…</Text>
```

When set to `"full"`, the engine will:

- Look up each word in the locale's hyphenation patterns.
- If the word doesn't fit, break it at the *best linguistic* split point.
- Render a real `-` at the break.

It works out of the box. No JS required.

### 4.2 iOS — no equivalent prop

`CoreText` *can* hyphenate — internally it has `NSParagraphStyle.hyphenationFactor`. But **React Native does not surface that property as a `Text` prop**. There is `lineBreakStrategyIOS`, but that prop only changes the *strategy for choosing where to break between existing break opportunities* (e.g. preferring breaks near punctuation). It cannot synthesize a hyphen inside a word.

So the iOS reality is:

> The platform supports hyphenation, but RN gives us no switch to enable it.

The workaround is to **insert the break opportunities ourselves**, in JavaScript, before the string ever reaches the native side.

### 4.3 The tool we use: the soft hyphen `­`

`U+00AD SOFT HYPHEN` is a special Unicode character with a contract:

- If the word fits on one line → it is **invisible**.
- If the word wraps **at that exact position** → it is rendered as a visible `-`.

Both `CoreText` and modern Android engines respect it. So if we sprinkle `­` into long words at sensible positions, the platforms will use those as preferred break points and draw the hyphen for us.

This is the trick that makes iOS work.

---

## 5. The fix, in three layers

The final solution is layered. Each layer fixes a different aspect of the problem:

```
┌──────────────────────────────────────────────────────────┐
│ Layer 3 — String preprocessing (iOS only)                │
│   Inject ­ into long words                          │
├──────────────────────────────────────────────────────────┤
│ Layer 2 — Native Text props                              │
│   android_hyphenationFrequency / textBreakStrategy /     │
│   lineBreakStrategyIOS                                   │
├──────────────────────────────────────────────────────────┤
│ Layer 1 — Box layout (Yoga / flexbox)                    │
│   Give Text a stable, bounded width to wrap into         │
└──────────────────────────────────────────────────────────┘
```

If any layer is missing, you get a regression:

| Missing layer | Symptom |
|---------------|---------|
| Layer 1 | Text may be measured without a clear bounded width, which can cause overflow or hard-to-predict wrapping in narrow cards. |
| Layer 2 | Android still wraps without hyphens (ugly cut). |
| Layer 3 | iOS still wraps without hyphens (ugly cut). |

Now we go through them.

---

## 6. Layer 1 — Layout (Yoga / flexbox)

React Native's flexbox is implemented by **Yoga**. It mostly behaves like web CSS flexbox, with a few important differences. The layout changes inside `TaskCard` are about making the width chain explicit:

```
Sortable.Grid cell
  → TaskCard container
    → taskContent
      → title Text
```

The `Text` can only wrap correctly if every parent in that chain accepts the grid cell's width instead of trying to size itself from the long word.

### 6.1 Before vs after

```diff
  container: {
      flex: 1,
      flexDirection: 'row',
+     minWidth: 0,
      paddingHorizontal: 16,
      gap: 16,
  },

  taskContent: {
-     flexShrink: 1,
+     flex: 1,
+     minWidth: 0,
      gap: 24,
  },

  title: {
-     flex: 1,
+     flexShrink: 1,
+     minWidth: 0,
      color: 'white',
      fontSize: 18,
      fontWeight: '500',
+     lineHeight: 24,
  },
```

There are four ideas here:

1. The card container is allowed to fit inside the grid cell.
2. `taskContent` takes the remaining row width after the checkbox and gap.
3. The `Text` is no longer used as a vertical flex spacer.
4. `minWidth: 0` removes any minimum-width floor that could make a long word push outward.

### 6.2 `taskContent`: from `flexShrink: 1` → `flex: 1`

The card's outer `View` has `flexDirection: 'row'`. Its row has three slots:

```
[ checkbox 24 ][ gap 16 ][      taskContent       ]
```

`taskContent` decides how much horizontal room is given to the text region.

React Native's `flex` is a numeric Yoga shorthand, not the exact same string shorthand as CSS. For this component, the practical rule is:

- In a **row**, `flex: 1` affects width.
- In a **column**, `flex: 1` affects height.
- If only one child in a row has `flex: 1`, that child receives the remaining width after fixed-size siblings, padding, and gaps are accounted for.

Before, `taskContent` only had `flexShrink: 1`. That means it was allowed to become smaller if the row ran out of room, but it did not actively claim the available row width. Its starting size could be influenced by its content, including the title text.

After, `taskContent` has `flex: 1`. In this row:

```
[ checkbox 24 ][ gap 16 ][ taskContent flex: 1 ]
```

Yoga can compute the text region directly:

```
taskContent width = card inner width - checkbox width - gap
```

So in a 2-column card, `taskContent` receives about 99 pt. The `Text` is then measured inside that 99 pt box. The width is narrow, but it is predictable.

### 6.3 `title`: from `flex: 1` → `flexShrink: 1`

`taskContent` is a column-direction container (default `flexDirection: 'column'`). Its children stack vertically: `Text` on top, action buttons below.

- **`flex: 1`** (old) on the `Text` was solving the wrong axis. Because `taskContent` is a column, `flex: 1` asks the title to participate in vertical space distribution. It does not give the title a better horizontal wrapping width.
- **`flexShrink: 1`** (new) is a smaller, more accurate request: the title should use the width provided by `taskContent`, wrap as needed, and not force its parent to grow.

This change is mostly about removing misleading layout intent. The title's horizontal width should come from its parent column, not from `flex: 1` on the `Text` itself.

### 6.4 `minWidth: 0`

`minWidth: 0` means:

> "This item is allowed to become as narrow as its parent layout requires."

That sounds obvious, but it matters in nested flex layouts with text. A long unbroken word has a large intrinsic width. If any box in the chain treats that intrinsic width as a minimum width, the child can push against the parent instead of wrapping inside it.

The fix puts `minWidth: 0` on the boxes that participate in the horizontal width chain:

```tsx
container: {
    flex: 1,
    flexDirection: 'row',
    minWidth: 0,
},

taskContent: {
    flex: 1,
    minWidth: 0,
},

title: {
    flexShrink: 1,
    minWidth: 0,
}
```

In native React Native, Yoga does not have the same `min-width: auto` default that web flexbox has, so `minWidth: 0` may be partly defensive. It is still useful here because it makes the intended rule explicit:

```
The grid cell controls the width.
The card must fit the cell.
taskContent must fit the card.
Text must wrap inside taskContent.
```

It also keeps the code safer if this screen ever runs through `react-native-web`, where `min-width: 0` is often essential for text inside flex rows.

### 6.5 `lineHeight: 24`

Previously the title had no explicit `lineHeight`, so each line's height was derived from the font's intrinsic metrics — and that derivation can vary slightly between platforms, fonts, and even individual glyphs. Once the line wraps (and therefore renders a soft hyphen on iOS), inconsistent line heights become visible: lines may look unevenly spaced.

Setting `lineHeight: 24` (with `fontSize: 18`) locks the vertical rhythm. Every wrapped line is exactly 24 pt tall regardless of which characters it contains.

---

## 7. Layer 2 — Android native hyphenation

Two Android-specific props are set on the title `Text`:

```tsx
<Text
  android_hyphenationFrequency="full"
  textBreakStrategy="balanced"
  …
>
```

### 7.1 `android_hyphenationFrequency="full"`

This activates Android's hyphenator. Possible values:

| Value     | Effect                                                                 |
|-----------|------------------------------------------------------------------------|
| `none`    | Never hyphenate.                                                       |
| `normal`  | Hyphenate only when needed to avoid an obviously bad break.            |
| `full`    | Aggressively hyphenate whenever it improves line fit.                  |

For narrow cards we want `full`, because *every* line that contains a long word benefits from hyphenation.

### 7.2 `textBreakStrategy="balanced"`

This selects how Android distributes words across the available lines.

| Value         | Effect |
|---------------|--------|
| `simple`      | Greedy: pack each line until it overflows, then wrap. |
| `highQuality` | Higher-quality line breaking that tries to reduce awkward ragged lines. |
| `balanced`    | Balances line lengths for short text blocks such as titles. |

A task title is rarely more than 2–3 lines, so `balanced` is the right default. It produces a more pleasing distribution than `simple` without the cost of `highQuality`.

### 7.3 `lineBreakStrategyIOS="standard"`

This is set for completeness on iOS, even though it is **not** what fixes the hyphen. It improves break-point selection — for example preferring breaks after a period rather than mid-word — once the soft hyphens of Layer 3 have given the engine break candidates to choose from. Treat it as a polish, not a fix.

---

## 8. Layer 3 — iOS soft hyphens via JS

This is the iOS-specific compensating layer.

### 8.1 The wrapper in `TaskCard`

```tsx
function formatTaskTitleForDisplay(title: string) {
    if (Platform.OS !== 'ios') {
        return title;
    }

    // iOS does not reliably expose automatic visible hyphenation through Text props.
    return addSoftHyphensToLongWords(title);
}
```

Two things to note:

1. **It is gated on iOS.** Android already has its native hyphenator handling this from Layer 2. Running the JS pass on Android would be wasted work, and (worse) could conflict with the native hyphenator's own choice of break points.
2. **It returns the original string when not on iOS.** Same input, same output — no allocations beyond the `Platform.OS` check.

### 8.2 The utility — `src/utils/text.ts`

```ts
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
```

### 8.3 What the constants mean

| Constant                 | Value | Why this number |
|--------------------------|-------|------------------|
| `LONG_WORD_PATTERN`      | `/[A-Za-z]{12,}/g` | Words shorter than 12 letters almost always fit at typical card widths. Skipping them avoids inserting noise into normal English. |
| `SOFT_HYPHEN`            | `\u00AD` | An invisible Unicode character that becomes a visible `-` only if the platform wraps at that position. |
| `SOFT_HYPHEN_INTERVAL`   | `9`   | A break candidate every 9 characters means each wrapped line carries a meaningful chunk of the word, but no chunk is so long it overflows by itself. |
| `MIN_TRAILING_CHARS`     | `3`   | The loop only inserts a soft hyphen when at least 3 characters will remain after the break. That avoids endings like `a` or `es` being forced into their own tiny fragment by our heuristic. |

This is **not** a real linguistic hyphenator. It does not know about syllables, prefixes, or doubled consonants. It is a deterministic heuristic that produces *acceptable* breakpoints with zero dependencies and linear work per word. For a task list of user-typed strings, that tradeoff is worth it.

### 8.4 Walking through `dependencies`

Input: `"dependencies"` (12 letters → matches `LONG_WORD_PATTERN`).

Initial state: `start = 0`, length `= 12`.

Iteration 1:
- `word.length - start = 12`
- `SOFT_HYPHEN_INTERVAL + MIN_TRAILING_CHARS = 9 + 3 = 12`
- `12 >= 12` → enter loop.
- Push `word.slice(0, 9)` = `"dependenc"`.
- `start` becomes `9`.

Iteration 2:
- `word.length - start = 3`
- `3 >= 12` → false. Exit loop.

After loop:
- Push `word.slice(9)` = `"ies"`.

Join with `­`:

```
"dependenc" + "­" + "ies"  →  "dependenc­ies"
```

When rendered:

- If the title fits on one line, you see `dependencies` (the `­` is invisible).
- If the title needs to wrap *exactly at that point*, you see:
  ```
  dependenc-
  ies
  ```

That is the visual goal from the original report.

If you see a slightly different split such as:

```
dependenci-
es
```

the same principle is still happening: the platform found or received a break opportunity near the end of the word and rendered a visible hyphen at the line break. The exact character can differ between the iOS soft-hyphen heuristic and Android's native dictionary-based hyphenator.

### 8.5 What about words longer than 12?

Take `internationalization` (20 letters). Trace:

- Iteration 1: push `word.slice(0, 9)` = `"internati"`. Then `start = 9`. Remaining = 11.
- Iteration 2: `11 >= 12`? No. Exit.
- Push `word.slice(9)` = `"onalization"`.
- Result: `"internati­onalization"`.

So this word gets one break point. A more aggressive algorithm could insert two, but a single mid-word break is usually enough for typical card widths and avoids breaking the same word twice in one wrap.

For a much longer word, the loop can insert more than one soft hyphen. The rule stays the same: add a candidate every 9 characters, but only when at least 3 characters remain after that candidate.

---

## 9. Tracing one render, end-to-end

Let's run the system mentally with `task.title = "update npm dependencies"` on iOS, in a 2-column grid.

### Step 1 — Component renders

```tsx
const displayTitle = formatTaskTitleForDisplay(task.title);
// Platform.OS === 'ios' → addSoftHyphensToLongWords runs
// "update" (6) and "npm" (3) skip the regex (under 12 letters)
// "dependencies" (12) matches → "dependenc­ies"
// Final string: "update npm dependenc­ies"
```

### Step 2 — Yoga lays out the box

```
Cell width                    = 171 pt
container (flex: 1, row)      = 171 pt
  checkbox                    =  24 pt
  gap                         =  16 pt
  taskContent (flex: 1, col)  =  99 pt   ← all remaining horizontal space
    Text (flexShrink: 1)      =  99 pt   ← inherits column width
    actionsContainer          = (laid out below the Text)
```

The `Text` enters CoreText with a 99 pt content box and the string `"update npm dependenc­ies"`.

### Step 3 — CoreText breaks the line

CoreText receives normal spaces plus one optional soft-hyphen break point:

```
update | npm | dependenc | ies
       ^space  ^space    ^­
```

Conceptually, it chooses line breaks like this:

1. `update` → fits. Place.
2. `update npm` → fits. Place.
3. Adding the whole `dependencies` word would be too wide for the 99 pt line.
4. The word itself is also too wide to fit cleanly as one unbroken piece.
5. Instead of using an emergency character break, CoreText can use the soft hyphen between `dependenc` and `ies`.
6. When it breaks at that soft hyphen, the soft hyphen becomes a visible `-`.

Result:

```
update npm
dependenc-
ies
```

Or if the cell happens to be slightly wider:

```
update npm dependenc-
ies
```

Both are acceptable.

### Step 4 — Yoga computes the height

The `Text` reports its height: 3 lines × 24 pt = 72 pt (using our `lineHeight: 24`). `taskContent` stacks the `Text` and `actionsContainer` vertically with `gap: 24`. The card grows to fit. The grid recomputes the row height.

### Step 5 — On Android

On Android, `formatTaskTitleForDisplay` returns the original string unchanged. Layer 2 does the work: `android.text.Hyphenator` consults its locale's hyphenation patterns and decides where to break `dependencies` (likely `de‧pend‧en‧cies` in standard English). It picks whichever breakpoint best fits the line and renders the `-` itself.

Both platforms now produce a visually similar result through completely different mechanisms.

---

## 10. Tradeoffs and known limitations

This solution is pragmatic, not perfect.

### 10.1 The iOS heuristic is not linguistic

`addSoftHyphensToLongWords` breaks at fixed character intervals, not syllables. For `dependencies` it happens to land near a syllable boundary by luck. For `chrysanthemum` (13 letters) it would produce `chrysanthe­mum` — visually fine but linguistically not where a typesetter would split.

For a task list with user-typed text, "visually fine" is the bar. If you ever need real linguistic hyphenation on iOS, swap the utility for the [`hyphen`](https://www.npmjs.com/package/hyphen) package and apply Knuth–Liang patterns. The interface stays the same; only the implementation changes.

### 10.2 Mixed-locale text

The Android hyphenator uses the device locale to pick its dictionary. A Spanish title rendered on a German phone would be hyphenated by German rules. This is acceptable but worth knowing.

The JS utility is locale-agnostic — it does not care what language the text is in. That is both its weakness (no locale awareness) and its strength (works for any input, including made-up words and identifiers like `useEffectCallback`).

### 10.3 Numbers and identifiers

`LONG_WORD_PATTERN` matches `[A-Za-z]{12,}` only. Numbers, hyphens (real ones), and underscores break the pattern. So `task-12345-priority` won't be processed because no individual run of letters is ≥ 12. This is usually correct: such strings shouldn't be hyphenated.

### 10.4 The soft hyphen leaves the input string

After preprocessing, the rendered string contains `­` characters. If you copy the title from the screen via accessibility or selection on a future feature, you could end up with soft hyphens in the clipboard. They are invisible but they *are* characters. Be aware if you ever build "copy task title" functionality — strip `­` first.

### 10.5 Web compatibility

If this app ever runs on `react-native-web`:

- Android props (`android_hyphenationFrequency`, `textBreakStrategy`) are no-ops.
- `lineBreakStrategyIOS` is a no-op.
- The soft hyphen still works (browsers have respected `­` for decades).
- A web-only addition would be `style: { hyphens: 'auto' }` on the title.

The platform-gated `formatTaskTitleForDisplay` would need an extra branch for `'web'` if you want consistent behavior there.

---

## 11. How to verify

A few quick checks you can run on a real device or simulator:

1. **Soft hyphens are not visible when not needed.**
   Add a task with title `dependencies` on a 1-column layout. On iOS the rendered text should still read `dependencies` with no visible hyphens. If you see one, the layout is wrapping at the soft hyphen unexpectedly.

2. **They appear when needed.**
   Add a task with title `update npm dependencies` on a 2-column layout. On both iOS and Android, you should see a `-` at the wrap point. The exact split position may differ between platforms (iOS uses the JS heuristic; Android uses its dictionary) — that is expected.

3. **Short words are unaffected.**
   Title `add tests`. The output should be byte-identical to the input on iOS — no `­` insertions because no word matches `[A-Za-z]{12,}`.

4. **Layout does not jump as content changes.**
   Edit a task to make its title longer or shorter. The card width should be stable; only its height should change. If width oscillates, Layer 1 is broken — check that `taskContent` still has `flex: 1`.

5. **Inspect the rendered string in JS.**
   Add a temporary `console.log(JSON.stringify(displayTitle))` inside `TaskCard`. On iOS you should see `­` characters embedded in long words; on Android you should see the original string verbatim.

---

## Summary

- The original break (`dependenci\nes` with no hyphen) was the engine's last-resort character-level fallback, triggered when a single word did not fit in its layout box.
- The fix has three layers: **stable box (Yoga)**, **native props (Android)**, **soft hyphens in JS (iOS)**.
- Each layer is necessary; removing any one re-introduces a regression on at least one platform.
- The iOS heuristic is intentionally simple — fixed-interval soft hyphens — because the visual bar for a task list does not justify a full linguistic hyphenator. If that bar ever rises, the utility can be swapped without changing anything else.

The end result is a card grid that wraps long words *gracefully*, with a real `-`, on both platforms.
