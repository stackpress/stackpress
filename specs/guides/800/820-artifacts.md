# 820 Artifacts

Treat AI-generated artifacts as drafts, generated output, or verification
evidence depending on how they were produced. The important question is not
whether an artifact looks polished; it is whether the current Stackpress
project proves where that output belongs.

**Previously:** `stdio Transport` showed how an agent can connect to
Stackpress tools locally. This course focuses on what happens after an agent,
skill, transform, or generation command produces something a developer needs
to inspect.

## 820.1. What You Are Looking For

An artifact is a produced thing that should move the workflow forward. It
might be a handoff brief, a drafted `schema.idea`, generated client output, a
plugin file, or verification evidence. Each of those can be useful, but each
one belongs to a different layer.

The safe habit is to identify the producer before trusting the artifact. A
coordinator handoff is not generated output, a generated file is not the source
of truth, and a verification note is not proof until it names the evidence it
checked.

## 820.2. Where Artifacts Live

Stackpress does not currently expose a confirmed AI artifact storage contract
in `packages/stackpress-ai`. That means this page should not invent a special
artifact folder, retention rule, or API. Use the artifact's job to decide
where to inspect it.

The confirmed sources give three useful buckets:

 - Handoff artifacts describe the next phase, the artifact to produce, and the
   constraints that matter.
 - Generated artifacts live in configured client or build output and must be
   exported intentionally when runtime needs them.
 - Verification artifacts are evidence records that state what was checked,
   whether it passed, and what remains blocked.

This is less magical than a single artifact folder, but it is safer for junior
developers. The location follows the workflow layer, so the review starts by
asking what kind of output was produced.

## 820.3. Inspect Artifact Output

Start by naming the artifact and the source that produced it:

```text
Artifact: generated Article tool registry
Producer: stackpress generate through the AI transform
Expected layer: generated client package output
```

This inspection record is small, but it prevents a common mistake. If the
artifact came from generation, you should inspect the generated destination and
package exports; if it came from an agent draft, you should compare it against
the app source before accepting it as maintained code.

Generated artifacts need an extra runtime check when another plugin consumes
them. The plugin-generator guidance says runtime should load generated
artifacts through the normal client plugin path instead of rebuilding them from
schema at runtime.

```ts
ctx.on('listen', action(async ({ ctx }) => {
  const client = ctx.plugin('client');
  const generated = await client(true);
  if (!generated) return;
}));
```

This example shows the reconnection pattern. The runtime tolerates missing
generated output during early setup, but when the artifact does exist it should
be reachable through the generated client package surface.

## 820.4. Expected Evidence

Verification is the point where an artifact stops being just a claim. The
verification skill requires direct evidence, a pass or fail result, blocking
gaps, and the next action when the check fails.

For a generated artifact, useful evidence includes:

 - the generation command completed successfully
 - the expected files appeared in the configured output location
 - root exports, package exports, or registries expose the generated surface
 - runtime code imports or loads the generated surface through the expected
   client path

For a drafted source artifact, useful evidence is different. Check the source
contract it is supposed to change, then verify the smallest behavior that
proves the draft actually works in the app.

## 820.5. Fix The Source

Do not edit generated output as the durable fix unless you are debugging the
generator itself. Stackpress drift-control guidance keeps the source of truth
separate from generated or evidence-only files.

```text
Wrong fix: edit client-source/Article/components/form/TitleFormField.tsx
Better fix: change title metadata in schema.idea and regenerate
```

This example keeps ownership clear. The generated form field can show you what
happened, but the durable change belongs in the schema metadata or generator
source that produced the field.

Handoff artifacts need the same discipline. If a handoff says "scaffold a
runtime plugin," verify the plugin entry, lifecycle hook, route or event
registration, and reachable behavior before treating the handoff as complete.

## 820.6. Next Step

The lesson to carry forward is that artifacts are evidence candidates, not
automatic truth. Name the producer, inspect the correct layer, and verify the
artifact before accepting it into maintained source or runtime behavior.

**Learning checkpoint:** Before moving on, make sure you can explain the
difference between a handoff artifact, generated artifact, and verification
artifact. You should also be able to name the evidence needed before accepting
each one.

**Next course:** Continue with `Hooks`. That course separates runtime and
generation extension points, while staying honest about which AI hook behavior
is confirmed by source.
