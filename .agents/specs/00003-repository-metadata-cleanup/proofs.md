# Proofs

Proofs: not required.

The remaining aggregate CLI question is packaging acceptance, not an unknown
technical design requiring a prototype. Resolve it through the normal
implementation verification sequence: build packages, pack them, place them in
a temporary consumer, and confirm executable resolution.

If the packed consumer disproves the assumption in GAP-001, stop implementation
and reopen the decision between a real aggregate forwarding binary and an
explicit direct server dependency/CLI installation contract.
