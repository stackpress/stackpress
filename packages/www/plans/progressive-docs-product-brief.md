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
- Reveal higher-level guides when the reader reaches that guide band, while
  separately measuring page-by-page engagement as experience.
- Keep every page URL-addressable for direct links, search, and sharing.
- Keep API reference pages always reachable.
- Make higher levels feel like status through visible badges, richer navigation, and
  progressively more mature themes.
- Use anonymous progress only. Do not require accounts or login.
- Build the production static site into the repository root `docs/` directory.

## Audience

The primary reader is a junior or intermediate developer learning Stackpress
from the website. They may understand TypeScript, routes, React, or databases,
but should not be expected to understand the Stackpress package boundaries on
their first visit.

The secondary reader is an experienced evaluator who opens a deep URL directly.
They should be able to read the page, and the page chrome can adapt to that
guide band without blocking or shaming the direct visit.

## Level Model

Guide folders under `specs/guides/` map to site levels. The reader-facing
progression starts at `100 Visitor`; `000 Orientation` is not a separate
reader state. It is always visible alongside `100 Develop` on first visit.

| Level | Guide Folder | Topic | Default Visibility |
| --- | --- | --- | --- |
| 1 | `000`, `100` | Orientation and Develop | Visible on first visit |
| 2 | `200` | Data | Visible after entering a Level 2 guide |
| 3 | `300` | Idea | Visible after entering a Level 3 guide |
| 4 | `400` | Build and Deploy | Visible after entering a Level 4 guide |
| 5 | `500` | Project Structure | Visible after entering a Level 5 guide |
| 6 | `600` | Built-ins | Visible after entering a Level 6 guide |
| 7 | `700` | Studio | Visible after entering a Level 7 guide |
| 8 | `800` | AI | Visible after entering a Level 8 guide |

The first visit should show `000` and `100` navigation only. If the reader
opens a Level 4 page directly, the page should render and Level 4 navigation
should become visible for future browsing.

## Unlock Rules

Progress is static-site client state. The production site is built for GitHub
Pages and has no server session, so progress must be stored in `localStorage`.

The unlock level is stored independently from experience:

- `spLevel` stores the highest visible guide band, from `1` through `8`.
- A fresh visitor starts at `1`, which shows both `000 Orientation` and
  `100 Develop`.
- When a reader opens any guide page above their current `spLevel`, the client
  upgrades `spLevel` to that page's guide level.
- Readers can skip levels if they know a URL. This is acceptable because direct
  links should stay readable and the site should not behave like a hard gate.
- API pages do not change `spLevel`.

Levels and experience are independent. It is possible to be a `Legend` with low
experience if the reader opened an `800` URL directly without reading many guide
pages.

## Experience Model

Experience measures meaningful guide-page engagement. It is not used to unlock
guide levels.

Experience state uses two local storage keys:

- `spHistory` is the source of truth. It stores per-guide engagement history so
  the same page cannot award experience more than once.
- `spExp` is an optional derived cache. The client should be able to recompute
  the displayed experience total from `spHistory` even if `spExp` is missing,
  stale, or manually cleared.

A guide page awards `10` experience when all of these are true:

- the reader is on a guide page, not an API reference page
- the reader reaches the bottom region of the guide page
- the reader has spent at least `2` minutes on that guide page
- the guide page has not already awarded experience in `spHistory`

Recommended `spHistory` shape:

```json
{
  "/guides/320-modeling": {
    "bottomReached": true,
    "completedAt": "2026-06-13T00:00:00.000Z",
    "dwellMs": 132000,
    "expAwarded": true,
    "firstSeen": "2026-06-13T00:00:00.000Z",
    "level": 3,
    "path": "/guides/320-modeling"
  }
}
```

Maximum possible experience is the number of guide Markdown files under
`specs/guides/` multiplied by `10`. The UI uses this value to calculate the
progress bar percentage, but it should not show the max value. The dropdown
should display only the reader's current experience total.

## Navigation Behavior

