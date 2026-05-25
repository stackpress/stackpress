# Stackpress Developer Specs

This folder is the developer-facing documentation set for Stackpress. It is organized by reader intent so junior developers can either build a new app, learn the framework model, or look up public imports and config later.

## Start Building

Use the `guides/start` tutorial track first if you are building a new app from scratch.

 1. [Start Tutorial Track](./guides/start/README.md)
 2. [Hello World Route](./guides/start/01-hello-world-route.md)
 3. [First React Page](./guides/start/02-first-react-page.md)
 4. [First Project Shape](./guides/start/03-first-project-shape.md)
 5. [First Schema Generation](./guides/start/04-first-schema-generation.md)
 6. [First Database And Populate](./guides/start/05-first-database-and-populate.md)
 7. [Render Article Data](./guides/start/06-render-article-data.md)

After the tutorial track, use the broader guides for operational help:

 - [Getting Started Overview](./guides/getting-started.md)
 - [Project Anatomy](./guides/project-anatomy.md)
 - [Generate And Build](./guides/generate-and-build.md)
 - [Using The Client](./guides/using-the-client.md)
 - [Plugins And Customization](./guides/plugins-and-customization.md)
 - [Debugging And Inspection](./guides/debugging-and-inspection.md)

## Understand Stackpress

Use the `concepts` shelf when you want the Stackpress mental model without dropping into each sibling project separately.

 - [Overview](./concepts/overview.md)
 - [Architecture](./concepts/architecture.md)
 - [Idea Files](./concepts/idea-files.md)
 - [Schema And Generation](./concepts/schema-and-generation.md)
 - [Plugin System](./concepts/plugin-system.md)
 - [View And Client](./concepts/view-and-client.md)
 - [Generated Artifacts](./concepts/generated-artifacts.md)
 - [Glossary](./concepts/glossary.md)

## Look Up APIs

Use the `api` shelf when you already know the surface you need and want exact import, command, or config details.

 - [API Index](./api/README.md)
 - [Package Root](./api/index.md)
 - [Config Reference](./api/config-reference.md)
 - [CLI Reference](./api/cli-reference.md)
 - [Idea Reference](./api/idea-reference.md)

## Main Rule

Start from `stackpress` and `stackpress/...` import paths for public app-facing usage. The `guides/start` tutorials are the one deliberate exception because they introduce lower-level capability packages step by step for onboarding clarity.
