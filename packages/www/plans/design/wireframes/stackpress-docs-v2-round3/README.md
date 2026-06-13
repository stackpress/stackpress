# Stackpress Docs Wireframe V2 Round 3

This round is the final structural wireframe candidate for the progressive
Stackpress docs experience. It uses the Round 2 behavior prototype as the
source of truth for progression, but removes reader-facing prototype controls
from the article content.

## Scope

- `index.html` - first-visit docs entry
- `guides.html` - 000/100 guide index
- `guide-detail.html` - normal guide article
- `api.html` - always-available API reference
- `mobile-menu.html` - compact navigation drawer
- `completed.html` - post-160 state where the next guide group appears
- `script.js` - reviewer-only state simulator and cookie/localStorage mirror

## Strategy

- First visit should make Stackpress feel like `000` and `100` are the whole
  docs surface.
- API reference remains available without participating in guide progression.
- Progress is visible only through the badge popup and completion state.
- The reader-facing pages do not show "complete" buttons, hidden guide groups,
  or progression mechanics as page content.
- The small reviewer simulator is explicitly marked as review-only and lives
  outside the page content.

If this round is approved, the next phase is creative design.
