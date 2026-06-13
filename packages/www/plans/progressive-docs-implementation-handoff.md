# Progressive Docs Implementation Handoff

Approved creative reference:

- `packages/www/design/creative/stackpress-docs-v2/`

## Final Product Decisions

- The first reader state is `100 Visitor`.
- `000 Orientation` is not a separate reader state. It is available on first
  visit alongside `100 Develop`.
- Guide navigation and home guide cards are ordered highest-visible first.
- Locked guide bands are hidden from global navigation and guide indexes.
- Direct guide URLs remain readable.
- Opening a direct guide URL above the current reader state upgrades the
  reader's visible guide band.
- API reference remains outside the progression gate.
- Dark mode is hidden for `100`, `200`, and `300`.
- Dark mode starts at `400` and remains available through `800`.
- Experience is measured independently from visible guide level.
- Guide pages award `10` EXP after the reader spends at least `2` minutes on
  the page and reaches the bottom region of the page.

## Production Mapping

- Level metadata and guide-level mapping:
  `packages/www/plugins/app/progress.ts`
- Shared shell, badge dropdown, unlock attributes, and guide count attributes:
  `packages/www/plugins/app/components/docs.tsx`
- Home card ordering:
  `packages/www/plugins/app/progress.ts`
- Guide index card ordering:
  `packages/www/plugins/app/progress.ts`
- Guide article metadata and nav ordering:
  `packages/www/plugins/guides/helpers.ts`
- Static home view:
  `packages/www/plugins/home/views/home.tsx`
- Home route and home payload:
  `packages/www/plugins/home/plugin.ts`
  `packages/www/plugins/home/helpers.ts`
- Static artifact generation:
  `packages/www/scripts/build.ts`
- Local storage level, experience, and history behavior:
  `packages/www/public/scripts/docs.js`
- Theme tokens and progressive chrome:
  `packages/www/public/styles/global.css`

## Runtime Behavior

The static HTML renders the default `100 Visitor` shell. The client script then
reads local storage, sets the reader level on the docs shell, and reveals only
items with `data-unlock-level` less than or equal to the reader state.

Reader level state:

- `spLevel` stores the highest visible guide band.
- Fresh visitors start at `1`, which reveals `000` and `100`.
- Entering a guide page above the stored level upgrades `spLevel` to that
  guide page's band.
- API pages do not change `spLevel`.

Guide pages expose:

- `data-guide-level`
- `data-guide-path`
- `data-guide-count`

Home and guide index pages expose `data-guide-count` so the client can
calculate the experience progress bar from the current number of source guide
pages.

Experience state:

- `spHistory` is the source of truth for per-guide engagement.
- `spExp` is an optional cache calculated from `spHistory`.
- A guide page awards `10` EXP only once.
- EXP is awarded after both conditions are true:
  - the page has at least `120000` milliseconds of dwell time
  - the reader reaches the bottom region of the guide page
- Maximum possible EXP is `guideCount * 10`. The UI uses this for the progress
  bar percentage but does not display the max value.
- Level and EXP are independent. A reader can become `Legend` by opening an
  `800` URL while still having low EXP.

The badge dropdown renders:

- `Stackpress mastery`
- current badge name
- EXP progress bar
- current EXP total
- `Your next journey`
- next unread guide in the current visible band
- completed guides in that band

## QA Expectations

- Fresh visitor sees `100` and `000`, with `100` first.
- Higher local storage progress reveals cumulative bands in descending order.
- Deep links render without blocking.
- Deep links above the reader state upgrade `spLevel`.
- Theme switch is hidden until `400`.
- `800 Legend` uses readable light text on dark surfaces.
- `spHistory` prevents double-awarding EXP for the same guide page.
- Clearing `spExp` does not lose EXP because it is recalculated from
  `spHistory`.
- API pages do not award EXP.
