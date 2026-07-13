# Decisions And Gaps

## Accepted Decisions

### DEC-001: Keep The Cleanup Narrow

Decision: Correct root package guidance and confirmed manifest/export drift in
one maintenance spec. Keep SQL helpers and package coverage work separate.

Status: Accepted by user instruction.

### DEC-002: Remove Unsupported Declarations

Decision: Prefer removing declarations for files and subpaths that never existed
in tracked source/build history instead of creating placeholder implementations.

Evidence: Current source/build trees are missing the targets, and local history
shows the declarations were introduced without matching files.

Status: Accepted research conclusion; GAP-001 is resolved.

### DEC-003: Correct Package Roles From Current Source

Decision: Describe desktop as active optional; remove the absent `packages/www`
application entry; identify `templates/website` as the current website app;
preserve studio as planning-only.

Status: Accepted from contributor research and user clarification.

## Open Gap

### GAP-001: How should the aggregate runtime CLI be represented?

Question: Can `packages/stackpress/package.json` remove its broken
`"stackpress": "./bin.ts"` bin declaration while installed applications continue
to receive the functional binary from transitive `stackpress-server`, or should
the aggregate package intentionally gain a real forwarding entrypoint?

Assumption to verify: Remove the broken aggregate declaration. The runtime CLI is
owned by `stackpress-server/bin.ts`; the dependency chain already installs that
package and its bin. Verify with a packed consumer rather than relying on hoist
assumptions.

Status: Resolved. A temporary three-package chain modeled aggregate -> middle ->
server, with only server declaring the `stackpress` bin. Installing the packed
aggregate created `node_modules/.bin/stackpress` pointing to the transitive
server binary and executing it returned the server-owned CLI signal.

Decision: Remove the aggregate's broken bin declaration and stale `bin.ts`
file-list entry. Keep `stackpress-server/bin.ts` as the runtime CLI owner.

## Resolved Findings

- API, email, and view list missing `bin.ts` only in `files`; they declare no bin
  command and should remove the stale file-list item.
- Aggregate admin type mappings have no matching source, build output, or runtime
  export and should be removed.
- Schema `config/typemaps` runtime/type mappings have no matching source or build
  output and should be removed.
- These declarations originated without matching tracked implementations; no
  removal history suggests a contract that should be restored.
