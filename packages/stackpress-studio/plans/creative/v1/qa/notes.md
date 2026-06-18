# QA Notes

Preview URL:

```text
http://127.0.0.1:8891/index.html
```

## Browser Checks

- `index.html`, `fieldsets.html`, `enums.html`, `source.html`, and
  `field-editor.html` loaded in the in-app browser.
- Stackpress logo asset loaded successfully on all checked pages.
- Initial `index.html` opened with no drawer, matching the approved wireframe
  rule.
- The Article row was visible with a normal hit target and opened the
  `Update Article Model` drawer through the in-app browser coordinate click.
- Standalone `field-editor.html` opened directly into the nested
  `Update Field: Title` drawer state.
- Desktop checks at 1440px wide reported no full-page horizontal overflow.
- Mobile check at 390px wide reported no full-page horizontal overflow and no
  drawer on initial load.
- Round 1 revision verified `drawer-slide-in` at `1s` for opening the right
  drawer.
- Round 1 revision verified `screen-soft-refresh` at `1s` for drawer tab
  changes.
- Round 1 revision verified `screen-push-in` at `1s` for nested screen pushes.
- Round 1 revision verified the light/dark mode toggle switches theme tokens.
- Round 1 feedback pass verified light-mode topbar ghost buttons compute to
  visible light text on the dark topbar.
- Round 1 feedback pass verified the sidebar `+ Add File` ghost button computes
  to visible light text on the dark rail.
- Round 1 feedback pass verified the model header meta is inline text and no
  longer uses header chips.
- Round 1 feedback pass verified `Application` renders a trailing Font Awesome
  Free lock icon.
- Round 1 feedback pass verified field resource buttons render label and key on
  separate lines in the Fields drawer tab.
- Round 1 feedback pass verified `Add Model` opens the full drawer with
  `Content`, `Fields`, and `Relations` tabs, including add-field and
  add-relation empty states.
- Round 1 feedback pass verified the `Parsed` topbar control was removed.
- Round 2 state pass added and verified direct review URLs for deeper drawer
  states: `add-model.html`, `add-file.html`, `field-editor.html`,
  `relation-editor.html`, `source-diagnostics.html`, `fieldset-source.html`,
  and `enum-source.html`.
- Round 2 state pass verified direct drawer states render the expected active
  tabs and body content for Add File create, Relation preview, Source
  diagnostics, Fieldset source, and Enum source.
- Round 2 approval revision removed import controls from the Add File drawer as
  out of scope.
- Round 2 approval revision also made Source Imports read-only so import
  authoring is not implied by another control.
- Round 2 state pass verified `add-model.html`, `add-file.html`,
  `field-editor.html`, `relation-editor.html`, and `source-diagnostics.html`
  at 390px wide with no full-page or drawer horizontal overflow.
- Round 3 polish pass verified `add-file.html`, `field-editor.html`,
  `relation-editor.html`, and `source-diagnostics.html` in the in-app browser
  after adding Font Awesome icon treatments to primary, topbar, drawer, and
  footer controls.
- Round 3 polish pass verified `add-file.html` remains create-only with
  `Create` and `Preview` tabs, no import button, no `+ Add Import` control, and
  no full-page horizontal overflow at the active desktop viewport.
- Round 3 polish pass verified the narrower desktop drawer overlay rule removes
  horizontal overflow on the direct review pages.

## Known QA Limits

- Browser screenshot files were not saved because the Browser runtime could not
  write binary screenshot files into the workspace.
- Row clicks through Browser locators hit a Browser coordinate translation
  issue, so the row interaction was confirmed with a coordinate click after
  validating the row geometry.
- During Round 2, Browser locator and coordinate clicks intermittently failed
  on right-drawer tab controls near the right edge. The drawer state rendering
  was verified through direct review URLs and scoped DOM checks.
