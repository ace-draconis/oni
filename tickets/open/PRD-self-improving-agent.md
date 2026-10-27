## Title
Self-improving personal agent with pluggable models

## Status
Proposed

## Problem
Teams that want an AI assistant today must either adopt a third-party agent product or build nothing at all. Third-party agents are hard to get approved: they bring unvetted code, unclear data handling, and behaviour the organisation cannot inspect or control. Without an approved option, each engineer re-explains their context, conventions, and preferences to a general-purpose assistant in every session, and nothing they teach it carries forward. The organisation also has no evidence on which to judge whether a self-hosted agent is safe and useful enough to adopt.

## Goals
- A working proof of concept that runs fully on a local machine with a local model, with no data leaving it by default.
- The agent's personality and working rules are defined in a single editable persona document, without code changes.
- The agent improves measurably over repeated use by proposing new skills and remembered facts, each approved by the user.
- Every change the agent makes to its own skills or memory is reviewable and reversible.
- The proof of concept is demonstrable to a decision-making group in under fifteen minutes.

## Non-goals
- Multi-user or team deployment; the proof of concept serves one user.
- A graphical or web interface; the proof of concept is command-line only.
- Fine-tuning or training models; improvement happens through skills and memory, not model weights.
- Autonomous changes without approval; the agent never edits its own skills or memory unasked.
- Feature parity with existing commercial agents.

## Users / User Stories
As an engineer, I need an assistant that remembers my conventions and past decisions so that I stop repeating context every session.

As an engineer, I need to choose between a local model and an approved hosted model so that I can balance privacy, cost, and capability per task.

As an engineer, I need to shape the assistant's persona and rules in a plain document so that it behaves the way my work requires.

As a decision-maker, I need to see what the agent learned, when, and with whose approval so that I can judge whether it is safe to adopt.

## Requirements
1. The agent must work with a locally hosted model and require no internet connection in that mode.
2. The agent must support hosted models through an API key, enabled only by explicit configuration.
3. The agent must load its persona and rules from a single editable document at startup.
4. The agent must not modify its persona document.
5. The agent must discover available skills and load a skill's full instructions only when it is used.
6. The agent must use tools, including tools provided by external tool servers following an open standard protocol.
7. The agent must ask for confirmation before any tool action that changes files or runs commands.
8. After a task, the agent must be able to propose a new skill, an edit to an existing skill, or a new remembered fact about the user.
9. No proposed skill or memory change may take effect without the user's explicit approval.
10. Every approved change must be recorded with its date and reason, and be reversible in a single step.
11. The agent must recall relevant past conversations and remembered facts when they apply to the current task.
12. The user must be able to view, edit, and delete anything the agent remembers about them.

## Success Metrics
- Runs end to end on a single laptop with a local model, with zero outbound network calls in local mode.
- Over two weeks of personal use, at least five agent-proposed skills or facts are approved and reused in later sessions.
- A repeated task needs fewer user corrections in week two than in week one.
- A live demonstration covers persona change, model switch, tool use, and an approved self-improvement, in under fifteen minutes.

## Open Questions
- Project name.
- Which local model is the baseline for the demonstration, given that smaller models handle multi-step tool use poorly.
- Which hosted providers, if any, the organisation would consider approvable, so the demonstration shows a realistic configuration.
