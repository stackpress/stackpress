# 141 Terminal Events

Trigger Stackpress event behavior from the command line so you can inspect and debug work outside a browser request. The nearby example or check shows the project detail affected by this idea.

**Previously:** The previous lesson, `135 Nest`, gave you the setup this page builds on. Here, the focus shifts to `Terminal Events` so you can place the next Stackpress surface in the course path.

## 141.1. When To Emit Events

Not every app behavior should require clicking through a browser to test. Terminal events let you run named behavior through the same app bootstrap, which makes debugging and automation much easier.

## 141.2. Event Workflow

Run an event:

```bash
stackpress emit article-search --b config -v
```

For an event that expects data, pass the command shape used by your app or template. Then inspect the verbose output and the response data produced by the event.

## 141.3. Command Map

`stackpress emit` boots the app through the selected config module and triggers a named event. This is useful for search, create, populate, integration, and debugging flows.

## 141.4. Verbose Output

This part of the Terminal Events workflow is easier to follow when the smaller pieces are compared together. The subsections cover Event Name, Terminal Entrypoint, Same App Bootstrap, so the reader can see how each piece changes the local decision.

### 141.4.1. Event Name

An event name is the string the app registers and emits. Examples from generated or template code often look like `article-search`, `profile-create`, or `auth-signout`.

### 141.4.2. Terminal Entrypoint

The terminal entrypoint lets you run event code without a browser route. That is useful when the problem is data, generated actions, or event behavior rather than page rendering.

### 141.4.3. Same App Bootstrap

Terminal events still depend on the same config, plugins, generated output, and database settings as the browser app. Compare the concrete details to see the app-level effect.

## 141.5. Common Failures

This part of the Terminal Events workflow is easier to follow when the smaller pieces are compared together. The subsections cover Inspect Search Output, Trigger Populate-Style Work, Debug Missing Events, so the reader can see how each piece changes the local decision.

### 141.5.1. Inspect Search Output

```bash
stackpress emit article-search --b config -v
```

Use this when a page search looks wrong and you want to separate event behavior from view rendering. The following example gives the idea a concrete project shape.

### 141.5.2. Trigger Populate-Style Work

Populate flows often emit create events with configured data. If populate fails, inspect the event named in config.

### 141.5.3. Debug Missing Events

If an event cannot be found, check that the plugin registering it is listed and that generation has run if the event is generated. Keep the idea tied to the concrete project surface in this section.

## 141.6. Next Step

The checkpoint is simple: you can point to where Terminal Events shows up and explain why it matters. That is why this detail appears in the lesson before reference material.

Read `160 Debugging And Inspection` for the broader troubleshooting path. For exact command syntax, use [CLI command details](/reference/cli-reference). That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `151 First React Page`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
