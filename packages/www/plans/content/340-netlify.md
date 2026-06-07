# 340 Netlify

Prepare a Stackpress app for Netlify by matching Stackpress build output to the platform's build and runtime model. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

**Previously:** The previous lesson, `330 Vercel`, gave you the setup this page builds on. Here, the focus shifts to `Netlify` so you can place the next Stackpress surface in the course path.

## 340.1. Current Status

Netlify deployment planning starts by asking what kind of output the app can produce and what the platform expects to execute. This lesson keeps the focus on that fit instead of pretending there is a finished adapter where the source does not define one.

## 340.2. Intended Netlify Workflow

Run the production-style build locally:

```bash
stackpress build --b config/build -v
```

Identify:

 - build command
 - publish or asset output location
 - server or function entrypoint
 - environment variables
 - database connection behavior

## 340.3. What Exists Today

You separated Stackpress output from Netlify configuration. That makes it easier to decide which platform setting should point to which app artifact.

## 340.4. What To Verify

This part of the Netlify workflow is easier to follow when the smaller pieces are compared together. The subsections cover Publish Output, Function Entrypoint, Secrets, so the reader can see how each piece changes the local decision.

### 340.4.1. Publish Output

Static assets must land where Netlify can serve them or where the server/function can reference them. That context prepares the reader for the more specific form that follows.

### 340.4.2. Function Entrypoint

If the app uses Netlify Functions, the Stackpress request handler must be adapted to that function shape. Keep the idea tied to the concrete project surface in this section.

### 340.4.3. Secrets

Use Netlify environment variables for credentials and seeds. Do not commit production secrets into config.

## 340.5. Open Questions

This part of the Netlify workflow is easier to follow when the smaller pieces are compared together. The subsections cover Build Before Deploy, Verify Function Routes, Keep Config Explicit, so the reader can see how each piece changes the local decision.

### 340.5.1. Build Before Deploy

Run the build locally and inspect output before changing Netlify settings. The nearby example or check shows the project detail affected by this idea.

### 340.5.2. Verify Function Routes

After deploy, test both static assets and dynamic routes. Compare the concrete details to see the app-level effect.

### 340.5.3. Keep Config Explicit

Use a build config file so deployment behavior does not depend on development defaults. The following example gives the idea a concrete project shape.

## 340.6. Next Step

This gives you the first mental handle for Netlify; later pages can add more detail without starting from zero. The examples stay practical by tying the idea to something you can run, change, or verify.

Read `350 Lambda / Serverless` for request/response adaptation concerns. Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `350 Lambda / Serverless`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
