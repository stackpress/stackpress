# Research Ledger: `r22n`

## Scope And Status

Research unit: complete sibling repository `../r22n`, version `1.0.10`. Public
API, provider/context/hook/component source, README usage, history, and Stackpress
consumers were inspected. The repository currently has no dedicated test suite.

## Native Purpose

Source fact: r22n is a lightweight, zero-configuration React translation
interface designed for expressive phrase ordering, interpolation, and pluggable
session/language handling.

Interpretation: r22n treats readable source phrases as stable lookup templates
and keeps language-state ownership small enough for a host framework to connect
to its own locale, session, and translation-loading policy.

## Native Vocabulary

| Term | Behavioral meaning |
| --- | --- |
| Source phrase | Default text and translation-map key. |
| Placeholder | Configurable interpolation token, `%s` by default. |
| Translation map | Phrase-to-phrase dictionary for one active language. |
| `template()` | Compiles a phrase into a React-node-preserving interpolator. |
| `_()` | String-oriented phrase translation helper. |
| `t` | Tagged-template translation preserving interpolation order. |
| `Translate` | JSX child-to-phrase adapter preserving embedded React nodes. |
| `changeLanguage` | Replaces active language and translation map in context. |

## Behavioral Conclusions

### The Source Phrase Is Both Fallback And Key

Missing translations return the original phrase. No key registry, namespaces,
resource loader, or build extraction is required. Evidence:
`../r22n/src/hooks/useLanguage.tsx:23-29`; root README.

Interpretation: Authoring remains readable and adoption is incremental, trading
central key governance for direct phrase stability.

### Interpolation Preserves React Structure

Translations split around placeholders. String-only variables return a string;
React nodes return a fragment. The tagged template and `Translate` component
turn interpolation positions or JSX children into the same phrase template.
Evidence: `src/hooks/useLanguage.tsx:23-58`;
`src/components/Translate.tsx:10-49`.

Interpretation: Translation changes word order without flattening links, strong
text, or other React nodes into unsafe HTML.

### Language Switching Replaces One Small Context State

The provider stores only language and one translation map. `changeLanguage`
replaces both; loading, persistence, sessions, negotiation, and fallback chains
belong to the host. Evidence: `src/components/R22nProvider.tsx:12-45`;
`src/context.tsx:10-15`; types.

Interpretation: “Zero configuration” means a minimal runtime contract, not a
complete localization operations platform.

## Repeated Patterns And Invariants

- `P-R22N-01`: Human-readable phrases are executable translation contracts.
  Confidence: source fact.
- `P-R22N-02`: `_`, `t`, and `Translate` converge on one `template()` engine.
  Confidence: source fact.
- `P-R22N-03`: Placeholder order belongs to the translated phrase, enabling
  grammar-specific reordering. Confidence: source fact.
- `P-R22N-04`: Provider state is intentionally replaceable by host policy rather
  than owning loaders or sessions. Confidence: interpretation.
- `P-R22N-05`: All public runtime modules are client-marked, making the browser
  boundary explicit. Confidence: source fact.

## Deliberate Tradeoffs And Exclusions

- No catalogs, namespaces, plural rules, ICU messages, async loading, locale
  fallback chain, extraction, persistence, or server negotiation.
- Phrase changes can invalidate translation keys.
- Duplicate placeholders are positional rather than named.
- The library currently relies on build validation rather than dedicated tests.
- Provider prop changes do not automatically synchronize state after mount;
  callers use `changeLanguage` for runtime changes.

## Unique Or Surprising Concepts

- JSX children can become a translation key while embedded nodes become values.
- Source copy remains visible and functional without a translation catalog.
- One interpolator returns either strings or React fragments according to values.
- Session integration is intentionally a host concern despite motivating the API.

## Stackpress Intersections

- Stackpress view re-exports r22n and places its provider/hooks inside the shared
  client surface.
- Stackpress language config/session handling chooses locale and translations;
  r22n only renders and switches the active client state.
- Generated admin/form/filter views call `_()` for labels and messages, making
  source phrases generated compatibility keys.
- Handwritten auth/session views use the same translation runtime as generated UI.

## Potential Deeper Topics

- `R22N-T01`: Source phrases as readable translation contracts.
- `R22N-T02`: React-node-preserving positional interpolation.
- `R22N-T03`: Host-owned locale policy over a minimal client runtime.
- `R22N-T04`: Generated source phrases as localization compatibility surface.
- `R22N-T05`: Lightweight i18n limits and operational consequences.

## Open Questions

- How does Stackpress synchronize server locale, session, and client provider?
- How are phrase changes detected as translation-breaking changes?
- Are pluralization and fallback intentionally out of Stackpress scope too?
- Which generated messages require stable wording guarantees?

