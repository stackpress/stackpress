# Stackpress UnoCSS Guidance

Use this reference when styling handwritten Stackpress views under
`plugins/*/views`.

## Primary Rule

Treat the effective Stackpress UnoCSS setup as the styling source of truth for
the app you are editing.

Before making styling decisions:

1. inspect nearby view files for the established utility-class idiom
2. preserve the local styling pattern unless the user explicitly wants a new
   direction
3. assume Stackpress may support more than raw Uno defaults when utility
   classes appear unfamiliar

Do not assume that all Stackpress apps share the exact same UnoCSS setup, but
also do not assume the app only supports raw Uno defaults.

## Stackpress Rule

In Stackpress projects, UnoCSS is often the expected utility styling system for
handwritten views.

That means:

- prefer utility classes that fit the existing app pattern
- avoid introducing a second styling system when UnoCSS is already the local
  convention
- do not treat utility styling as generic React styling detached from the app's
  view shell and layout patterns

## Supported Class Families

In addition to Tailwind-like utility classes supported by the local UnoCSS
setup, Stackpress may support these class families.

Treat these as available patterns when they appear in the app or when the
project is known to use the Stackpress Uno preset.

### Responsive Reverse Breakpoints

Stackpress may support desktop-first max-width variants using these prefixes:

- `r4xl-`
- `r3xl-`
- `r2xl-`
- `rxl-`
- `rlg-`
- `rmd-`
- `rsm-`
- `rxs-`

These behave like responsive wrappers around another utility class.

Examples:

- `rmd-hidden`
- `rlg-px-p-20`
- `rxl-flex-col`

### Theme Color Utilities

Stackpress may support theme-token utilities that map to CSS variables.

Text color:

- `theme-0`
- `theme-1`
- `theme-2`
- `theme-3`
- `theme-primary`
- `theme-muted`
- `theme-success`

Background color:

- `theme-bg-0`
- `theme-bg-1`
- `theme-bg-2`
- `theme-bg-3`
- `theme-bg-4`
- `theme-bg-primary`
- `theme-bg-warning`

Border color:

- `theme-bc-0`
- `theme-bc-1`
- `theme-bc-2`
- `theme-bc-3`
- `theme-bc-4`
- `theme-bc-primary`
- `theme-bc-error`

Numeric theme classes map to the standard Stackpress theme slots. Named theme
classes map to CSS variables such as `--primary`, `--muted`, `--success`, and
similar tokens.

### Direct Hex, RGB, And RGBA Color Utilities

Stackpress may support direct color helpers:

- `hex-242424`
- `hex-bg-fffaf2`
- `hex-bc-d9c9b4`
- `rgb-20-116-252`
- `rgb-bg-255-255-255`
- `rgb-bc-36-36-36`
- `rgba-20-116-252-40`
- `rgba-bg-255-123-7-14`
- `rgba-bc-36-36-36-25`

For `rgba-*`, the last number is treated as a percentage-like opacity where
`40` means `0.40`.

### Pixel-Perfect Layout Utilities

Stackpress may support a large `px-*` family for explicit pixel values.

Common groups:

- spacing: `px-m-*`, `px-p-*`, `px-mt-*`, `px-px-*`, `px-my-*`
- sizing: `px-w-*`, `px-h-*`, `px-mw-*`, `px-mh-*`
- positioning: `px-t-*`, `px-r-*`, `px-b-*`, `px-l-*`
- borders: `px-ba-*`, `px-bx-*`, `px-by-*`, `px-bw-*`
- typography/layout: `px-fs-*`, `px-lh-*`, `px-fb-*`, `px-fg-*`
- opacity and stacking: `px-o-*`, `px-z-*`

Examples:

- `px-p-20`
- `px-px-24`
- `px-mt-10`
- `px-w-320`
- `px-mw-960`
- `px-fs-18`
- `px-lh-28`
- `px-o-80`
- `px-z-20`

Some `px-*` utilities also support four-value shorthands:

- `px-m-10-20-10-20`
- `px-p-16-24-16-24`

Some support percent-minus-pixel `calc(...)` patterns:

- `px-w-100-40`
- `px-h-50-20`
- `px-fb-33.333-16`

Those are interpreted like `calc(percent% - pixels)`.

## Tailwind-Like Classes

Tailwind-like utility classes may be acceptable in Stackpress projects if the
local UnoCSS setup supports them.

Do not assume Tailwind-like classes are invalid simply because the project uses
UnoCSS.

Instead:

1. inspect existing views
2. follow the local class vocabulary that already works in the app
3. allow both Tailwind-like classes and Stackpress-specific utility families
   when the project uses them consistently

If the project already uses Tailwind-like utility classes successfully, keep
using that style consistently.

## What Not To Do

- do not invent a separate CSS framework just because utility classes look
  unfamiliar
- do not reject Tailwind-like classes without checking local UnoCSS support
- do not mix several conflicting utility idioms in the same app without reason
- do not ignore the existing shell and layout class patterns used by nearby
  Stackpress views
- do not assume utility classes alone solve `LayoutPanel` scrolling or page
  shell issues when the problem is really page structure or missing `Head`

## Verification

When view changes depend heavily on utility classes:

- verify the rendered page in the running app
- do not rely only on reading the TSX
- check that layout, spacing, and visual hierarchy behave as intended in the
  actual browser output

When the page uses `LayoutPanel`, also verify:

- the inner page container owns scrolling when scrolling is expected
- shared stylesheet links are present so the page does not fall into a
  flash-of-unstyled-content or broken-shell state
