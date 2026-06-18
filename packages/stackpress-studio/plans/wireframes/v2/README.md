# Stackpress Studio Wireframes v2

This revision replaces the earlier dashboard-style concept with a Cradle-informed SPA workbench.

Related documentation:

- `plans/stackpress-studio/right-mobile-panel.md` - reusable right mobile panel UI pattern
- `plans/stackpress-studio/stackpress-admin-ui.md` - Stackpress Studio admin UI rules and resource behavior

## Screens

- `index.html` - clickable SPA entry; drawer is closed on load
- `fields.html` - Article Fields tab with compact draggable field rows
- `field-editor.html` - nested Update Field editor
- `add-field.html` - Add Field state after selecting a component type
- `relations.html` - relation rows using idea semantics rather than Cradle cardinality literally
- `fieldsets.html` - fieldset/type editor that shares field editing but hides database-only options
- `enums.html` - enum option management
- `source.html` - canonical idea source and import graph diagnostics

`index.html` is the primary review target for this round. The sibling HTML
files remain static state references from the earlier pass.

## Review Focus

- Whether the right task drawer should be the main editing surface.
- Whether Content, Fields, and Relations are the right drawer tabs for models.
- Whether field rows have the right density and summary information.
- Whether nested field editing should replace Cradle's older popup/drawer stack.
- Whether fieldsets and enums feel like first-class resources without copying model-only behavior.

## Cradle UX Comparison

The v2 model flow is intended to function like Cradle in these ways:

- The model index loads first without an open drawer.
- Clicking an idea file in the sidebar selects that file and opens the model index for that active file.
- The model index stays visible while a right-side task drawer opens.
- The right-side drawer acts like Cradle's app panel: top-level resources open the panel, nested editors push a screen, and Back/Cancel/Save returns to the previous panel screen.
- The panel layout follows Cradle's functional CSS model: fixed-width right sidebar on desktop, full-width panel on narrow screens, fixed header/tabs/footer, and independently scrolling panel bodies.
- The nested panel state uses a low-fi left rail so pushed screens read like Cradle's `view-mobile` stack without copying the legacy implementation.
- Clicking Article opens the update drawer; clicking + Add Model opens the same drawer pattern with empty defaults.
- Model drawers use Content, Fields, and Relations tabs.
- Content includes singular name, plural name, keyword, icon, description, Display, and Query, matching the current idea schema attributes instead of Cradle-only group metadata.
- Fields are dense row summaries with drag handles, copy/remove actions, and format/index summaries.
- Clicking a field opens a focused field editor with Label, Keyword, Type, Add Attribute, Validation, List Format, Detail Format, Default, and index toggles.
- Add Field opens the same full editor pattern with empty defaults, matching Cradle's field-create flow.
- Add Attribute and Add Validation mutate the current editor by adding visible rows instead of only showing a toast.
- Selecting Characters Greater Than, Image Carousel list format, or Image Carousel detail format reveals the dependent inputs those options require.
- The Type, Validation, List Format, and Detail Format controls open option lists before selecting a value.
- Type, Validation, List Format, and Detail Format option lists are expanded from the Stackpress schema attribute families instead of only showing sample Cradle choices.
- The icon field opens a grayscale Font Awesome picker drawer only after clicking the field.
- Add Field, copy/remove field controls, and drag-handle reorder gestures produce visible wireframe feedback.
- Copy and Remove from a model open pushed confirmation/edit screens like Cradle panel-forward actions.
- Fieldsets use the Cradle fieldset shape: Content and Fields tabs only, singular/plural labels plus keyword, shared field editing, and no model-only relation or database/index controls.
- Enums are first-class resources: Add Enum opens a publish-only drawer, existing enums open update drawers, and enum option editing pushes a nested editor.
- Imported idea files are first-class resources: existing files open source-edit drawers, and Add File shows the automatic `use ideas/new.idea` patch into `schema.idea`.
- Utility editors such as fields, enum options, relations, icon picker, copy/remove, and source-file screens hide model tabs so the pushed drawer behaves like a focused Cradle mobile-view screen.

Studio intentionally differs from Cradle here:

- The icon picker is a click-open state, not always visible in the Content tab.
- The panel stack is implemented in plain JavaScript for the wireframe; it does not carry over Cradle's jQuery implementation.
- Relation rows use local model/column to foreign model/column plus optional relation name, kept on one horizontal row with drawer-level horizontal scroll.
- Source and import files are first-class because idea files can `use` other idea files.

## Local Cradle References

- `plans/stackpress-studio/cradle/admin.js` - `App Panel UI` uses a `screens` array, `addScreen`, `removeScreen`, `reloadScreen`, and `replaceScreen`.
- `plans/stackpress-studio/cradle/admin.css` - right sidebar and `view-mobile` sections define the functional layout model used here.
