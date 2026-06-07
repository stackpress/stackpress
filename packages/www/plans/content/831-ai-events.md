# 831 AI Events

Register or inspect runtime AI event handling in the Stackpress AI package. The example gives the idea a concrete file, command, or code shape.

**Previously:** The previous lesson, `820 Artifacts`, gave you the setup this page builds on. Here, the focus shifts to `AI Events` so you can place the next Stackpress surface in the course path.

## 831.1. When To Use AI Events

AI runtime behavior still needs normal app entrypoints. Stackpress AI uses events to start transports such as HTTP, SSE, and stdio through the app's existing event model.

## 831.2. Event Workflow

Inspect:

```text
packages/stackpress-ai/src/events
```

Look for:

```text
http.ts
sse.ts
stdio.ts
```

Then inspect how the AI plugin registers those events. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

## 831.3. Command Or Tool Map

The AI runtime exposes named events that can start or coordinate transport behavior. That context prepares the reader for the more specific form that follows.

## 831.4. Verify

This part of the AI Events workflow is easier to follow when the smaller pieces are compared together. The subsections cover Runtime Event, Transport Event, Tool Registry, so the reader can see how each piece changes the local decision.

### 831.4.1. Runtime Event

A runtime event is behavior registered while the app is running. Keep the idea tied to the concrete project surface in this section.

### 831.4.2. Transport Event

A transport event starts a communication mode such as HTTP, SSE, or stdio. The nearby example or check shows the project detail affected by this idea.

### 831.4.3. Tool Registry

Runtime AI behavior may load generated tool registries from client output. Compare the concrete details to see the app-level effect.

## 831.5. Common Failures

This part of the AI Events workflow is easier to follow when the smaller pieces are compared together. The subsections cover Inspect Event Registration, Emit A Known Event, Separate Runtime From Generation, so the reader can see how each piece changes the local decision.

### 831.5.1. Inspect Event Registration

Open the AI plugin and event files before changing runtime behavior. The following example gives the idea a concrete project shape.

### 831.5.2. Emit A Known Event

Use `stackpress emit` only when the app config and event name are known. The examples stay practical by tying the idea to something you can run, change, or verify.

### 831.5.3. Separate Runtime From Generation

Do not put tool generation logic inside runtime event handlers. Keep that role in mind as the lesson moves into the concrete shape.

## 831.6. Next Step

The important checkpoint is knowing where AI Events belongs in the Stackpress workflow. The nearby example or check shows the project detail affected by this idea.

Read `832 Transform Hooks` for generation-time AI tool output. That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `832 Transform Hooks`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
