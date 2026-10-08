# Project session state contract

Write to the project-specific path printed by `session-start.sh`:
`sessions/<project>.md`. Rewrite it at natural stopping points — after finishing a
task, before switching context, when a ticket changes state. Keep it under 25 lines.

Format:

    # Session state
    **Updated**: YYYY-MM-DD
    **Project**: <name>
    **Task**: <one line — what is being worked on right now>

    ## Open threads
    - <unfinished thing, with enough detail to resume cold>

    ## Next step
    <the single next action>

Rules: overwrite, never append — this is RAM, not a log. Durable history goes to
tickets. Never store machine-specific checkout paths here. If the next step is
unknown, write "awaiting direction" rather than inventing one. A stale session file
is worse than an empty one.
