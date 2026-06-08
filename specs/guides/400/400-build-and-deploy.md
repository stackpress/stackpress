# 400 Build And Deploy

Move from local development into generated output, production builds, and deployment targets. This level teaches how Stackpress exposes the shape of an app so build tools, hosting adapters, and deployment checks can reason about routes, views, events, assets, and runtime entrypoints.

**Previously:** The previous course, `Custom Generators`, showed how idea
input can drive custom generated output. This course keeps that same
source-to-output thinking, then applies it to schema changes, production
builds, and deployment targets.

## 400.1. Why Build Comes After Idea

Build and deployment make more sense after you have seen runtime code, data
access, and idea generation. A production build is not just a command; it
packages assumptions about routes, views, assets, generated files,
configuration, and the runtime that will answer requests.

Think of the build step like packing a project bag before leaving the house. If the bag is missing the route entrypoint, generated client files, public assets, or environment values, the deployment target cannot guess what you meant to bring.

## 400.2. What This Level Covers

This section introduces the build path in small pieces. `410 Generate And Build` starts with route and view metadata because that is the information bundlers and deployment scripts need before they can organize output.

After that, `411 Generated Artifacts` and `412 Client Source` explain how to
inspect generated files without treating them as the main source of truth.
`420 Local Production` covers the confirmed local build path, `430 Schema
Changes` applies the source-to-output loop to database shape, and `440 Vercel`,
`450 Netlify`, and `460 Lambda / Serverless` use Ingest examples to discuss
provider-specific adapter shapes.

## 400.3. The Source-To-Output Rule

Generated output is evidence, not the place where most product changes should start. If generated files are wrong, the usual fix is to change the schema, config, plugin, route, or view source that produced them.

That rule protects the project from one-off edits that disappear during regeneration. It also gives junior developers a repeatable debugging path: find the wrong output, trace it back to the source that produced it, change the source, then build again.

## 400.4. How Deployment Changes The Runtime Question

Local development usually feels like one server process running on your machine. Deployment asks a sharper question: what kind of runtime will call the app, and what shape must the app return?

Some targets run a long-lived Node server, while others call a handler with a platform-specific event or a native `Request`. The deployment lessons compare those shapes so you can recognize whether a provider needs a plain TypeScript build, a WHATWG request handler, or an adapter that converts platform input and output.

## 400.5. How To Verify This Level

A build is only useful when the resulting app can answer the routes and serve the assets you expect. The deployment pages therefore talk about checks, logs, configuration, and known source limits instead of treating the provider name as proof.

Use this level to learn how to gather evidence. By the end, you should be able to explain what changed between local development, generated output, local production, and deployed runtime behavior.

**Learning checkpoint:** Before moving on, make sure you can explain why generated output should be inspected but not casually hand-edited. You should also know that deployment success needs route, asset, config, handler, and log evidence.

**Next course:** Continue with `Generate And Build`. That course explains the metadata that makes build and deployment tooling possible.
