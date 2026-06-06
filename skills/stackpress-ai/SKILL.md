---
name: stackpress-ai
description: Alias for stackpress-router. Use when a task is about Stackpress and an agent should route the request to the appropriate Stackpress skill.
---

# Stackpress AI

This skill is an alias for `stackpress-router`.

When this skill triggers, immediately follow the `stackpress-router` workflow:

1. Determine whether the task is Stackpress-related.
2. Inspect minimal local context when routing depends on project files.
3. Select the narrowest matching Stackpress specialist skill.
4. Hand off to that skill instead of duplicating its instructions.

If `stackpress-router` is unavailable in the current environment, use the local
Stackpress skill list and choose the closest specialist skill directly.
