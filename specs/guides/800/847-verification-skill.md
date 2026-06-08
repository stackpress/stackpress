# 847 Verification Skill

Use `stackpress-app-verification` as the phase gate before moving on. Verification matters because a Stackpress phase is complete only when current files, command output, generated artifacts, plugin wiring, or runtime behavior prove it.

**Previously:** The previous course, `Plugin Skills`, covered lane selection and implementation ownership. This course closes the AI skill sequence by showing how to prove that a phase is real enough for the next phase to trust.

## 847.1. Evidence Before Advancement

The verification skill's core rule is simple: no phase advancement without fresh phase evidence. A plan, a confident summary, or an old command result is not enough when the current files may have changed.

Verification does not demand full end-to-end QA for every step. It asks for the smallest convincing evidence that the current phase exists and matches the intended behavior.

## 847.2. Phase Evidence

Different phases need different proof:

```text
Scaffold: package.json, schema.idea, config, plugins, public files, and replaced placeholders
Schema: intended models, fields, relations, validation, and useful metadata
Generation: successful command and output in the configured destination
Plugin wiring: files exist, package.json.plugins is correct, lifecycle hook matches the role
Runtime: route, event, view, or generated import is reachable
TypeScript: direct compile or focused check when handwritten TS changed
```

This list explains why one green check cannot prove every phase. A successful generation command does not prove a route is reachable, and a file existing on disk does not prove the plugin is registered.

## 847.3. Verification Order

The verification skill checks phases in a specific order: scaffold, schema,
generation, plugin wiring, runtime reachability, and direct TypeScript evidence
when handwritten TypeScript changed. That order matters because later phases
often depend on earlier phases being real.

```text
1. scaffold evidence
2. schema evidence
3. generation evidence
4. plugin wiring evidence
5. runtime reachability evidence
6. direct TypeScript evidence
```

This order prevents a common mistake: proving a route exists before proving the
generated files or plugin registration it depends on. You only need to verify
the phases that are supposed to exist already, but you should not skip an
earlier phase when downstream work depends on it.

## 847.4. A Verification Report

A good verification pass reports the phase, evidence checked, pass or fail, blocking gaps, and the next action. That shape keeps the result useful even when verification fails.

```text
Phase: plugin wiring
Evidence checked: plugins/catalog/plugin.ts exists; package.json.plugins includes ./plugins/catalog/plugin
Result: fail
Blocking gap: plugin uses route behavior but no route hook is registered
Next action: add the route hook or reclassify the plugin role before runtime testing
```

This example is more useful than saying "plugin mostly works." It names the phase, the inspected evidence, the exact gap, and the next action that would let the workflow continue. That makes the failed check actionable instead of vague.

## 847.5. Focus By Feature Type

Different feature types need different proof. A schema-heavy feature should
focus on model coverage, relation correctness, and generation readiness, while
a runtime integration should focus on plugin registration, hook placement, and
minimal reachable behavior.

```text
Schema-heavy feature: check models, relations, and generation readiness.
Route/view feature: check route registration, page handler, view binding, and page reachability.
Generation plugin feature: check idea hook, transform output, package exports, and runtime reconnection.
```

This example helps the student choose evidence that matches the work. A
route/view feature is not verified only because `schema.idea` looks good, and a
generation plugin is not verified only because `plugin.ts` exists.

## 847.6. Environment And Cleanup Checks

Verification also needs to know which local environment it is proving. If the
app relies on a file-backed `.build` database, the check should use the normal
local database target unless an alternate target is intentional and explained.

```text
Expected: app uses its normal .build database workflow
Risk: verification accidentally used a second disposable database
```

This example matters because a route can appear to work against the wrong
local database while the real app state is still broken. When the database
target changes, the verification report should say why.

If verification required starting a local dev server, stop it before claiming
completion unless the user asked to keep it running. A passed check should not
leave a hidden process bound to a port.

## 847.7. Failed Verification Is Useful

A failed verification pass is not wasted work. It tells the developer where the workflow stopped being proven, which is exactly the moment to pause before building more code on top of weak assumptions.

For example, if generated output is missing, downstream plugin behavior may not be meaningful yet. The right response is to fix the schema, config, or generation command first, then rerun the verification that failed.

## 847.8. Mistakes To Avoid

Verification mistakes usually come from letting weak evidence stand in for a
strong claim. Match the check to the requirement, and say exactly what remains
unproven.

### 847.8.1. Use A Narrow Check For A Broad Claim

```text
Claim: plugin wiring is complete.
Weak check: plugins/catalog/plugin.ts exists.
Better check: package.json.plugins registers it and the expected hook runs.
```

This example shows why evidence must match the claim. A file on disk is only
one part of plugin wiring, while registration and runtime reachability prove
more of the phase.

### 847.8.2. Use Stale Evidence

```text
Old evidence: generation passed before schema.idea changed.
Current need: rerun generation and inspect the new output.
```

This example prevents a common handoff error. A green command from before the
latest source change cannot prove the current generated output is valid.

### 847.8.3. Hide Partial Verification

```text
Passed: scaffold files exist.
Not checked: runtime route reachability.
```

If scaffold passed but runtime reachability was not checked, say exactly that
so the next handoff does not treat the whole app as complete. Partial evidence
is useful when it is labeled clearly, but it becomes misleading when it is
reported as a full pass.

### 847.8.4. Skip TypeScript Evidence

```text
Claim: handwritten page work is ready.
Missing proof: no compile pass covered the changed TSX file.
```

This example keeps verification honest. The right check does not need to be a
full test suite every time, but it should prove the changed TypeScript can be
compiled by the relevant project.

**Learning checkpoint:** Before finishing this sequence, make sure you can describe the evidence needed for scaffold, schema, generation, plugin wiring, runtime reachability, and TypeScript checks. You should also be able to write a failed verification report that gives the next developer a clear next action.

**Next course:** This is the final planned course in the current AI sequence. Use it as the closing verification habit before returning to reference material or revisiting earlier Stackpress workflows.
