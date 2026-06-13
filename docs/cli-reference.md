# CLI Reference

This page documents the public `stackpress` command surface. Use it when writing `package.json` scripts or running Stackpress tasks directly from the terminal.

## Common Pattern

Most commands follow this shape:

```bash
stackpress <command> --b config -v
```

### Flags

#### `--b <module>`

- Use it to choose the bootstrap module Stackpress should load before running the command.
- In smaller apps this is often `config`.

#### `-v`

- Use it to enable verbose logging.

## `develop`

```bash
stackpress develop --b config -v
```

Starts the development server. Use it during local development when you want the app to boot with the chosen config module and expose its routes.

## `generate`

```bash
stackpress generate --b config -v
```

Runs generation tasks. Use it after changing `schema.idea`, schema config, or generation-facing config such as the client output settings.

## `push`

```bash
stackpress push --b config -v
```

Creates or updates database structure from the current schema and database config.

## `populate`

```bash
stackpress populate --b config -v
```

Runs the configured populate flow. Use it to insert sample or seed data defined in `database.populate`.

## `query`

```bash
stackpress query --b config -v
```

Runs direct SQL against the configured database connection.

Example:

```bash
stackpress query "SELECT * FROM article" --b config -v
```

## `purge`

```bash
stackpress purge --b config -v
```

Clears data from the configured database environment. Use it when you want to reset local data before repopulating.

## `emit`

```bash
stackpress emit article-search --b config -v
```

Runs an event manually. Use it when you want to trigger a known event from the terminal for debugging or data inspection.

## `build`

```bash
stackpress build --b config -v
```

Runs the build-oriented application flow. Use it when validating production-style output.

## `serve`

```bash
stackpress serve --b config -v
```

Serves a built application or build-oriented output.

## Package Script Examples

```json
{
  "scripts": {
    "develop": "stackpress develop --b config -v",
    "generate": "stackpress generate --b config -v",
    "push": "stackpress push --b config -v",
    "populate": "stackpress populate --b config -v",
    "query": "stackpress query --b config -v"
  }
}
```

## Related

 - [Config Reference](./config-reference.md)
 - [Generate And Build](../guides/400/410-generate-and-build.md)
