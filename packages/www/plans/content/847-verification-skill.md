# 847 Verification Skill

Use `stackpress-app-verification` as the phase gate before moving on. Verification matters because a Stackpress phase is only complete when the current files, commands, generated output, or runtime behavior prove it.

**Previously:** The previous lesson, `846 Plugin Skills`, gave you the setup this page builds on. Here, the focus shifts to `Verification Skill` so you can place the next Stackpress surface in the course path.

## 847.1. Skill Purpose

A phase is not complete because it sounds complete. Verification checks evidence: files, schema readiness, generated output, plugin wiring, and runtime behavior.

## 847.2. Use It When

Use verification after each phase:

```text
scaffold files exist
schema.idea is ready
generation emitted expected output
plugins are registered
routes or events are reachable
```

Run the smallest command that proves the phase:

```bash
stackpress generate --b config -v
stackpress generate --b config/client -v
stackpress push --b config -v
```

The commands are examples of evidence-producing checks. They do not prove every possible feature, but they do prove whether generation and database-facing setup can run from the current app state.

## 847.3. Inputs

Verification turned a claim into evidence. If evidence is missing, the phase is not complete yet.

## 847.4. What It Produces

This section explains what verification produces besides a yes-or-no answer. It separates evidence, phase gates, and weak assumptions so the reader can tell the difference between proof and confidence.

### 847.4.1. Evidence

Evidence is file state, command output, generated output, route response, event output, or test output. It should be current, inspectable, and tied to the phase being checked.

### 847.4.2. Phase Gate

A phase gate is the point where work must be proven before the next phase starts. It prevents later work from depending on an app state that only sounded complete.

### 847.4.3. Weak Assumption

A weak assumption is a claim that has not been checked against current files or runtime behavior. Verification should either replace the assumption with evidence or keep the phase open.

## 847.5. Handoff

This section shows where verification fits into handoff. Scaffold, generation, and runtime checks each prove a different part of the app before another skill or developer builds on it.

### 847.5.1. Verify Scaffold

Check expected files and scripts exist. A scaffold is not ready for schema or plugin work if the baseline files are missing or named incorrectly.

### 847.5.2. Verify Generation

Run generation and inspect emitted files and exports. If generation fails, fix that source problem before treating downstream runtime behavior as meaningful.

### 847.5.3. Verify Runtime

Start or serve the app and hit the relevant route or event. Runtime verification proves that the app can use the files and generated output it now has.

## 847.6. Verification

For Verification Skill, focus first on the problem it solves: preventing unsupported claims from becoming handoff decisions. The skill is useful because it asks for evidence before moving to the next phase.

Use this page as the closeout checklist for Stackpress app-building workflows. The final habit is to ask, "What proves this phase is done?" before starting the next one.

**Learning checkpoint:** Before moving on, make sure you can explain the main problem this lesson solved and point to where the idea appears in a Stackpress project. You do not need the full reference yet; the goal is to recognize the pattern and know what to inspect next.

**Next course:** This is the last leaf course in the current content plan. Use it as the final verification point before returning to the broader guide or reference material.
