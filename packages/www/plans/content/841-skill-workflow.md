# 841 Skill Workflow

Map a product request to the next Stackpress skill in the recommended workflow. The goal is to keep AI-assisted app work sequenced, so discovery, implementation, and verification do not collapse into one vague prompt.

**Previously:** The previous lesson, `832 Transform Hooks`, gave you the setup this page builds on. Here, the focus shifts to `Skill Workflow` so you can place the next Stackpress surface in the course path.

## 841.1. Skill Purpose

Stackpress skills work best when each one owns a clear phase. The workflow keeps discovery, coordination, scaffolding, schema authoring, plugin work, and verification from collapsing into one vague prompt.

## 841.2. Use It When

Use this order:

 1. `stackpress-app-discovery`
 2. `stackpress-app-coordinator`
 3. `stackpress-app-scaffold`
 4. `stackpress-idea-authoring`
 5. generation commands
 6. `stackpress-plugin-router`
 7. plugin implementation skills
 8. `stackpress-app-verification`

## 841.3. Inputs

Each skill owns one phase. That keeps product discovery, schema work, handwritten plugins, generation, and verification from collapsing into one unclear task.

## 841.4. What It Produces

This section separates the outputs that matter most in a skill workflow. Discovery clarifies the app, coordination sequences the build, and verification checks evidence before the next phase starts.

### 841.4.1. Discovery

Discovery turns a vague product request into a buildable brief. Use it before writing schema or plugin code because the product boundaries are still being decided.

### 841.4.2. Coordination

Coordination sequences scaffold, schema, generation, plugin, and verification work. It prevents the build from skipping ahead before the required inputs are ready.

### 841.4.3. Verification

Verification checks evidence before moving to the next phase. The point is to prove the app state with files, commands, generated output, or runtime behavior instead of assuming the phase is done.

## 841.5. Handoff

This section shows the handoff moments where the next skill should take over. Use the handoff to keep each phase small enough to verify.

### 841.5.1. Start From A Vague Idea

Use `stackpress-app-discovery`. It turns the initial request into a brief with entities, flows, auth choices, and open questions.

### 841.5.2. Route A Feature

Use `stackpress-plugin-router` when a feature may belong in schema, runtime plugin code, pages/views, or generator code. Routing the feature first prevents handwritten code from swallowing work that should have been generated.

### 841.5.3. Check A Phase

Use `stackpress-app-verification` before treating a phase as complete. The skill should point to evidence, such as generated files, passing commands, working routes, or inspected output.

## 841.6. Verification

Before moving on, connect the skill workflow to the files, commands, generated output, or runtime behavior around it. The skill order is useful only when each phase leaves evidence for the next phase to trust.

**Next step:** Read `842 App Discovery Skill` for the first workflow step. Read it as the continuation of the course sequence, not as a standalone lookup page.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `842 App Discovery Skill`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
