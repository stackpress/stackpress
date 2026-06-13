# Stackpress Docs Wireframe V1

This is a grayscale design-review draft for the redesigned Stackpress developer documentation site.

## Scope

- `index.html` for homepage / docs entry page
- `guides.html` for practical guide and tutorial pages
- `guide-detail.html` for task-focused tutorial pages
- `concepts-index.html` for concept shelf navigation
- `concepts.html` for concept article reading page
- `api.html` for API reference index page
- `api-detail.html` for reference detail pages
- `search.html` for search results
- `mobile-menu.html` for mobile navigation drawer state
- Mobile documentation controls represented as review-only buttons

## Direction

The structure is docs-first with a polished framework front door. The homepage gives developers a recommended start path, then branches into curated shelves:

- Start Building
- Understand Stackpress
- Look Up APIs

The article and API layouts are calmer than the homepage and prioritize search, sidebar navigation, readable prose, and fast lookup.

## Accepted Information Architecture

Primary navigation:

- Start: anchors to the homepage recommended path.
- Concepts: introduces the framework mental model and links into conceptual reading pages.
- Guides: owns tutorial and procedural workflow pages.
- API: owns lookup-oriented public import, config, CLI, and module reference pages.
- Search: available as a persistent header control and a dedicated results page.

Approved page templates:

- Homepage / docs entry
- Guide landing page
- Guide detail page
- Concept shelf page
- Concept article page
- API index page
- API detail page
- Search results page
- Mobile menu drawer state

## Creative Handoff

Preserve these structure decisions during the Creative phase:

- Keep the homepage more expressive than article/reference pages.
- Keep docs articles and API pages calm, readable, and spacious for junior developers.
- Preserve the three-column desktop docs pattern where it remains practical.
- Preserve mobile behavior as a drawer/menu model instead of forcing sidebars into small screens.
- Keep search visually prominent on every major page.
- Treat the code blocks, reference tables, and tutorial step lists as primary trust surfaces.
- Do not turn the docs site into a marketing landing page; it should remain docs-first.

## Pass 2 Refinements

- Homepage headline now favors first-success onboarding over broad product positioning.
- Homepage includes lightweight docs inventory signals and a dedicated search strip.
- Concept pages include grouped left navigation and previous/next article movement.
- API pages include a filter affordance, most-used cards, and secondary reference group summaries.
- Mobile layout hides desktop sidebars and shows explicit docs-menu / page-menu controls.

## Pass 3 Refinements

- Removed SPA-style screen switching.
- Split the wireframe into separate static page files.
- Updated navigation to use file-based links that better match the final static site.

## Pass 4 Refinements

- Added a dedicated `guides.html` wireframe instead of sharing the Concepts page.
- Routed tutorial/start-path links to the guide page where appropriate.
- Added offset spacing for the homepage `#start` anchor so it lands below the sticky header.

## Pass 5 Refinements

- Added representative pages for the fuller static docs system.
- Added concept shelf, guide detail, API detail, search results, and mobile menu state wireframes.
- Linked search controls and major cards to concrete static wireframe files.

## Review Notes

- This is not production implementation.
- This intentionally avoids brand color, final typography, gradients, illustrations, and polished styling.
- Navigation uses separate static page files so the wireframe reflects the intended static site model.

## Reference Inputs

- Existing Stackpress site content inventory: https://www.stackpress.io/
- Next.js docs/product front door: https://nextjs.org/
- Laravel polished framework positioning: https://laravel.com/
- hapi production/trust docs framing: https://hapi.dev/
- Koa and Express direct minimal docs surfaces: https://koajs.com/ and https://expressjs.com/
- NestJS structured framework feature framing: https://nestjs.com/
