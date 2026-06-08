# 131 Terminal Events

Terminal events let you run named Stackpress behavior without clicking through
a browser page. That matters when you want to inspect a generated action,
debug a data result, or confirm that an event exists before you connect it to a
route or view.

**Previously:** `Events` showed that named behavior can live beside routes.
This lesson uses the command line as another caller of the same event model.

## 131.1. When To Emit Events

Use terminal events when the behavior you want to inspect already has an event
name. A search event, sign-out event, populate flow, or generated model action
can be easier to debug from the terminal because the browser UI is no longer
part of the problem.

The goal is separation. If the terminal event returns the wrong data, inspect
the event, config, generated output, or database path; if the event is correct
but the page is wrong, inspect the route or view that consumes the event.

## 131.2. Event Workflow

The public command shape comes from the CLI reference:

```bash
stackpress emit article-search --b config -v
```

This command asks Stackpress to load the selected bootstrap module, run the
`emit` command, and trigger the `article-search` event. The `--b config` flag
chooses the bootstrap module, and `-v` turns on verbose logging while you are
learning or debugging the flow.

In a scaffolded app, the same kind of event is used by the home page:

```ts
req.data.set('status', 'PUBLISHED');
await ctx.emit('article-search', req, res);
```

This route example is useful because it gives the terminal command a real
project anchor. The browser page and the terminal command are different
callers, but both depend on the named `article-search` behavior being
registered.

## 131.3. Command Map

The terminal runtime turns command-line input into an Ingest request and then
emits the command name as an event. In `packages/stackpress-server/src/Terminal.ts`,
the `run()` method builds a terminal request before it emits the command. That
request is what lets command data show up through the same request shape that
route handlers already use.

```ts
const request = this.server.request({
  data: this.data,
  mimetype: 'terminal/arguments'
});
const response = this.server.response();
const status = await this.server.emit(this.command, request, response);
```

This example explains why terminal commands still feel like Stackpress
requests. The parsed command data becomes `req.data`, the response object is a
normal Stackpress response, and the command name is emitted through the same
server event system.

The `emit` command is one command inside that terminal event system:

```ts
if (process.argv.length < 4) {
  terminal?.verbose && terminal.control.error('Missing event name');
  res.setError('Missing event name');
  return;
}

terminal?.verbose && terminal.control.system(
  `Emitting "${process.argv[3]}"...`
);
await emit(ctx, 3);
```

This command handler checks that an event name exists, prints a verbose message
when verbose mode is enabled, and then delegates to the lower-level emit
script. The event name is `process.argv[3]` because the command shape is
`stackpress emit <event-name>`.

## 131.4. What The Emit Script Does

The lower-level emit script creates a library `Terminal` from the remaining
arguments and resolves the requested event through the server:

```ts
const terminal = new Terminal(process.argv.slice(skip));
const response = await server.resolve(terminal.command, terminal.data);
console.log(JSON.stringify(response, null, 2));
```

This is the part that makes `stackpress emit article-search ...` useful for
inspection. The event response is printed as JSON, so you can see the response
shape without opening a browser route.

The generated client output shows where `article-search` becomes a real event
name:

```ts
export default function listen(emitter: {
  on: (event: string, listener: Function) => any;
}) {
  emitter.on('article-search', search);
}
```

This example comes from the generated `Article/events/index.ts` output. If this
listener does not exist, the terminal command cannot find the event just
because the name looks plausible.

## 131.5. Verbose Output

Verbose mode is useful because it shows command-level progress and missing
command feedback. It does not replace the JSON response, but it helps you see
which terminal path Stackpress is trying to run.

For `stackpress emit`, the source-backed verbose message is:

```text
Emitting "article-search"...
```

This message comes from the `emit` command handler. If you see it, Stackpress
reached the emit command and is attempting to resolve the event name that came
after `emit`.

If the event name is missing, the same handler reports:

```text
Missing event name
```

This failure means the command stopped before resolving an app event. The fix
is to include the event name after `emit`, not to change the generated event
handler.

## 131.6. Common Failures

Most terminal event failures are not terminal-specific. The command is only a
different entry point into app behavior, so the fix usually starts by checking
bootstrap, event registration, and the event's dependencies.

### 131.6.1. Use The Wrong Terminal Command

```bash
stackpress run article-search --b config -v
```

This uses `run` instead of the registered `emit` command. The terminal runtime
resolves the first command word, so verbose mode can report
`Command "<name>" not found.` when no command handler is registered for that
name.

### 131.6.2. Emit An Event That Was Not Registered

```bash
stackpress emit article-search --b config -v
```

This command only works when the selected bootstrap loads the plugin path that
registers `article-search`. For generated model events, generation must have
produced the event module and the app bootstrap must load the generated model
listeners.

### 131.6.3. Debug The Page Before The Event

```ts
const results = await actions.findAll(req.data());
const total = await actions.count(req.data());
res.rows(results, total);
```

This generated event code is where the data operation actually happens. If the
terminal event returns an error response, inspect the event source and its
dependencies before changing the browser page that normally calls it.

## 131.7. Next Step

You should now be able to trace `stackpress emit article-search --b config -v`
from the CLI reference to the terminal runtime, then from the emit command into
the generated event listener. That path is the important lesson: terminal
events are not a second framework, they are another way to call named
Stackpress behavior.

**Next course:** Continue with `Views`. That course returns to browser-visible
output and shows how routes pass data into React-rendered pages.
