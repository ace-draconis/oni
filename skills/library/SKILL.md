---
name: library
description: Cross-project knowledge store — search before solving, save after solving. Use PROACTIVELY before tackling any problem that feels familiar or previously solved, and after solving anything that will recur. Triggers on "have we solved this", "do we have a pattern for", "save this", "check the library", or any recurring error, environment quirk, or setup problem.
---

# Library

Never solve the same problem twice.

## Search first — this is the important half

Before solving anything that feels familiar, grep `library/`:

    grep -ril "<symptom keywords>" /var/www/personal/oni/library/

Search the *symptom*, not the fix — that's how the entries are written. If a match
lands, say so and apply it rather than re-deriving. Being told "we hit this in March,
here's the fix" is the entire point of the system.

## Save after solving

Write an entry when a solution will plausibly recur:
- Environment and tooling quirks (WSL, Docker, git, permissions)
- Setup recipes that took real effort to get right
- Patterns worth reusing across projects
- Any bug that cost more than a few minutes to diagnose

Skip anything project-specific with no reuse value — that belongs in the ticket.

`library/fixes/<slug>.md` for problem→solution. `library/patterns/<slug>.md` for
reusable approaches. Template: `templates/library-item.md`.

Write **Problem** in the language of the symptom as encountered — the error text, the
observed behaviour. That phrasing is what makes it findable in six months.

Save as it's solved. Don't batch.