The visible guide navigation should include all visible levels and no locked
levels.

Examples:

- A new reader sees the Level 1 guide nav, including `000` and `100`.
- A Level 4 reader sees Level 1, Level 2, Level 3, and Level 4 guide
  nav.
- A Level 8 reader sees the full course guide nav.

Visible guide navigation and home guide cards should be ordered with the
highest visible guide band first. For example, a Level 5 reader sees `500`,
`400`, `300`, `200`, `100`, then `000`.

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
render normally and upgrade `spLevel` to that page's guide band. The site should
avoid language that makes the reader feel punished for opening a direct link.

## Badge, Experience, And Theme Progression

The site should make progress feel like status without turning the docs into a
game UI. Badges should be visible in the docs shell, mobile menu, and guide
index. Experience should be visible in the header badge dropdown.

The header badge dropdown should show:

- `Stackpress mastery` as the section label
- the current badge name, such as `Backend`
- an experience progress bar based on current experience divided by maximum
  possible guide experience
- the current experience number only, with thousands separators
- `Your next journey`
- the next unread guide in the current visible band with an arrow icon
- recently completed guides in that band with check icons

| Level | Badge | Theme Direction |
| --- | --- | --- |
| 1 | Visitor | Barebones text-first docs, sharp edges, minimal color |
| 2 | Junior | Early 2000s web: stronger borders, simple tabs, playful but readable |
| 3 | Backend | 2010s documentation: clearer cards, larger nav, heavier affordances |
| 4 | Builder | Current docs: polished layout, balanced spacing, modern components |
| 5 | DevOps | Warmer operational theme with stronger deploy and project-structure cues |
| 6 | Senior | Cooler power-user theme with denser advanced navigation |
| 7 | Architect | Premium docs treatment, richer diagrams and advanced surfaces |
| 8 | Legend | Distinct expert theme with command-center density and AI-oriented surfaces |

Dark mode is not available for Levels 1 through 3. The theme switch appears
starting at Level 4 and remains available through Level 8. Level 8 defaults to
an expert dark treatment with readable light text.

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

### Reference Websites For Theme Progression

These websites are design references, not implementation requirements. Use them
to calibrate visual direction, navigation density, and page treatment for each
reader level while keeping the Stackpress logo, content model, and URL shape
stable.

