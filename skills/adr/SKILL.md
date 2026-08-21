---
name: adr
description: Record architectural decisions — context, options considered, decision, consequences. Use PROACTIVELY the moment a real choice between alternatives is made, especially framework, library, database, deployment, or structural choices. Also triggers on "why did we", "what did we decide", "record this decision", "ADR".
---

# ADR

Scribing the *why*. The code shows what was built; the ADR is the only record of what
was rejected and on what grounds.

## When to write one

The moment a decision is made between genuine alternatives with trade-offs:
framework or library selection, database or storage choice, deployment strategy,
a structural pattern, anything explicitly rejected for a reason.

Write it as the decision happens, while the reasoning is live. Reconstructed
rationale is worth much less.

Skip for choices with no real alternative, and for anything reversible in minutes.

## Format

`library/decisions/ADR-[NNN]-[slug].md` from `templates/adr.md`. Numbering is global
across projects — decisions cross-pollinate.

**Options** must include the ones actually rejected, with the real reason. "Laravel —
rejected, too heavy for shared hosting without build tools" is useful. "Considered
other frameworks" is not.

**Consequences** is the section people skip and later need. What does this make easy,
what does it make hard, and what forces a revisit.

## Answering "why did we..."

Search `library/decisions/` first, then project files. Answer from the record and cite
the ADR. If nothing is recorded, say so — don't reconstruct a plausible rationale and
present it as history.

## Superseding

Never edit a decided ADR to change the outcome. Write a new one and set the old to
`superseded by ADR-NNN`. The trail matters.
