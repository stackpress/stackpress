# 100 Develop

Learn the Stackpress runtime path after the first app already answers a
request. This section gives routes, plugins, pages, events, views, and
debugging a course home without forcing a full project structure too early.

**Previously:** `Getting Started` created the smallest app and showed how to
read the first startup logs. This page turns that first success into a map for
the runtime lessons that follow.

## 100.1. Why Development Comes First

Runtime development comes before data modeling and deployment because it gives
the reader visible feedback. A route can answer a browser request before the
app has generated output, a database schema, or a polished folder layout.

That order matters for junior developers. Once they have seen one route load
from one plugin, later concepts have a place to attach instead of feeling like
separate framework facts.

## 100.2. What This Level Covers

The `100` lessons move from app behavior into the pieces that make runtime work
organized. They keep the project shape small while teaching where behavior
lives and how requests turn into responses.

The path is:

 - `110 Plugins` introduces app-owned behavior boundaries.
 - `120 Pages` explains request, response, data surfaces, session, and the
   nested data helper behind those surfaces.
 - `130 Events` introduces named work that can run outside one route.
 - `140 Views` connects route data to React-rendered pages.
 - `150 Hooks` explains request, response, config, listen, and route lifecycle
   hooks.
 - `160 Debugging And Inspection` teaches a repeatable way to inspect failures.

## 100.3. What Stays Unopinionated

This level still avoids prescribing a full folder structure. The reader should
first learn what plugins, pages, events, and views do before being told where
every larger-project file should live.

Project organization begins later in `500 Project Structure`. By then, the
reader has seen enough runtime, data, generated output, and deployment context
for folder rules to solve a real problem.

## 100.4. How To Use This Level

Read this level as the runtime foundation. Each child page should answer a
concrete question: where app behavior loads, how a request is handled, how work
is emitted, how a view receives data, or how to inspect a broken flow.

Keep `002 Getting Started` nearby while reading. If a later example feels too
large, compare it back to the first `plugin.ts` route and ask which new piece
was added.

**Learning checkpoint:** Before moving on, make sure you can explain why
Stackpress teaches runtime behavior before data, generation, and project
structure. You should also be able to name the runtime groups in this level.

**Next course:** Continue with `Plugins`. That course explains the boundary
Stackpress uses to load app behavior.
