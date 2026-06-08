# 313 Plugins

Understand where plugin declarations belong in `.idea` files and where Stackpress runtime plugins belong in TypeScript. The word plugin appears in both places, but the timing and responsibility are different.

**Previously:** The previous course, `Use`, showed how idea files compose schema data. This course separates parser-level idea plugin declarations from Stackpress package plugins that register generation transforms.

## 313.1. Idea Plugin Declarations

The Idea specification supports `plugin` declarations. The declaration key is a module path, and the block becomes the plugin configuration object.

```idea
plugin "./plugins/schema-diagram.mjs" {
  output "./generated/schema.mmd"
}
```

This example is a generic Idea plugin declaration. It tells the transformer about a generation plugin module and gives that plugin configuration data, but it does not register a server route or handle a request.

## 313.2. Stackpress Generation Plugins

Stackpress packages often connect to generation through a TypeScript plugin's `idea` lifecycle instead of asking app authors to write raw plugin declarations. The plugin registers a transform path into the schema plugin map.

```ts
ctx.on('idea', async ({ req }) => {
  const transformer = req.data('transformer');
  const schema = await transformer.schema();
  schema.plugin[`${dirname}/transform`] = {};
});
```

This example is shortened from the Stackpress AI plugin pattern. The runtime plugin listens during the `idea` phase, adds its transform entry, and lets the normal generation pipeline call that transform later.

## 313.3. Runtime Plugins Are Different

Runtime plugins register behavior during server phases such as `config`, `listen`, or `route`. They are TypeScript modules loaded by the app plugin system, not idea declarations inside `schema.idea`.

This distinction prevents a common mistake. If you need a route, view, service, event listener, or integration at app runtime, an idea plugin declaration is the wrong tool; use the normal Stackpress plugin system instead.

## 313.4. When To Edit Idea Plugin Config

Edit idea plugin declarations only when the plugin documentation says the app should configure generation that way. Generic Idea examples show the format, but Stackpress package-specific conventions must come from the package or generator source.

If the plugin is a Stackpress package that registers its own transform during `idea`, app authors may only need the package plugin installed and configured. In that case, adding a manual `plugin ... {}` block can duplicate or bypass the intended setup.

## 313.5. Mistakes To Avoid

The main mistake is treating every use of the word `plugin` as the same thing.
Idea plugin declarations, Stackpress generation hooks, and runtime plugins run
at different moments, so mixing them creates confusing docs and broken apps.

### 313.5.1. Invent A Stackpress Idea Plugin Block

```idea
plugin "stackpress/admin" {
  route "/admin"
}
```

This looks plausible, but this lesson should not teach it as a Stackpress
pattern without a confirmed generator source. A plugin declaration is only
safe to document when the generator supports the module path and configuration
fields being shown.

### 313.5.2. Put Runtime Behavior In `.idea`

```idea
plugin "./plugins/routes.mjs" {
  get "/health"
}
```

This example blurs generation and runtime behavior. Route handlers, database
connections, MCP transports, and UI routes belong in TypeScript plugins or
generated output, not parser-level schema declarations.

### 313.5.3. Change Generation Config Without Regenerating

```idea
plugin "./plugins/schema-diagram.mjs" {
  output "./generated/schema.mmd"
}
```

Changing this block changes generation input, not an already-generated file.
After editing generation configuration, run the generation workflow again and
inspect the output that the plugin is supposed to produce.

**Learning checkpoint:** Before moving on, make sure you can explain the difference between a generic Idea `plugin` declaration, a Stackpress TypeScript plugin with an `idea` hook, and a runtime plugin that handles app behavior.

**Next course:** Continue with `Modeling`. That course returns to the app schema itself and shows how product language becomes declarations.
