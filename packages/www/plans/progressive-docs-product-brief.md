# Progressive Docs Product Brief

This brief defines the progressive documentation experience for the Stackpress
website in `packages/www`. The site should behave like a course-aware
documentation product: early visits feel small and focused, while committed
readers unlock richer navigation, layout, and visual treatment as they move
through the guide levels.

The public framing is a guided learning path. The internal rationale is to keep
first-pass readers from judging the whole framework before they have enough
context, while also producing a signal about which guide levels attract real
attention.

## Product Goals

- Show only the beginner path at first so the site feels approachable.
- Reveal higher-level guides after the reader spends meaningful time with the
  previous level.
- Keep every page URL-addressable for direct links, search, and sharing.
- Keep API reference pages always reachable.
- Make higher levels feel earned through visible badges, richer navigation, and
  progressively more mature themes.
- Use anonymous progress only. Do not require accounts or login.
- Build the production static site into the repository root `docs/` directory.

## Audience

The primary reader is a junior or intermediate developer learning Stackpress
from the website. They may understand TypeScript, routes, React, or databases,
but should not be expected to understand the Stackpress package boundaries on
their first visit.

The secondary reader is an experienced evaluator who opens a deep URL directly.
They should be able to read the page, but the page chrome should make it clear
that they are reading ahead of the recommended path.

## Level Model

Guide folders under `specs/guides/` map to site levels.

| Level | Guide Folder | Topic | Default Visibility |
| --- | --- | --- | --- |
| 0 | `000` | Orientation | Visible on first visit |
| 1 | `100` | Develop | Visible on first visit |
| 2 | `200` | Data | Unlocked after Level 1 checkpoint |
| 3 | `300` | Idea | Unlocked after Level 2 checkpoint |
| 4 | `400` | Build and Deploy | Unlocked after Level 3 checkpoint |
| 5 | `500` | Project Structure | Unlocked after Level 4 checkpoint |
| 6 | `600` | Built-ins | Unlocked after Level 5 checkpoint |
| 7 | `700` | Studio | Unlocked after Level 6 checkpoint |
| 8 | `800` | AI | Unlocked after Level 7 checkpoint |

The first visit should show Level 0 and Level 1 navigation only. If the reader
opens a Level 4 page directly, the page should render, but Level 4 navigation
should not become globally visible until the reader has earned that level.

## Unlock Rules

Progress should be stored in an anonymous first-party cookie. Local storage can
be used as a fallback or companion store if the implementation needs richer
client state, but the cookie should be the source used to initialize server or
static-page rendering state.

A page can count toward a checkpoint only when all of these signals are true:

- the tab is visible for the estimated reading time
- the reader reaches the lower part of the article
- the reader is on a guide page, not an API reference page
- the page belongs to the next level the reader is trying to unlock

Recommended checkpoint rule:

- Level 0 is granted by default.
- Level 1 is granted by default.
- Level 2 unlocks after sufficient engagement with at least one Level 1 parent
  page and one Level 1 child page.
- Levels 3 through 8 unlock after sufficient engagement with either the level's
  parent overview page or two pages from the previous level.

This keeps progression lightweight. The goal is not a quiz system; it is a
reasonable confidence signal that the reader spent time in the learning path.

## Navigation Behavior

The visible guide navigation should include all earned levels and no locked
levels.

Examples:

- A new reader sees Level 0 and Level 1 guide nav.
- A Level 4 reader sees Level 0, Level 1, Level 2, Level 3, and Level 4 guide
  nav.
- A Level 8 reader sees the full course guide nav.

The top-level site nav should remain stable:

- Home
- Guides
- API
- optional Concepts or Search entry if those sections remain part of the site

API reference navigation should always be available because reference lookup is
not part of the course gate. Deep guide topics should stay quiet in the global
UI until unlocked, even though the URLs keep working.

## Reading Ahead State

When a reader opens a guide page above their current level, the page should
show a restrained reading-ahead notice near the top of the article.

Recommended copy:

```text
You are reading ahead.

This page assumes earlier Stackpress guide context. You can keep reading, but
the main navigation will reveal this level after you complete the recommended
path.
```

The notice should not block content, hide examples, or redirect the reader.
The site should avoid language that makes the reader feel punished for opening
a direct link.

## Badge And Theme Progression

The site should make progress feel like status without turning the docs into a
game UI. Badges should be visible in the docs shell, mobile menu, and guide
index.

| Level | Badge | Theme Direction |
| --- | --- | --- |
| 0 | Visitor | Pre-badge orientation, almost no decoration |
| 1 | Newbie | Barebones text-first docs, sharp edges, minimal color |
| 2 | Junior | Early 2000s web: stronger borders, simple tabs, playful but readable |
| 3 | Backend | 2010s documentation: clearer cards, larger nav, heavier affordances |
| 4 | Builder | Current docs: polished layout, balanced spacing, modern components |
| 5 | DevOps | Warmer operational theme with stronger deploy and project-structure cues |
| 6 | Senior | Cooler power-user theme with denser advanced navigation |
| 7 | Architect | Premium docs treatment, richer diagrams and advanced surfaces |
| 8 | Legend | Distinct expert theme with command-center density and AI-oriented surfaces |

