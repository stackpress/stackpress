# 320 Local Production

Build the app and run a production-like local server before deploying it. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

**Previously:** The previous lesson, `312 Client Source`, gave you the setup this page builds on. Here, the focus shifts to `Local Production` so you can place the next Stackpress surface in the course path.

## 320.1. When To Use Local Production

Development mode is forgiving by design. A local production check catches problems that only appear after build steps, asset paths, generated files, and runtime assumptions are closer to deployment.

## 320.2. Build

Run:

```bash
stackpress build --b config/build -v
stackpress serve --b config/build -v
```

If your project has scripts, use:

```bash
npm run build
npm run preview
```

Use this as the concrete version of the explanation above. The part to copy is the structure; the part to change is the value that matches your app.

## 320.3. Run Production Locally

`build` created production-oriented output through the build config. `serve` started a server from a chosen bootstrap module so you can inspect the built app locally.

## 320.4. Verify Routes And Assets

This part of the Local Production workflow is easier to follow when the smaller pieces are compared together. The subsections cover Build Config, Preview, Environment Parity, so the reader can see how each piece changes the local decision.

### 320.4.1. Build Config

Build config usually sets production mode and output paths for assets, client scripts, page scripts, and view rendering. The local example shows why that choice matters in an app.

### 320.4.2. Preview

Preview or local production serve verifies the built app without deploying it yet. Compare the concrete details to see the practical meaning.

### 320.4.3. Environment Parity

Use environment variables that match the deployment target as closely as possible. The examples below turn the concept into concrete Stackpress project surfaces.

## 320.5. Common Failures

This part of the Local Production workflow is easier to follow when the smaller pieces are compared together. The subsections cover Verify Static Assets, Verify Database Access, Keep Development And Build Config Separate, so the reader can see how each piece changes the local decision.

### 320.5.1. Verify Static Assets

Open pages that use images, CSS, and client scripts. Missing assets often show up during production-style serving.

### 320.5.2. Verify Database Access

Run a route that reads data. Build success alone does not prove the runtime database connection is correct.

### 320.5.3. Keep Development And Build Config Separate

Use separate config files when development needs Vite/HMR behavior but production needs emitted assets and page output. That is why this detail appears in the lesson before reference material.

## 320.6. Next Step

The useful shift is recognizing Local Production as a pattern in files, commands, and runtime behavior. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

Read `330 Vercel`, `340 Netlify`, or `350 Lambda / Serverless` for deployment-specific planning. Use that page to keep moving through the learning path before switching into reference mode.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `330 Vercel`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
