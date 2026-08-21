---
name: deck
description: Build a presentation deck — sprint review, technical proposal, demo walkthrough — as a navigable HTML Artifact presentable from the browser. Triggers on "slides", "deck", "presentation", "present this", "sprint review", "pitch this".
---

# Deck

## Before building

Establish audience and purpose — they determine everything. A sprint review for
stakeholders and a technical proposal for engineers share no structure. If it isn't
obvious from context, ask; guessing wastes the whole deck.

## Content

Pull from the record: `tickets/done/` for what shipped, ADRs for proposals (their
context/options/decision maps directly onto problem/alternatives/recommendation),
project files for architecture.

One idea per slide. A slide is a headline plus the evidence for it — never a
paragraph, never a wall of bullets. If a slide needs more than ~30 words of body,
it's two slides.

For proposals, follow the ADR arc: problem → options with trade-offs → recommendation
→ consequences. It's already how Aniki thinks.

## Building

Load `artifact-design` first, always. For architecture or flow slides, load
`artifact-diagramming` — a real diagram of the mechanism beats a bulleted description
of it. Charts: load `dataviz` before writing any chart code.

Keyboard navigation (arrows, space), one slide per viewport, readable from across a
room — body text no smaller than 20px. Must work in both light and dark themes.

Publish via Artifact and hand over the link.
