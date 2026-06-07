# 811 stdio Transport

Run or inspect the local MCP-style stdio transport used by Stackpress AI integrations. The examples stay practical by tying the idea to something you can run, change, or verify.

**Previously:** The previous lesson, `750 Import / Export`, gave you the setup this page builds on. Here, the focus shifts to `stdio Transport` so you can place the next Stackpress surface in the course path.

## 811.1. When To Use Stdio

Local agent integrations often speak through standard input and output. Stdio transport keeps that communication simple enough for tools to launch and inspect without an HTTP server.

## 811.2. Transport Workflow

Find the stdio script:

```text
packages/stackpress-ai/src/scripts/stdio.ts
```

Inspect the matching event:

```text
packages/stackpress-ai/src/events/stdio.ts
```

Run the configured project command only after confirming the app's AI config and generated tools are present. Keep that role in mind as the lesson moves into the concrete shape.

## 811.3. Command Map

The stdio transport is an integration surface. It boots Stackpress AI tooling and communicates with an agent process through stdin/stdout.

## 811.4. Verify Connection

This part of the stdio Transport workflow is easier to follow when the smaller pieces are compared together. The subsections cover Transport, stdio, Generated Tools, so the reader can see how each piece changes the local decision.

### 811.4.1. Transport

A transport is the communication layer between the app's AI tools and an external agent. The nearby example or check shows the project detail affected by this idea.

### 811.4.2. stdio

stdio uses process input and output instead of HTTP. Look for the concept in the Stackpress files, helpers, or runtime behavior in this section.

### 811.4.3. Generated Tools

AI tools can be generated from schema and loaded through the generated client output. The local example shows why that choice matters in an app.

## 811.5. Common Failures

This part of the stdio Transport workflow is easier to follow when the smaller pieces are compared together. The subsections cover Check Tool Generation, Check Config, Keep Logs Careful, so the reader can see how each piece changes the local decision.

### 811.5.1. Check Tool Generation

Run generation and inspect generated tool registries before blaming transport startup. Compare the concrete details to see the practical meaning.

### 811.5.2. Check Config

Confirm the bootstrap config includes the AI plugin and expected client output settings. The examples below turn the concept into concrete Stackpress project surfaces.

### 811.5.3. Keep Logs Careful

stdio protocols are sensitive to extra output. Avoid noisy logging in the transport process.

## 811.6. Next Step

For stdio Transport, focus first on the problem it solves, then use the syntax as the concrete way Stackpress represents that problem. That is why this detail appears in the lesson before reference material.

Read `831 AI Events` and `832 Transform Hooks` to understand runtime and generation sides. That page continues the course path with the next Stackpress surface.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** Continue with `820 Artifacts`. That course picks up from here and moves the learning path forward without turning this page into a full reference.
