# CLI And Plugin Contracts

Use this reference for Stackpress commands, shared flags, command-to-event
mapping, package plugin lifecycle, and aggregate registration order.

## Two CLI Layers
The dependency-free root executable supports project/skill bootstrap before
workspace dependencies exist. Runtime commands use the installed TypeScript
framework CLI and require `tsx` plus project dependencies.

```text
stackpress create [--dry-run]
stackpress skills --target <codex|claude|opencode|path> [--force] [--dry-run]
stackpress <event> [runtime options]
```

`create` copies the bundled scaffold only into an empty/missing current folder,
validates its package name, renames packaged `gitignore` to `.gitignore`, and
rewrites `package.json.name`. It does not install dependencies or initialize Git.

`skills` copies active skill folders. Known targets resolve from tool home
environment variables or conventional user directories; direct paths resolve
from cwd. Existing folders are skipped unless `--force`. Archives, node_modules,
and `.git` are excluded. Both commands support mutation-free `--dry-run`.

Other root commands delegate to `packages/stackpress-server/bin.ts` when that
monorepo payload exists. A packed lightweight executable cannot run runtime
events alone and directs callers to an installed project.

## Runtime Command Model
The terminal parses the command, registers itself as plugin `terminal`,
bootstraps plugins, resolves `config`, `listen`, and `route`, then emits the
command using request mimetype `terminal/arguments`.

| Flag | Property | Meaning |
| --- | --- | --- |
| `--bootstrap`, `-b` | `config` | bootstrap/config module selected by bin entry |
| `--verbose`, `-v` | `verbose` | progress and missing-command output |
| `--force`, `-f` | `force` | accept command-specific destructive fallback |

Other arguments remain in terminal request data. Handler aliases such as
`input`/`i` are local contracts; flags have no global effect unless consumed.

## Runtime Command Catalog
| Command/event | Prerequisites | Effect and boundary |
| --- | --- | --- |
| `generate` | client config, `client.tsconfig`, Idea input | resolves `idea`, runs transforms, writes generated package/revision if configured |
| `build` | configured view/Reactus | builds page/client/assets and deployment package metadata |
| `serve` | server config | listens on host/port; long-running errors rethrow |
| `develop` | runnable development config | supervises child server and forwards status |
| `emit <event>` | event name | emits an arbitrary event with following arguments |
| `query <sql>` | database | executes raw SQL and prints native results |
| `install` | database + generated client | drops/recreates generated tables; initializes history |
| `push` | database + generated client | installs without sufficient history, otherwise upgrades newest pair |
| `upgrade` | database + adjacent revisions | transactional live diff; `--force` allows generic destructive fallback |
| `migrate` | database, revisions, migration path | writes history SQL without updating database |
| `populate` | `database.populate` | resolves seed events sequentially |
| `purge` | database + generated models | transactionally truncates generated stores |
| `uninstall` | database + generated client | drops generated stores |
| `mcp-stdio` | AI plugin/tools | serves MCP over stdio |
| `mcp-http` | AI plugin/tools | serves/attaches Streamable HTTP MCP |
| `mcp-sse` | AI plugin/SSE config | serves/attaches legacy SSE MCP |
| `desktop:build` | desktop plugin/config | compiles Electron artifacts and manifest |
| `desktop:dev` | desktop package/runtime | runs desktop development flow |
| `desktop:package` | built desktop + packager | invokes electron-builder adapter |

`install`, `purge`, and `uninstall` are destructive. `push` and forced upgrade
can be destructive. Review revisions/migrations and back up production data.
Population has no plan-wide transaction. Raw query bypasses generated stores.

## Idea Input Resolution
Generation currently chooses input in this precedence: request `i`, request
`input`, config `cli.idea`, then `<server.loader.cwd>/schema.idea`.

The public aggregate type names `terminal.idea`, while current generate source
reads `cli.idea`. This is a checkout conflict: command-line `-i` is the
unambiguous override until implementation and type are reconciled.

## Aggregate Plugin Order
The default `stackpress/plugin` invokes:

```text
server -> schema -> language -> csrf -> sql -> view -> session -> api -> admin
```

Session internally loads auth, email, then session. AI and desktop are optional
and absent from aggregate order.

Order matters because listeners share ordered lifecycle events:

- schema registers generated-client loading during `config` at priority 10;
- language and CSRF register services during `config`;
- server and SQL command events appear during `listen`;
- SQL loads generated model listeners during `listen`;
- view selects production/development setup during `config` and adds build;
- session/auth/email establish identity operations and routes;
- API registers webhooks during `listen` and endpoints during `route`;
- admin loads generated model routes during `route`;
- schema, SQL, view, admin, and optional AI append transforms on `idea`.

This is compatibility-sensitive checkout behavior, not a versioned plugin
dependency protocol.

## Package Plugin Pattern
A plugin is a callable receiving the Ingest `Server`. Registration should be
dependency-light and attach lifecycle listeners rather than eagerly do work:

```ts
export default function plugin(ctx: Server) {
  ctx.on('config', ({ ctx }) => ctx.register('service', makeService(ctx)));
  ctx.on('listen', ({ ctx }) => ctx.on('feature-run', action));
  ctx.on('route', ({ ctx }) => ctx.get('/feature', routeAction));
}
```

Use `config` for mechanisms/services, `listen` for reusable capabilities,
`route` for HTTP exposure, and `idea` for transform contribution. Optional
plugins often return when config is absent. Generated-client consumers use
nullable loading so first bootstrap can precede generation.

## Status And Error Behavior
Commands are events and return status objects. Many handlers stop after a prior
non-200 response. Missing prerequisites set response errors. Unknown commands
return 404 and print only in verbose mode. Non-serve/develop errors enter the
shared `error` event and rethrow unless handled with status 200.

## Verification Recipes
```bash
stackpress generate -b config/develop -v -i schema.idea
stackpress migrate -b config/develop -v
stackpress emit profile-search -b config/develop -v --q test
stackpress skills --target codex --dry-run
```

Verify generated availability, selected config, database state, artifacts, and
status. A green event alone does not prove deployment, migration application,
or rendered behavior.

## Source Anchors And Authority
Anchors: root `bin/stackpress.mjs`; server terminal/bin/events/scripts/plugin;
aggregate `packages/stackpress/src/plugin.ts`; package plugins; schema/view/SQL/
AI/desktop event and script entrypoints; template scripts. Source-observed
behavior is authority; existing CLI/plugin docs are coverage benchmarks.
