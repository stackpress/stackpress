# Research Ledger: `@stackpress/idea`

## Scope And Status

Research unit: complete sibling repository `../idea` at package version `0.10.6`.

Status: First deep ledger complete. Parser, compiler, transformer, CLI, examples,
tests, specifications, and VS Code language tooling were inspected. No runtime
proof was required because the relevant flows are explicit in source and tests.
This is research evidence, not promoted context truth.

Load [Detailed Evidence](research-idea-evidence.md) when verifying syntax,
merge behavior, plugin execution, language tooling, or Stackpress intersections.
Skip it when the synthesis below is sufficient.

## Native Purpose
Source fact: Idea is a schema language and transformation toolchain intended to
let one `.idea` file drive multiple plugin-defined outputs.

Evidence-backed interpretation: Idea is a semantic coordination format. It
standardizes how declarations, metadata, composition, and generator discovery
are represented while deliberately refusing to standardize what most metadata
means or which artifacts must be produced.

## Native Vocabulary
| Term | Behavioral meaning |
| --- | --- |
| `.idea` | Permissive schema document containing declarations and nested data. |
| Declaration | `use`, `plugin`, `prop`, `enum`, `type`, or `model`. |
| Attribute | Namespaced metadata preserved structurally for consumers. |
| AST | Source-positioned syntax representation used before compilation. |
| Schema config | JSON-like representation consumed by transforms. |
| `use` | Schema import followed by controlled merge into the local schema. |
| Mutable declaration | Local model/type that can absorb imported fields. |
| Final declaration (`!`) | Local model/type replacement boundary. |
| Plugin | Module receiving merged schema, its config, loader context, and extras. |
| Transformer | Schema loader, import resolver, merger, cache, and plugin runner. |
| Language server | Editor model for diagnostics, completion, hover, and navigation. |

## Behavioral Conclusions
### Syntax And Semantics Are Deliberately Separated

The parser owns declarations, literals, arrays, objects, comments, type
cardinality markers, attributes, and source positions. It preserves attributes
without assigning most of them behavior. Plugins and downstream conventions own
database, UI, validation, API, and other meanings.

Interpretation: Extensibility comes from semantic delegation, not from endlessly
expanding the core grammar. The language remains stable while ecosystems can
develop distinct metadata vocabularies.

### One Source Has Two Useful Representations

The lexer and tree classes produce an ESTree-like, source-positioned AST. The
compiler converts that tree into ordered, JSON-like schema data. `parse()` keeps
composition references; `final()` resolves references and removes `use` and
`prop` scaffolding.

Interpretation: Source tooling and generation are first-class but separate
consumers. Editor features need locations and syntax shape; generators need a
compact semantic data structure.

### Schema Composition Is Extension-Oriented

`use` can load local or package-provided schema files. Props and enums merge by
name with local precedence. Local models and types normally absorb missing
imported fields and attributes; adding `!` makes the local declaration a
replacement boundary. Imported fields are inserted before local fields.

Interpretation: Reuse is designed like layered configuration: packages can
provide a baseline and applications can extend or decisively replace it.

### Generation Is Plugin-Owned And Sequential

Plugin declarations pair module identifiers with arbitrary config. The
transformer loads the merged schema once, resolves plugin modules, and awaits
each default export in declaration order. Every plugin receives the entire
schema, its own config, the transformer/loader, current directory, and optional
host-provided extras.

Interpretation: Idea coordinates generators without prescribing their output
technology. Plugins own artifact semantics and can share host capabilities.

### Editor Intelligence Is A Curated Companion Layer

The VS Code extension uses parser structures but maintains project-level import
resolution, symbols, diagnostics, completion contexts, and a curated attribute
registry. The registry explicitly favors stable known completions over inferring
attributes from whatever document is open.

Interpretation: Permissive files and opinionated tooling coexist. The language
accepts ecosystem growth while an editor profile can teach one stable convention
set without turning it into grammar law.

## Repeated Patterns And Invariants
### P-IDEA-01: Stable Structure, Delegated Meaning

The grammar defines how metadata is carried; plugins define what it does.

Confidence: Direct source and documentation fact.

### P-IDEA-02: Parse, Compile, Transform

