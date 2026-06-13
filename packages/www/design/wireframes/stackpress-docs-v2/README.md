# Stackpress Docs Wireframe V2

This is a grayscale design-review draft for the progressive Stackpress
documentation product described in `packages/www/plans/`.

## Scope

- `index.html` for first-visit docs entry and the 000/100 guide shell
- `guides.html` for the progress-aware guide index
- `guide-detail.html` for a normal guide reading page
- `api.html` for always-available API reference lookup
- `mobile-menu.html` for the mobile drawer with badge and guide navigation
- `script.js` for cookie/localStorage state, completion buttons, badge popup,
  and the hidden next-guide reveal after `160 Debugging`

## V2 Direction

V2 shifts the information architecture from generic docs shelves to a guided
course-aware documentation product:

- first visits expose only 000 Orientation and 100 Develop
- later guide groups are not mentioned until the reader finishes `160 Debugging`
- API reference remains globally available
- progress status lives in the badge popup instead of the main page
- article pages preserve the teaching style from the plans: motivate the topic,
  anchor the mental model, show the smallest useful change, then verify

## Review Notes

- This is not production implementation.
- This intentionally avoids brand color, gradients, illustrations, and polished
  visual styling.
- Labels are realistic enough to review hierarchy and flow, but the final copy
  can change during implementation.
- The badge uses an embedded Font Awesome Free `circle-info` SVG path so the
  wireframe does not depend on a CDN.
- The prototype writes a cookie when served over HTTP and mirrors state to
  localStorage so it also works when opened from `file://`.

## What To Review

- Is the page set complete for the progressive docs behavior now that only
  000/100 appear at first?
- Does the first-visit homepage feel small enough for junior developers?
- Is the badge popup the right place for progress state?
- Does completing `160 Debugging` reveal the next guide group at the right time?
- Does mobile preserve the same guide navigation model?

If this wireframe round is approved, the next phase is creative design for the
progressive theme system.
