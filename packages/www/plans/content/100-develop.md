# 100 Develop

Use this course to get a developer from zero to a working Stackpress runtime
loop: route, plugin, event, view, response, and debugging.

This section should stay mostly unopinionated about final project structure.
Teach the runtime first. The recommended folder structure comes later in
`400 Project Structure`.

## 100 Develop

Stackpress apps grow through small runtime pieces. A route handles a request, a
response carries results or errors, a plugin groups app behavior, and a view
renders server-provided data.

**Checkpoint**

The reader can point to the handwritten runtime code that makes a page work.

## 110 Scaffold

Start with the smallest useful app shape. The first visible success is a route
that returns a response.

Avoid explaining the whole folder structure here. At this level, the scaffold
only needs to prove that Stackpress can run app code.

**Course work**

- create or inspect the baseline app files
- add one route handler
- run the app
- verify the route in the browser or terminal

## 113 Dev Server

The development server connects route handling with local rendering. It should
feel like a normal app loop: edit code, reload, inspect the result.

Teach the command and expected result. Leave detailed server exports and
adapter APIs to reference.

**Checkpoint**

The reader can start the app locally and verify that a route or page changed.

## 120 Plugins

Plugins are how Stackpress keeps app behavior separated. Instead of putting all
runtime behavior in one file, a plugin can own related routes, events, config,
and integrations.

**Course work**

- add a local plugin
- register one route or event
- understand what belongs in the plugin versus the page view

## 121 Composition

Stackpress loads framework behavior through an aggregate plugin, then lets the
app add local plugins around it.

The useful mental model is simple:

- framework plugins provide Stackpress capabilities
- local plugins provide app-specific behavior
- config decides what gets wired together

**Checkpoint**

The reader can explain why local app behavior should not be mixed into one
monolithic runtime file.

## 122 Local Plugins

Local plugins should group behavior by purpose. Common groups include app
routes, store registration, page events, integration logic, and custom
generation helpers.

**Course work**

- move one route or event into a focused local plugin
- name the plugin after the app concern it owns

## 123 Plugin Config

Plugin config is how app-wide choices reach plugin behavior. At this level,
teach the pattern, not the complete config shape.

**Course work**

- add one small plugin option
- read the option inside plugin code
- use reference for exact config fields

## 130 Pages

A page route prepares the response and view data needed to render a page.

The page handler should do server work. The view should render the prepared
state. This keeps data loading and presentation separate.

**Checkpoint**

The reader can add a page handler and connect it to a React view.

## 131 Request

The request gives route code access to user input: path parameters, query
values, body data, method, headers, cookies, and session state.

Teach request usage through real route decisions. Save the complete request API
for reference.

**Course work**

- read a path or query value
- branch behavior from request input
- validate missing or invalid input

## 132 Response

The response carries the outcome of route work. It can contain results, errors,
status, redirects, cookies, session data, and render instructions.

**Course work**

- return a result payload
- redirect after an action
- surface a validation error

## 133 Data Surfaces

Stackpress has several data surfaces. Keep them distinct:

- request data is user input
- response results are the main output
- response view data is page/config data for rendering
- app or plugin data belongs to the runtime context

**Checkpoint**

The reader can choose where a value belongs before passing it to a view.

## 134 Session

Session access matters when route or view behavior depends on the current user.
Teach the common pattern first: load the active session, check what the user can
do, and pass only needed state to the view.

**Course work**

- read the current session in a route
- read session-backed view state in a page

## 135 Nest

Nest-style composition is a side path for readers who already understand normal
routes. It can help organize controller-like behavior, but it should not be the
first routing model.

**Checkpoint**

The reader can recognize when Nest-style organization is useful and how it maps
back to normal route handling.

## 140 Events

Events are for reusable work that should not live inside one route. A route can
emit an event, and another part of the app can handle it.

**Course work**

- emit one event from a route
- handle the event in a plugin
- inspect the response or side effect

## 141 Terminal Events

Terminal events expose app behavior through command-line workflows. They use
the same event model, but the entry point is a terminal command instead of an
HTTP request.

**Checkpoint**

The reader can trigger a simple event from the terminal and inspect output.

## 150 Views

Stackpress views are React-rendered pages that receive server-provided props.
Layouts create provider boundaries, and hooks read request, response, session,
config, language, and theme data below that boundary.

## 151 First React Page

The basic pattern is:

- `Head` renders page metadata when needed
- `Page` chooses a layout and passes server props through
- `Body` renders content and uses provider-backed hooks

**Checkpoint**

The reader can render a page and add a title or metadata.

## 152 Server Props

The main server props are:

- `data`
- `session`
- `request`
- `response`
- `styles`

Teach what each prop is for. Leave exact types to reference.

## 153 Layouts

Layouts are page shells. They provide consistent structure and create the
provider tree needed by hooks.

The key rule: hooks such as `useResponse()`, `useConfig()`, `useSession()`, and
`useLanguage()` belong below the layout provider, usually inside `Body` or its
children.

## 154 Language

Language support connects config, server props, layout providers, and
`useLanguage()`.

**Course work**

- add one translation
- render translated content in a view

## 155 Theme

Theme values should flow through layouts and components instead of being
hard-coded everywhere.

**Checkpoint**

The reader can make one small visual change through the theme path.

## 156 Notifier

Notifier behavior turns response errors, flash messages, and client flows into
visible feedback.

**Course work**

- set a success or error message
- show it after a route action or redirect

## 160 Debugging And Inspection

Debug Stackpress by checking the right layer:

- route behavior
- event handlers
- response data
- generated output
- database state
- rendered view props

**Checkpoint**

The reader can diagnose one broken route or mismatched generated output without
editing generated files directly.

## Related Reference

- Server reference
- HTTP reference
- Plugin reference
- View reference
- View Client reference
- Session reference

