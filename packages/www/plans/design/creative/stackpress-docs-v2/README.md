# Stackpress Docs Creative Draft V2

This is a clickable creative design-review draft based on the approved
wireframes in `packages/www/design/wireframes/stackpress-docs-v2-round3`.

## Stage

Creative phase, Round 1.

## Screens Included

- `index.html` for the first-visit docs entry
- `guides.html` for the 000/100 guide index
- `guide-detail.html` for a guide article
- `api.html` for the always-available reference surface
- `mobile-menu.html` for the compact drawer state
- `completed.html` for the post-160 continuation state
- `reading-ahead.html` for a directly opened guide above the reader's current
  path
- `theme-progression.html` for the full badge/theme progression board
- `level-visitor.html`, `level-junior.html`,
  `level-backend.html`, `level-builder.html`, `level-devops.html`,
  `level-senior.html`, `level-architect.html`, and `level-legend.html` for
  individual badge state pages
- `assets/logo.png` as a local Stackpress wordmark preview asset

## Visual Direction

- Docs-first and course-aware, not a marketing landing page.
- First visit is sparse, editorial, and focused around the default `000` and
  `100` guide path.
- Stackpress blue anchors navigation, primary actions, and active states.
- Mint/teal accents mark technical model surfaces and code-adjacent details.
- Warm amber is used sparingly for review-only simulator controls.
- The default badge is `Visitor`; the post-160 state uses `Junior` treatment and
  reveals `200 Data`.
- Direct links above the current path render with a restrained notice while the
  global navigation stays scoped to earned guide groups.

## Review Notes

- This is not production implementation.
- The review-only simulator is intentionally outside the primary page content.
- Progress state is simulated with a compact level-oriented cookie/localStorage
  value.
- API stays visible while static-site lookup stays limited to navigation and
  reference pages.
- Dark mode is included for visual direction review.
