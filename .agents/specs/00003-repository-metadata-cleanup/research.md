# Research

## R-001: Root Package Roles

Status: Complete first pass on 2026-07-12.

Findings:

- Yarn resolves `stackpress-desktop` as a package workspace.
- Desktop has source, tests, build/package scripts, plugin exports, and a blog
  template consumer; it is active optional, not planning-only.
- `packages/www` is absent.
- `templates/website` is the current website application workspace.
- `packages/stackpress-studio` has plans but no manifest and remains
  planning-only.

Affected: DEC-003.

## R-002: Missing Manifest Targets

Status: Complete first pass on 2026-07-12.

Confirmed absent from source and build output:

- `packages/stackpress/bin.ts`;
- API/email/view `bin.ts` files listed in package `files`;
- aggregate `cjs/esm/admin` type targets;
- schema `cjs/esm/config/typemaps` runtime and declaration targets.

Local history shows the aggregate bin/admin declarations and schema typemap
declarations were introduced with their packages without matching tracked files.
No tracked deletion supplies evidence that implementations should be restored.

Affected: DEC-002, GAP-001.

## R-003: CLI Ownership And Packaging

Status: Complete on 2026-07-12.

Findings:

- `packages/stackpress-server/bin.ts` is the implemented runtime CLI.
- The dependency-free root `bin/stackpress.mjs` delegates monorepo runtime
  commands to that server binary.
- The aggregate package depends transitively on `stackpress-server` through the
  default package chain.
- Current source therefore points to server as runtime CLI owner, but a packed
  consumer check was required before removing the aggregate bin declaration.

Acceptance result:

- built local server, middle, and aggregate tarballs with the bin declared only
  by the transitive server package;
- installed the aggregate tarball into an empty local consumer without network;
- npm installed all three package levels;
- `node_modules/.bin/stackpress` linked to the server package's `bin.js`;
- executing the command returned `server-owned-cli`.

Affected: GAP-001.

## Planned Verification

1. Parse every edited manifest as JSON.
2. Run affected workspace builds.
3. Run aggregate and affected package dry-run pack checks and inspect file lists.
4. Install or assemble a temporary packed consumer without network dependency
   where possible; confirm `stackpress` CLI resolves to the server owner.
5. Import affected root/subpath surfaces through CJS, ESM, and declarations as
   applicable.
6. Run `git diff --check` and Agent Workspace validation.
7. Confirm SQL helpers and test-coverage files remain untouched.
