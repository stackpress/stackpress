# 843 App Coordinator Skill

Use `stackpress-app-coordinator` to sequence scaffold, schema, generation, plugins, and verification. The example gives the decision enough context to evaluate it.

**Previously:** The previous lesson, `842 App Discovery Skill`, gave you the setup this page builds on. Here, the focus shifts to `App Coordinator Skill` so you can place the next Stackpress surface in the course path.

## 843.1. Skill Purpose

After discovery, the app needs sequencing. The coordinator decides which phase comes next, what evidence completes it, and when to hand work to a narrower skill.

## 843.2. Use It When

Use the coordinator to plan:

```text
discovery brief
scaffold
schema.idea
generate
plugin work
runtime verification
```

This example gives the idea something concrete to inspect. Look for the file, helper, or value that changed; that is the part you would adjust first in your own app.

## 843.3. Inputs

The coordinator kept the build order explicit instead of mixing scaffold, schema, plugin, and verification decisions. Use the check to make the idea visible before moving to the next topic.

## 843.4. What It Produces

This part of the App Coordinator Skill workflow is easier to follow when the smaller pieces are compared together. The subsections cover Phase, Handoff, Gate, so the reader can see how each piece changes the local decision.

### 843.4.1. Phase

A phase is one part of the app build, such as scaffold or schema authoring. The examples below turn the concept into concrete Stackpress project surfaces.

### 843.4.2. Handoff

A handoff sends a specific artifact and context to the skill that owns the next task. That context prepares the reader for the more specific form that follows.

### 843.4.3. Gate

A gate is the evidence needed before moving on. Keep the idea tied to the concrete project surface in this section.

## 843.5. Handoff

This part of the App Coordinator Skill workflow is easier to follow when the smaller pieces are compared together. The subsections cover Decide When To Generate, Decide When To Write Plugins, Decide When To Verify, so the reader can see how each piece changes the local decision.

### 843.5.1. Decide When To Generate

Generate after schema input is ready enough to produce useful output. The nearby example or check shows the project detail affected by this idea.

### 843.5.2. Decide When To Write Plugins

Write runtime plugins when behavior does not belong in schema or generated output. Compare the concrete details to see the app-level effect.

### 843.5.3. Decide When To Verify

Verify after each phase that affects files, generation, or runtime behavior. The following example gives the idea a concrete project shape.

## 843.6. Verification

The important part is the reason behind App Coordinator Skill: it gives the app a clearer way to organize one kind of behavior. Keep the idea tied to the concrete project surface in this section.

**Next step:** Read `844 Scaffold Skill` for the baseline app phase. It should feel like the next course step, not a separate reference detour.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `844 Scaffold Skill`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
