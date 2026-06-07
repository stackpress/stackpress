# 330 Vercel

Prepare a Stackpress app for Vercel by separating build output, runtime config, environment variables, and verification. Keep the idea tied to the concrete project surface in this section.

**Previously:** The previous lesson, `320 Local Production`, gave you the setup this page builds on. Here, the focus shifts to `Vercel` so you can place the next Stackpress surface in the course path.

## 330.1. Current Status

A deployment target is a contract between your app and a platform. This page treats Vercel as a planning surface: what the app must build, what the platform must run, and what still needs verification.

## 330.2. Intended Vercel Workflow

Verify locally first:

```bash
stackpress build --b config/build -v
stackpress serve --b config/build -v
```

Then prepare the deployment:

 - build command points to the Stackpress build script
 - runtime entry points to the built server or handler shape your app provides
 - database and secret values are configured as Vercel environment variables
 - public assets are emitted or served from the expected public folder

## 330.3. What Exists Today

Vercel deployment is mostly about matching the platform's build/runtime model to the app's Stackpress build and server entrypoint. The example gives the decision enough context to evaluate it.

## 330.4. What To Verify

This part of the Vercel workflow is easier to follow when the smaller pieces are compared together. The subsections cover Build Command, Runtime Target, Environment Variables, so the reader can see how each piece changes the local decision.

### 330.4.1. Build Command

The build command should run Stackpress with production-oriented config. Use the check to make the idea visible before moving to the next topic.

### 330.4.2. Runtime Target

The runtime target is the server or handler Vercel will execute after build. The same idea shows up through inspectable project surfaces.

### 330.4.3. Environment Variables

Database URLs, session seeds, API secrets, and email credentials belong in deployment environment settings. Keep that role in mind as the lesson moves into the concrete shape.

## 330.5. Open Questions

This part of the Vercel workflow is easier to follow when the smaller pieces are compared together. The subsections cover Check Build Output, Check Serverless Constraints, Check Routes After Deploy, so the reader can see how each piece changes the local decision.

### 330.5.1. Check Build Output

Run the build locally before pushing deployment changes. The nearby example or check shows the project detail affected by this idea.

### 330.5.2. Check Serverless Constraints

If using a serverless runtime, verify that long-lived state, local file writes, and database connections fit the target. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 330.5.3. Check Routes After Deploy

Open a page route, an action route, and a static asset after deployment. The local example shows why that choice matters in an app.

## 330.6. Next Step

Before moving on, connect Vercel to the files, commands, generated output, or runtime behavior around it. Compare the concrete details to see the practical meaning.

Read `350 Lambda / Serverless` for serverless constraints. Use your Vercel project settings as the source of truth for platform-specific fields. It should feel like the next course step, not a separate reference detour.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `340 Netlify`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
