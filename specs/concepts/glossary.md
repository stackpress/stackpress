# Glossary

This page defines the main Stackpress terms that appear throughout the docs set.

## Source Surfaces

 - `idea file`: the `schema.idea` source-of-truth file that defines the schema input for Stackpress
 - `config`: the `config/*.ts` files that decide how Stackpress generates and runs the app
 - `plugin`: a focused unit of framework or app behavior registered into the Stackpress runtime

## Schema Terms

 - `model`: a main data structure declared in the idea file
 - `type`: a reusable schema shape declared in the idea file
 - `enum`: a named value set declared in the idea file
 - `attribute`: metadata attached to declarations or fields
 - `assertion`: a supported rule attached to a field, often through `@is.*`
 - `relation`: metadata that connects one model to another

## Generation Terms

 - `generator`: code that consumes the loaded schema and writes output
 - `generated artifact`: output created from Stackpress source files rather than written by hand
 - `client_source`: readable generated TypeScript used for inspection
 - `.build`: generated working directory for revisions, migrations, and related output
 - `revision`: generated schema-state tracking output
 - `migration`: generated database-change output derived from schema changes

## Runtime Terms

 - `event`: a named runtime action that can be emitted through the terminal or runtime
 - `route`: a request-handling entrypoint in the server layer
 - `store`: generated or framework-facing database access structure
 - `action`: generated or framework-facing operation helper, often tied to schema-driven behavior
 - `frui`: reusable React component output used by the Stackpress view layer

## Related Pages

 - [Overview](./overview.md)
 - [Idea Files](./idea-files.md)
 - [Idea Reference](../api/idea-reference.md)
