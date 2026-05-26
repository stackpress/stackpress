# Getting Started

This page is now an orientation page, not the main hands-on tutorial. Use it to understand the onboarding path before you start the numbered tutorial track.

## Start Here

If you are starting a new app from scratch, begin with:

 1. [Start Tutorial Track](./start/README.md)
 2. [Hello World Route](./start/01-hello-world-route.md)
 3. [First React Page](./start/02-first-react-page.md)
 4. [First Project Shape](./start/03-first-project-shape.md)
 5. [First Schema Generation](./start/04-first-schema-generation.md)
 6. [First Database And Populate](./start/05-first-database-and-populate.md)
 7. [Render Article Data](./start/06-render-article-data.md)

## Quick Start

The tutorial track is intentionally progressive:

 - tutorial 1 proves the smallest route works
 - tutorial 2 adds React rendering
 - tutorial 3 introduces `config.ts`
 - tutorial 4 introduces `schema.idea`
 - tutorial 5 introduces SQL and populate
 - tutorial 6 renders real article data

## What Just Happened

This separation matters because Stackpress has several layers. The tutorial track delays each layer until it can produce a visible result.

## Core Concepts

Stackpress has three main authoring surfaces:

 - `plugins/*` for local app behavior
 - `config` for startup and generation behavior
 - `schema.idea` for schema-driven generation once the project reaches that stage

The tutorial track introduces those surfaces in that order only when they become useful.

## Common Tasks

After you finish the tutorial track, these supporting guides become the next best reading path:

 - [Project Anatomy](./project-anatomy.md)
 - [Generate And Build](./generate-and-build.md)
 - [Views And Pages](./views-and-pages.md)
 - [Views Guide Set](./views/README.md)
 - [Layouts](./views/layouts.md)
 - [Language And Translations](./views/language-and-translations.md)
 - [Notifier](./views/notifier.md)
 - [Using The Client](./using-the-client.md)
 - [Plugins And Customization](./plugins-and-customization.md)
 - [Debugging And Inspection](./debugging-and-inspection.md)

## Next Steps

Start with [Start Tutorial Track](./start/README.md). After that, use the supporting guides in this folder when you want to go deeper on generation, client output, plugins, or debugging.