Source becomes a positioned tree, then schema data, then plugin-owned artifacts.
Each stage has its own public package/API boundary.

Confidence: Strong source fact.

### P-IDEA-03: Local Precedence With Explicit Finality

Composition defaults to local extension and local-value precedence. `!` is a
small syntax marker for opting out of inherited model/type structure.

Confidence: Source fact; layered-configuration framing is interpretation.

### P-IDEA-04: Schema Files Declare Their Production Pipeline

Plugin declarations live beside the structures and metadata they consume. A
schema can therefore describe both its domain material and intended artifact
producers.

Confidence: Source fact plus evidence-backed interpretation.

### P-IDEA-05: Order Is Preserved Where Generation Needs It

The compiler converts model/type column objects into arrays to preserve source
order, imported columns are prepended in imported order, and plugins execute
sequentially in declaration order.

Confidence: Source fact.

### P-IDEA-06: Host Capabilities Flow Through Extras And Injection

The transformer accepts an injected filesystem/current directory and forwards
arbitrary typed extras to plugins. This lets a framework supply terminal,
project, output-directory, or other capabilities without coupling Idea to them.

Confidence: Strong evidence-backed interpretation.

## Deliberate Tradeoffs And Exclusions
- The grammar is permissive; parser success does not guarantee a plugin
  recognizes or correctly uses an attribute.
- Attribute semantics and cross-field validation are not centralized in Idea.
- Imports are merged into one cached schema, favoring generation simplicity over
  retaining full provenance in the final runtime object.
- Models and types support explicit finality; individual columns currently do
  not have equivalent merge/finality behavior.
- Plugins are sequential and share one mutable schema object, enabling
  coordination but making order and mutation potentially significant.
- `env()` resolves environment values while parsing, making builds
  environment-sensitive unless callers control their environment.
- Editor attribute knowledge is curated separately and can drift from plugin
  conventions or parser versions.

## Unique Or Surprising Concepts
- Package-importable schema files make schema composition parallel code-package
  composition.
- `!` is a declaration-level inheritance boundary rather than a validation or
  nullability operator.
- Attributes are open, namespaced semantic channels rather than grammar keywords.
- Idea supports `.idea` and already-compiled JSON input through the same
  transformer path.
- The language server intentionally overlays stable ecosystem knowledge on a
  permissive core.
- Plugin extras make the transformer embeddable inside a larger framework
  generation lifecycle.

## Stackpress Intersections
Provisional until the final Stackpress pass:

- Stackpress packages ship `.idea` files that applications import as reusable
  schema packages.
- `stackpress-schema` creates an Idea transformer using the server's filesystem
  and working directory, then emits an `idea` event before transformation.
- Schema, SQL, view, admin, and AI packages append their own transform modules to
  the loaded schema during that event.
- The transformer then executes those distributed generators with shared
  `terminal`, ts-morph `project`, and output `directory` extras.
- Stackpress therefore extends Idea's schema-declared pipeline with runtime
  generator discovery while keeping transformer ownership inside each package.

## Potential Deeper Topics
- `IDEA-T01`: Structure-versus-semantics as the ecosystem extension contract.
- `IDEA-T02`: AST and schema config as separate source and generation products.
- `IDEA-T03`: Package-style schema composition, extension, and finality.
- `IDEA-T04`: Schema-local plugin declarations as an artifact production plan.
- `IDEA-T05`: Host-injected generator capabilities through typed extras.
- `IDEA-T06`: Stackpress's event-driven generator discovery over Idea plugins.
- `IDEA-T07`: Metadata namespaces as cross-surface communication channels.
- `IDEA-T08`: Editor profiles over a permissive language core.
- `IDEA-T09`: Ordering, shared mutation, and reproducibility in generation.
- `IDEA-T10`: Environment-sensitive schema values and build determinism.

## Open Questions And Proof Needs
- Which attributes are cross-package contracts versus package-local conventions?
- Do Stackpress generators mutate shared schema beyond appending plugins?
- Is plugin execution order intentionally relied upon between packages?
- How should provenance survive recursive `use` merges for tools and explanations?
- Is `final()` used in Stackpress, or does generation rely on unresolved props?
- How tightly should the editor registry track Stackpress package versions?
