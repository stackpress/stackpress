# 521 Config Splitting

Config splitting is the moment when one launch plan becomes several focused
launch plans. A small Stackpress app can start with one config file because
there are not many choices to coordinate. As the app grows, development,
production build, generated client inspection, and shared app settings begin to
pull config in different directions.

The goal is not to create more files because a framework scaffold did it. The
goal is to make each command load the clearest config for the job it is doing,
while shared values still live in one place.

**Previously:** `Config` introduced configuration as the app bootstrap and
orchestration surface. This lesson turns that idea into a decision: keep one
config file while it stays readable, then split config when different commands
need meaningfully different settings.

## 521.1. The Decision

The decision is whether one config file is still helping the reader understand
the app. If development mode, build output, client generation, database paths,
and shared brand/session settings all live in one large object, a junior
developer has to mentally filter the file every time they run a command.

Split config when the command tells a different story. Development config can
opt into live tooling, build config can write production assets, and client
config can redirect generated TypeScript into an inspection folder.

## 521.2. Recommended Default

Use one config file until the difference between command modes becomes
visible. Once the app has separate development, production build, and generated
client workflows, use a scaffolded app shape. The tree below names the four
files used by the scaffolded app.

```text
config/common.ts
config/develop.ts
config/build.ts
config/client.ts
```

This folder shape separates shared values from command-specific values.
`common.ts` owns reusable paths and shared config areas, while `develop.ts`,
`build.ts`, and `client.ts` each export the config and bootstrap function for a
specific workflow.

A scaffolded app's scripts show which command loads which file:

```json
{
  "dev:start": "dotenv -e .env -- stackpress develop --b config/develop -v",
  "build": "stackpress build --b config/build -v",
  "generate:client": "stackpress generate --b config/client -v"
}
```

This example matters because `--b` chooses the bootstrap module. When a command
uses `--b config/client`, it is not reading the same final config as
`--b config/build`; it is loading the config file shaped for client generation.

## 521.3. Config Files

Each split file should have an obvious job. If you cannot explain why a config
file exists in one sentence, it is probably too early to split that part out.

| File | Job | Confirmed scaffold example |
| --- | --- | --- |
| `config/common.ts` | Shared values reused by other config files | `cwd`, `.build`, `public`, `brand`, `client`, `database`, `server`, `session`, `view` |
| `config/develop.ts` | Local development server and live view behavior | `server.mode: 'development'`, Vite-style dev routes, `clientRoute: '/client'` |
| `config/build.ts` | Production-oriented build output | `server.mode: 'production'`, `assetPath`, `clientPath`, `.build/views` page output |
| `config/client.ts` | Readable generated client inspection output | `client.lang: 'ts'`, `module: 'client-source'`, `build: path.join(common.cwd, 'client-source')` |

This table should feel like a map, not a rule that every app must copy
immediately. The key is that every file earns its place by making a command
easier to understand.

## 521.4. Tradeoffs

Split config reduces noise inside each command path, but it can also hide a
shared value if the reader forgets to check `common.ts`. The pattern works best
when shared defaults stay in `common.ts` and command-specific files override
only the areas that need to differ.

### 521.4.1. Common Config

`common.ts` is where shared values should gather. In a scaffolded app, the
file defines reusable paths before exporting larger config areas.

```ts
export const cwd = process.cwd();
export const build = path.join(cwd, '.build');
export const assets = path.join(cwd, 'public');
export const modules = path.join(cwd, 'node_modules');
```

This example gives the rest of config a shared vocabulary for important paths.
When `build.ts` needs the public assets folder or `.build` folder, it can reuse
these exports instead of rebuilding path strings in several files.

### 521.4.2. Develop Config

`develop.ts` is for the local feedback loop. It keeps development mode and
live view-engine behavior together, so the command that starts the development
server can load one focused bootstrap.

```ts
server: {
  ...common.server,
  mode: 'development',
  build: common.build
}
```

This example starts with shared server defaults and then chooses development
mode. That keeps host, port, and current working directory in `common.ts` while
the development-specific file owns the runtime mode for local work.

### 521.4.3. Build Config

`build.ts` is for production-oriented output. A scaffolded app changes server
mode and tells the view engine where to write assets, client scripts, and page
output.

```ts
engine: {
  assetPath: path.join(common.assets, 'assets'),
  clientPath: path.join(common.assets, 'client'),
  pagePath: path.join(common.cwd, '.build/views')
}
```

This example is different from development config because it writes output to
real build folders. Assets and client scripts go under `public`, while rendered
page output uses `.build/views`.

### 521.4.4. Client Config

`client.ts` is for inspecting generated client output. A scaffolded app
overrides the shared client config so generated TypeScript is written into a
readable folder.

```ts
client: {
  ...common.client,
  lang: 'ts',
  module: 'client-source',
  package: 'client-source',
  build: path.join(common.cwd, 'client-source')
}
```

This example makes the generated client output easy to inspect during
development. The common config still has a package-like target for normal app
resolution, but `client.ts` changes the output target for the inspection
workflow.

## 521.5. Example Split

The most useful split is usually gradual. Start from the command that feels
confusing, pull only that command's unique config into its own file, and keep
shared values imported from `common.ts`.

### 521.5.1. Keep One File

Keep one config file when all commands can honestly share the same config
without hiding important differences. This is common in a very small app that
only needs a development server and does not yet have a separate build or
client inspection workflow.

```ts
const config: Config = {
  server: {
    mode: 'development'
  }
};
```

This example is intentionally small. It matches the config reference shape and
keeps the first app readable because there is only one important runtime
choice.

### 521.5.2. Split Build Settings

Create `config/build.ts` when production output stops looking like development
mode. The clearest signal is that the build command needs output paths that the
development server does not use.

```bash
yarn build
```

In a scaffolded app, this command runs `stackpress build --b config/build -v`.
That means the build workflow reads `config/build.ts`, uses production mode,
and writes view output to the paths declared by build config.

### 521.5.3. Split Client Output

Create `config/client.ts` when you want generated client code to be readable
and inspectable. A scaffolded app uses this split so developers can inspect
`client-source` without treating the generated package target as handwritten
source.

```bash
yarn generate:client
```

In a scaffolded app, this command runs `stackpress generate --b config/client
-v`. That bootstrap changes the generated client module and build path to
`client-source`, which is why the generated files are easy to open during
debugging.

## 521.6. Next Step

The important habit is to split config around command intent, not around file
count. If a split file makes the command easier to explain, it is doing useful
work. If it only makes the app harder to trace, keep the config together until
the need becomes real.

Read `530 Plugin Layout` next. Config chooses which app settings and command
paths are active, while plugin layout shows where local runtime behavior should
live once those commands bootstrap the app.

**Learning checkpoint:** You should be able to explain why a scaffolded app
has `common.ts`, `develop.ts`, `build.ts`, and `client.ts`. You should also be
able to identify which config file a Stackpress command loads by reading the
command's `--b` value.
