# Stackpress Studio Design Review Round 1

## Artifacts

Wireframes:

 - `wireframes/v1/index.html`
 - `wireframes/v1/fieldsets.html`
 - `wireframes/v1/enums.html`
 - `wireframes/v1/source.html`
 - `wireframes/v1/references.html`

Creative draft:

 - `creative/v1/index.html`
 - `creative/v1/fieldsets.html`
 - `creative/v1/enums.html`
 - `creative/v1/source.html`
 - `creative/v1/references.html`

## Direction

The wireframes translate Cradle's schema builder patterns into a modern SPA workbench:

 - persistent left navigation instead of page reloads
 - file/resource explorer for `schema.idea` and imported idea files
 - table-first model, fieldset, and enum surfaces
 - persistent right inspector instead of routine popup dialogs
 - source mode as the canonical escape hatch
 - Cradle screenshots available as a reference board

The creative draft applies Stackpress branding:

 - Stackpress logo and blue system accents
 - dark primary rail for application-level navigation
 - precise geometric state dots inspired by the Stackpress mark
 - dense tables and restrained panels for repeated schema work
 - green and amber semantic chips for valid and warning states

## Review Questions

 - Does the SPA shell match how Studio should feel: file graph, resource explorer, work area, inspector?
 - Is the split between Models, Fieldsets, and Enums clear enough?
 - Does the fieldset screen correctly feel like a model editor without database/store controls?
 - Does the enum screen deserve more prominence or is its current workbench treatment enough?
 - Does the creative direction feel Stackpress-native while still preserving the Cradle workbench density?
 - Are the Cradle reference screenshots useful inside the draft, or should they stay as separate plan assets only?

## Approval Path

If this round is approved, the next step is to revise the chosen direction into a fuller clickable prototype with create flows, dirty states, validation states, and import-file creation.
