# Progressive Docs Implementation Handoff

Approved creative reference:

- `packages/www/design/creative/stackpress-docs-v2/`

## Final Product Decisions

- The first reader state is `100 Visitor`.
- `000 Orientation` is not a separate reader state. It is available on first
  visit alongside `100 Develop`.
- Guide navigation and home guide cards are ordered highest-earned first.
- Locked guide bands are hidden from global navigation and guide indexes.
- Direct guide URLs remain readable.
- A reading-ahead notice appears when a direct guide URL is above the reader's
  earned state.
- API reference remains outside the progression gate.
- Dark mode is hidden for `100`, `200`, and `300`.
- Dark mode starts at `400` and remains available through `800`.

## Production Mapping

- Level metadata and guide-level mapping:
  `packages/www/plugins/app/progress.ts`
- Shared shell, badge, unlock attributes, and reading-ahead notice:
  `packages/www/plugins/app/components/docs.tsx`
- Home card ordering:
  `packages/www/plugins/app/progress.ts`
- Guide index card ordering:
  `packages/www/plugins/app/progress.ts`
- Guide article metadata and nav ordering:
  `packages/www/scripts/build.ts`
- Static home view:
  `packages/www/plugins/app/views/home.tsx`
- Local storage progress behavior:
  `packages/www/public/scripts/docs.js`
- Theme tokens and progressive chrome:
  `packages/www/public/styles/global.css`

## Runtime Behavior

The static HTML renders the default `100 Visitor` shell. The client script then
reads local storage, sets the reader level on the docs shell, and reveals only
items with `data-unlock-level` less than or equal to the reader state.

Guide pages expose:

- `data-guide-level`
- `data-guide-path`
- `data-reading-ahead`

The client script tracks visible-tab reading time plus lower-page scroll before
writing progress. It does not count API pages.

## QA Expectations

- Fresh visitor sees `100` and `000`, with `100` first.
- Higher local storage progress reveals cumulative bands in descending order.
- Deep links render without blocking.
- Deep links above the reader state show a reading-ahead notice.
- Theme switch is hidden until `400`.
- `800 Legend` uses readable light text on dark surfaces.
