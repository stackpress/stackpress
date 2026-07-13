# Stackpress Configuration Reference

Stackpress configuration is executable policy shared by the framework's
plugins. Import the `Config` type from `stackpress/types`, then export a plain
object from the bundle selected with the CLI `-b` option.

```ts
import type { Config } from 'stackpress/types'

const config: Config = {
  server: { port: 3000, mode: 'development' },
  brand: { name: 'Example' },
  language: { default: 'en' },
  session: { key: 'session' }
}

export default config
```

Configuration is intentionally distributed by ownership. The server consumes
host, port, mode, base-path, public-directory, and body-limit settings. The
terminal owns command defaults such as the Idea input and verbosity. Database
settings select an adapter and connection values. View settings control source,
build, page, layout, and asset locations. Session, authentication, API, admin,
email, CSRF, MCP, and desktop sections become meaningful when their owning
plugins are installed and registered.

## Composition

Because the file is TypeScript, environments can share policy with ordinary
object composition.

```ts
const common = {
  brand: { name: 'Example' },
  language: { default: 'en', locales: ['en', 'fil'] }
}

export default {
  ...common,
  server: {
    port: Number(process.env.PORT || 3000),
    mode: process.env.NODE_ENV || 'development'
  },
  database: {
    url: process.env.DATABASE_URL
  }
} satisfies Config
```

Nested sections must be spread deliberately when only one nested value changes;
a shallow top-level spread replaces the entire section.

## Operational Boundaries

`Config` provides editor and compile-time guidance, not central runtime
validation. Plugins read the sections they own and may apply their own defaults.
An optional section does not activate its plugin. Secrets should come from the
environment or another secret provider rather than committed configuration.

For command execution, prefer `-b path/to/config` when multiple bundles exist.
The terminal's Idea-path naming has historical ambiguity, so `-i path/to/schema.idea`
is the unambiguous generation override.

