# 421 Config Splitting

Decide whether one config file is enough or whether common, develop, build, and client config files are clearer. The examples stay practical by tying the idea to something you can run, change, or verify.

**Previously:** The previous lesson, `412 Generated Output`, gave you the setup this page builds on. Here, the focus shifts to `Config Splitting` so you can place the next Stackpress surface in the course path.

## 421.1. The Decision

Config starts simple and then begins carrying different jobs: development, build, client generation, secrets, and shared app values. Splitting config is about keeping those jobs readable without over-designing too early.

## 421.2. Recommended Default

A common template shape is:

```text
config/common.ts
config/develop.ts
config/build.ts
config/client.ts
```

Use:

```bash
stackpress serve --b config/develop -v
stackpress build --b config/build -v
stackpress generate --b config/client -v
```

This is the smallest useful version of the idea. Once you can name the moving parts here, the larger version is easier to inspect and debug.

## 421.3. Config Files

Each command loads the config file that matches its job. Shared values stay in `common.ts`; environment-specific values stay in focused files.

## 421.4. Tradeoffs

This part of the Config Splitting workflow is easier to follow when the smaller pieces are compared together. The subsections cover Common Config, Develop Config, Build Config, Client Config, so the reader can see how each piece changes the local decision.

### 421.4.1. Common Config

Common config holds shared brand, database defaults, language, auth, session, and reusable paths. That is why this detail appears in the lesson before reference material.

### 421.4.2. Develop Config

Develop config enables local server and view-engine behavior. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 421.4.3. Build Config

Build config writes production-oriented assets and page output. The same idea shows up through inspectable project surfaces.

### 421.4.4. Client Config

Client config can redirect generated client output into readable inspection folders. The nearby check shows the project-level consequence.

## 421.5. Example Split

This part of the Config Splitting workflow is easier to follow when the smaller pieces are compared together. The subsections cover Keep One File, Split Build Settings, Split Client Output, so the reader can see how each piece changes the local decision.

### 421.5.1. Keep One File

Use one config file while the app is small and there is no confusion. The example gives the idea a concrete file, command, or code shape.

### 421.5.2. Split Build Settings

Create `config/build.ts` when production output paths and mode differ from development. The examples below turn the concept into concrete Stackpress project surfaces.

### 421.5.3. Split Client Output

Create `config/client.ts` when you want readable generated client output such as `client_source`. Use that purpose as the anchor for the local example or check.

## 421.6. Next Step

Use Config Splitting as a guide for choosing which file, command, or generated output to inspect next. The same idea shows up through inspectable project surfaces.

Read `430 Plugin Layout` to pair config structure with local plugin structure. For config fields, use [Config Reference](/reference/config-reference). Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `430 Plugin Layout`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