Theme changes should affect:

- color tokens
- nav density
- page shell layout
- progress badge treatment
- guide index presentation
- calls to next recommended guide

Theme changes should not affect:

- URL shape
- content order
- API availability
- readable contrast
- logo identity
- basic keyboard navigation

## Content Organization

Guide source should continue to come from `specs/guides/`. API reference source
should continue to come from `specs/references/`.

The guide index should group pages by earned level. Locked levels should be
completely hidden from navigation and index pages. They remain accessible only
when the reader already knows the URL.

Recommended URL shape:

```text
/guides/000-orientation
/guides/100-develop
/guides/200-data
/api/server
```

If the current site keeps older guide URLs during migration, add redirects or
aliases rather than breaking inbound links.

## Implementation Notes

Use the existing Stackpress website package in `packages/www`.

The site should keep using the same Stackpress and Reactus-backed template
engine already configured in:

- `packages/www/config/develop.ts`
- `packages/www/config/build.ts`
- `packages/www/scripts/build.ts`

Development should use the dev server. Do not run the static build as part of
normal feature development.

Production output should continue to build static pages into the repository
root `docs/` directory. `packages/www/config/common.ts` already defines:

```ts
export const root = path.resolve(cwd, '../..');
export const docs = path.join(root, 'docs');
```

### Suggested Runtime Pieces

Add a small progress module under `packages/www/plugins/app/` or a dedicated
docs plugin. It should provide:

- level metadata
- guide-to-level mapping
- estimated reading time helper
- cookie read/write helper
- nav filtering helper
- reading-ahead helper

Suggested cookie fields:

```json
{
  "level": 2,
  "completed": ["100-develop", "120-pages"],
  "updated": "2026-06-08T00:00:00.000Z"
}
```

Keep the cookie compact. If completed pages become too large for a cookie,
store only the highest level and a short checkpoint record.

### Client Progress Script

Extend or replace `packages/www/public/scripts/docs.js` with progress tracking
for guide pages.

The script should:

- read page metadata from `data-*` attributes on the article shell
- start a timer only when `document.visibilityState === 'visible'`
- track whether the reader reached the lower portion of the page
- write the progress cookie after the checkpoint is satisfied
- avoid counting API pages
- avoid repeatedly writing the same cookie value

The article shell should expose enough metadata for the script:

```html
<main
  data-doc-kind="guide"
  data-guide-id="120-pages"
  data-guide-level="1"
  data-reading-minutes="6"
>
```

### Server And Static Rendering

Because the production site is static, the first HTML response cannot be
personalized per reader on the server. The implementation should render a
default Level 0/1 shell, then let the client script upgrade the visible nav and
theme after reading the cookie.

To avoid layout flashes:

- add a tiny early script in the document head that reads the progress cookie
  and sets `data-reader-level` on `<html>`
- define CSS themes behind `[data-reader-level="N"]`
- keep locked nav hidden by default until the client confirms the level

### Package Areas To Touch

Likely implementation files:

- `packages/www/plugins/guides/manifest.ts` for generated guide metadata
- `packages/www/plugins/guides/pages/doc.ts` for guide page props
- `packages/www/plugins/guides/views/doc.tsx` for article metadata and notices
- `packages/www/plugins/guides/views/shelf.tsx` for guide index progression
- `packages/www/plugins/app/components/docs.tsx` for shell nav, badge, and
  theme data
- `packages/www/public/scripts/docs.js` for client-side progress tracking
- `packages/www/public/styles/global.css` for level themes
- `packages/www/scripts/build.ts` only if the static route list needs to include
  newly generated guide URLs

## Analytics Signal

Progress is intentionally anonymous, but the site can still expose aggregate
signals through normal analytics if analytics are later added.

Useful events:

- `guide_checkpoint_reached`
- `guide_level_unlocked`
- `reading_ahead_page_view`
- `api_reference_view`

Do not store personally identifying information. Do not create user accounts
for this feature.

## Non-Goals

- No login or profile system.
- No quizzes.
- No hard blocking of deep guide URLs.
- No hiding API reference pages.
- No server-side personalization requirement for the static site.
- No production static build during routine development.

## Open Decisions

- Whether Level 0 should show `Visitor` anywhere in the public UI or stay
  internal-only before the public badge ladder starts at `LVL1 Newbie`.
- Exact reading-time formula. A reasonable default is 200 words per minute plus
  extra time for code-heavy pages.
- Whether direct visits to high-level pages can ever count toward unlocks. The
  recommended default is no; only the expected previous level should count.

## Success Criteria

- A new visitor sees only Level 0 and Level 1 guide navigation.
- A returning visitor with a higher progress cookie sees the correct unlocked
  guide levels.
- Direct high-level URLs render without blocking.
- Direct high-level URLs show a reading-ahead notice when the reader has not
  earned that level.
- API reference pages are always visible and reachable.
- Theme, badge, and nav density change by reader level.
- Static production output writes to root `docs/`.
- Development workflow uses the `packages/www` dev server.
