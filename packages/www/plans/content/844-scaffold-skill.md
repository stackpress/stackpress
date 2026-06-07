# 844 Scaffold Skill

Use `stackpress-app-scaffold` to create the baseline app files before schema, generation, or plugin work. Use that purpose as the anchor for the local example or check.

**Previously:** The previous lesson, `843 App Coordinator Skill`, gave you the setup this page builds on. Here, the focus shifts to `Scaffold Skill` so you can place the next Stackpress surface in the course path.

## 844.1. Skill Purpose

Scaffolding creates the starting folder and file shape. It should prove the app can exist before anyone tries to implement product-specific business logic.

## 844.2. Use It When

A scaffold should create baseline files such as:

```text
package.json
config/*
plugins/*
public/*
schema.idea
tsconfig.json
uno.config.ts
```

Then verification should confirm the app can install, generate, and boot according to the scaffold's expected workflow. The same idea shows up through inspectable project surfaces.

## 844.3. Inputs

The scaffold created the starting contract for later schema and plugin work. Keep the idea tied to the concrete project surface in this section.

## 844.4. What It Produces

This part of the Scaffold Skill workflow is easier to follow when the smaller pieces are compared together. The subsections cover Baseline, Scaffold Asset, No Business Logic Yet, so the reader can see how each piece changes the local decision.

### 844.4.1. Baseline

A baseline is the minimal complete app shape for the workflow. The example gives the decision enough context to evaluate it.

### 844.4.2. Scaffold Asset

The skill owns scaffold assets and templates used to create the app. Use the check to make the idea visible before moving to the next topic.

### 844.4.3. No Business Logic Yet

Product-specific schema and plugin behavior should come after the scaffold. The same idea shows up through inspectable project surfaces.

## 844.5. Handoff

This handoff is about proving the scaffold is ready before product-specific work starts. Inspect generated files, confirm `.gitignore` behavior, and then hand the project to idea authoring when the baseline is stable.

### 844.5.1. Inspect Generated Files

Check that config, plugins, public assets, and schema files exist. Keep that role in mind as the lesson moves into the concrete shape.

### 844.5.2. Check `.gitignore`

Use the scaffold's `gitignore` source for the generated `.gitignore` behavior. The nearby example or check shows the project detail affected by this idea.

### 844.5.3. Hand Off To Idea Authoring

After scaffold verification, move to schema work. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 844.6. Verification

You do not need the full reference yet. For Scaffold Skill, focus on recognizing the pattern and knowing where to look next.

**Next step:** Read `845 Idea Authoring Skill`. Use that page to keep moving through the learning path before switching into reference mode.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `845 Idea Authoring Skill`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
