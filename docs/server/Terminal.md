# `Terminal`

`Terminal` is the Stackpress command runner class exported from
`stackpress/server`. It extends the lower-level library terminal parser and
connects parsed command arguments to a Stackpress server instance.

## Import

```ts
import { Terminal } from 'stackpress/server';
```

## Instantiation

```ts
const terminal = new Terminal(process.argv.slice(2), server);
```

The first argument is the command-line args array. The second argument is the
Stackpress server that will load config, plugins, and command events.

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `server` | `Server<any, any, any>` | Server instance used to resolve commands. |
| `verbose` | `boolean` | Whether verbose output is enabled. |
| `config` | `string \| null` | Config/bootstrap module selected by command args. |
| `brand` | `string` | Label used for terminal output. |
| `cwd` | `string` | Current working directory used by terminal flows. |

## Methods

### `bootstrap()`

Loads the command config and prepares the server.

**Returns** a promise resolving to the terminal instance.

### `run()`

Runs the parsed command through the server.

**Returns** a promise resolving to a response status object.

## Example

```ts
const terminal = new Terminal([ 'emit', 'article-search', '-v' ], server);
await terminal.bootstrap();
const status = await terminal.run();
```

This example runs an event from terminal arguments. In normal app usage, the
packaged Stackpress CLI creates this class for you.

## Related

 - [Server Module](../server.md)
 - [CLI Reference](../cli-reference.md)
