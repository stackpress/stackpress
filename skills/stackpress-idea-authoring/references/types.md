# Built-In Types

Use this reference for the built-in Stackpress type families that carry default
semantic meaning.

## Core Rule

These are not just parser-recognized names. Stackpress maps them into base
assertion behavior and generated schema meaning.

## Types

- `String`: free-form short text
- `Text`: longer text content
- `Number`: generic numeric value
- `Integer`: whole-number numeric value
- `Float`: decimal numeric value
- `Boolean`: true or false value
- `Date`: date-like value
- `Datetime`: date plus time value
- `Time`: time-only value
- `Object`: structured object value
- `Hash`: object-like keyed data
- `Json`: JSON-like object value

## Type Notes

- `String` and `Text` both map to string-oriented assertion behavior.
- `Integer` and `Float` are more specific numeric families than `Number`.
- `Date`, `Datetime`, and `Time` all map to date-oriented base validation.
- `Object`, `Hash`, and `Json` all map to object-oriented base validation, but
  they still express different authoring intent.

## Canonical Use

- use `String` for short scalar values such as names, slugs, tokens, or labels
- use `Text` for longform text or body content
- use `Integer` and `Float` when the numeric shape matters
- use `Hash` or `Json` for flexible object-like data
- use `Date` or `Datetime` when generated date behavior matters downstream