| Level | Badge | Reference Sites | Useful Design Cues |
| --- | --- | --- | --- |
| 1 | Visitor | [Python documentation](https://docs.python.org/3/) and sparse early docs references | Text-first hierarchy, familiar docs layout, clear section lists, low visual commitment. |
| 2 | Junior | [W3Schools via Wayback](https://web.archive.org/web/*/https://www.w3schools.com/), [PHP manual via Wayback](https://web.archive.org/web/*/https://www.php.net/manual/en/) | Strong borders, simple tabs, obvious link colors, early-web affordances that still scan cleanly. |
| 3 | Backend | [Bootstrap 3 docs](https://getbootstrap.com/docs/3.3/), [Ruby on Rails Guides](https://guides.rubyonrails.org/) | 2010s documentation structure, larger navigation, heavier sectioning, categorized guide indexes. |
| 4 | Builder | [Astro docs](https://docs.astro.build/), [Stripe docs](https://docs.stripe.com/) | Polished current docs treatment, balanced spacing, modern callouts, mature code examples. |
| 5 | DevOps | [Fly.io docs](https://fly.io/docs/), [Terraform docs](https://developer.hashicorp.com/terraform/docs) | Deploy-first flows, CLI setup steps, operational groupings, project and infrastructure cues. |
| 6 | Senior | [Kubernetes docs](https://kubernetes.io/docs/home/), [Terraform docs](https://developer.hashicorp.com/terraform/docs) | Dense nested navigation, versioning controls, advanced references, power-user scanning surfaces. |
| 7 | Architect | [Stripe docs](https://docs.stripe.com/), [Cloudflare developer docs](https://developers.cloudflare.com/) | Premium API documentation, system-level explanations, richer diagrams, refined search and sidebar behavior. |
| 8 | Legend | [Claude API docs](https://platform.claude.com/docs/en/home), [OpenAI docs](https://docs.openai.com/) | AI-oriented expert surfaces, command-center density, model/tool/reference grouping, advanced workflow entry points. |

Recommended Wayback windows for older references:

- W3Schools: `2003` through `2006`
- PHP manual: `2004` through `2008`
- Bootstrap: `2013` through `2015`
- Rails Guides: `2010` through `2015`

## Content Organization

Guide source should continue to come from `specs/guides/`. API reference source
should continue to come from `specs/references/`.

The guide index should group pages by visible level. Locked levels should be
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

Add small progress and helper modules under the docs plugins. They should
provide:

- level metadata
- guide-to-level mapping
- local storage key naming for client behavior
- nav filtering helper
- guide count for experience percentage calculations

Suggested local storage keys:

- `spLevel`
- `spHistory`
- `spExp`

### Client Progress Script

Extend or replace `packages/www/public/scripts/docs.js` with progress tracking
for guide pages.

The script should:

- read page metadata from `data-*` attributes on the article shell
- track page dwell time and pause/resume around document visibility changes
- track whether the reader reached the bottom region of the page
- write `spLevel` when a guide page is above the stored visible level
- write `spHistory` when a guide earns experience
- keep `spExp` in sync as a derived cache
- avoid counting API pages
- avoid awarding experience twice for the same guide page

The article shell should expose enough metadata for the script:

```html
<article
  data-guide-count="123"
  data-guide-level="1"
  data-guide-path="/guides/120-pages"
></article>
```

### Server And Static Rendering

Because the production site is static, the first HTML response cannot be
personalized per reader on the server. The implementation should render a
default Level 1 shell, then let the client script upgrade the visible nav and
theme after reading local storage.

To avoid layout flashes:

- hide the docs shell until the client applies level and theme classes
- define CSS themes behind level classes such as `.docs-level-3`
- keep locked nav hidden by default until the client confirms the level

### Package Areas To Touch

Likely implementation files:

- `packages/www/plugins/guides/manifest.ts` for generated guide metadata
- `packages/www/plugins/guides/helpers.ts` for guide page props
- `packages/www/plugins/guides/views/doc.tsx` for article metadata
- `packages/www/plugins/guides/views/shelf.tsx` for guide index progression
- `packages/www/plugins/app/components/docs.tsx` for shell nav, badge, and
  theme data
- `packages/www/plugins/home/helpers.ts` for home page guide count and cards
- `packages/www/plugins/home/views/home.tsx` for the static home view
- `packages/www/public/scripts/docs.js` for client-side progress tracking
- `packages/www/public/styles/global.css` for level themes
- `packages/www/scripts/build.ts` only if the static route list needs to include
  newly generated guide URLs

## Analytics Signal

Progress is intentionally anonymous, but the site can still expose aggregate
signals through normal analytics if analytics are later added.

Useful events:

- `guide_experience_awarded`
- `guide_level_unlocked`
- `guide_direct_level_upgrade`
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

- Whether the `2` minute dwell threshold should ever vary for very short or
  very long guide pages.
- Whether the badge dropdown should show only the current guide band or include
  completed guides from earlier visible bands.

## Success Criteria

- A new visitor sees only `000` and `100` guide navigation under the `100 Visitor`
  state.
- A returning visitor with a higher `spLevel` sees the correct unlocked guide
  levels.
- Direct high-level URLs render without blocking.
- Direct high-level URLs upgrade `spLevel` to that guide band.
- API reference pages are always visible and reachable.
- API reference pages do not award experience.
- Guide pages award `10` experience only after bottom scroll plus at least
  `2` minutes of dwell time.
- Clearing `spExp` does not lose experience because the value is recalculated
  from `spHistory`.
- Theme, badge, and nav density change by reader level.
- Static production output writes to root `docs/`.
- Development workflow uses the `packages/www` dev server.
