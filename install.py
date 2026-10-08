#!/usr/bin/env python3
"""Install Oni's user-level instructions, skills, and Claude Code hooks."""

from __future__ import annotations

import json
import os
import shlex
import sys
import tempfile
from pathlib import Path
from typing import Any


START_MARKER = "<!-- oni:begin -->"
END_MARKER = "<!-- oni:end -->"


def write_text_atomically(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    mode = path.stat().st_mode & 0o777 if path.exists() else 0o644
    with tempfile.NamedTemporaryFile(
        mode="w", encoding="utf-8", dir=path.parent, delete=False
    ) as temporary_file:
        temporary_file.write(content)
        temporary_path = Path(temporary_file.name)
    os.chmod(temporary_path, mode)
    os.replace(temporary_path, path)


def merge_managed_block(path: Path, content: str) -> None:
    existing = path.read_text(encoding="utf-8") if path.exists() else ""
    managed_block = f"{START_MARKER}\n{content.rstrip()}\n{END_MARKER}"

    if START_MARKER in existing or END_MARKER in existing:
        if existing.count(START_MARKER) != 1 or existing.count(END_MARKER) != 1:
            raise ValueError(f"Managed Oni markers are malformed in {path}")
        before, remainder = existing.split(START_MARKER, 1)
        _, after = remainder.split(END_MARKER, 1)
        result = f"{before.rstrip()}\n\n{managed_block}{after}"
    else:
        result = f"{existing.rstrip()}\n\n{managed_block}\n" if existing else f"{managed_block}\n"

    if result != existing:
        write_text_atomically(path, result)


def is_oni_hook_command(command: object, script_name: str) -> bool:
    return (
        isinstance(command, str)
        and command.startswith("bash -lc ")
        and command.rstrip(" '\"").endswith(f"/oni/hooks/{script_name}")
    )


def install_claude_loader(home: Path, oni_root: Path) -> None:
    loader_path = home / ".claude" / "CLAUDE.md"
    import_line = f"@{oni_root / 'CLAUDE.md'}"
    existing = loader_path.read_text(encoding="utf-8") if loader_path.exists() else ""
    if import_line not in existing.splitlines():
        merge_managed_block(loader_path, import_line)

    settings_path = home / ".claude" / "settings.json"
    try:
        settings: dict[str, Any] = (
            json.loads(settings_path.read_text(encoding="utf-8"))
            if settings_path.exists()
            else {}
        )
    except json.JSONDecodeError as error:
        raise ValueError(f"Cannot parse {settings_path}: {error}") from error

    if not isinstance(settings, dict):
        raise ValueError(f"Expected a JSON object in {settings_path}")
    hooks = settings.setdefault("hooks", {})
    if not isinstance(hooks, dict):
        raise ValueError(f"Expected 'hooks' to be an object in {settings_path}")

    for event, script_name in (
        ("SessionStart", "session-start.sh"),
        ("Stop", "auto-persist.sh"),
        ("SessionEnd", "session-end.sh"),
    ):
        script_path = oni_root / "hooks" / script_name
        inner_command = f"exec {shlex.quote(str(script_path))}"
        command = f"bash -lc {shlex.quote(inner_command)}"
        accepted_commands = {
            command,
            f"bash -lc {shlex.quote(str(script_path))}",
            f"bash -lc '{script_path}'",
        }
        event_entries = hooks.setdefault(event, [])
        if not isinstance(event_entries, list):
            raise ValueError(f"Expected hooks.{event} to be a list in {settings_path}")
        is_installed = False
        for entry in event_entries:
            if not isinstance(entry, dict):
                raise ValueError(
                    f"Expected hooks.{event} entries to be objects in {settings_path}"
                )
            entry_hooks = entry.get("hooks", [])
            if not isinstance(entry_hooks, list):
                raise ValueError(f"Expected hooks in {settings_path} to be lists")
            for hook in entry_hooks:
                if not isinstance(hook, dict):
                    continue
                previous_command = hook.get("command")
                if isinstance(previous_command, str) and (
                    previous_command in accepted_commands
                    or is_oni_hook_command(previous_command, script_name)
                ):
                    hook["command"] = command
                    is_installed = True
        if not is_installed:
            event_entries.append(
                {"hooks": [{"type": "command", "command": command}]}
            )

    serialized_settings = json.dumps(settings, indent=2) + "\n"
    if (
        not settings_path.exists()
        or settings_path.read_text(encoding="utf-8") != serialized_settings
    ):
        write_text_atomically(settings_path, serialized_settings)

    install_skills(home / ".claude" / "skills", oni_root / "skills")


def install_copilot_context(home: Path, oni_root: Path) -> None:
    instruction = f"""# Oni shared assistant context

The Oni memory repository is installed at `{oni_root}`.
You are Neon, the cross-project assistant configured for Aniki.

Before substantive work or answering questions about prior work, read
`{oni_root / 'CLAUDE.md'}` and `{oni_root / 'core/persona.md'}`,
`{oni_root / 'core/principles.md'}`, and `{oni_root / 'core/stack.md'}`. Check
relevant skills in `{oni_root / 'skills'}` and project notes in
`{oni_root / 'projects'}`.

Use the project-specific live state file `{oni_root}/sessions/<repository-name>.md`,
where the repository name is the current workspace's Git root basename. Claude
Code's session-start hook prints this path. If it does not exist, use
`{oni_root}/templates/session.md` when creating one. Keep state machine-neutral.

Copilot does not run Oni's Claude Code lifecycle hooks. Do not claim that work was
automatically committed or pushed; report the persistence state accurately.
"""
    merge_managed_block(home / ".copilot" / "copilot-instructions.md", instruction)
    install_skills(home / ".copilot" / "skills", oni_root / "skills")


def install_skills(destination: Path, source: Path) -> None:
    destination.mkdir(parents=True, exist_ok=True)
    for skill_path in sorted(source.iterdir()):
        if not skill_path.is_dir():
            continue
        link_path = destination / skill_path.name
        if link_path.is_symlink() and link_path.resolve() == skill_path.resolve():
            continue
        if link_path.exists() or link_path.is_symlink():
            raise ValueError(
                f"Refusing to replace existing skill path that is not an Oni link: {link_path}"
            )
        link_path.symlink_to(skill_path, target_is_directory=True)


def main() -> int:
    oni_root = Path(__file__).resolve().parent
    home = Path.home()
    try:
        install_claude_loader(home, oni_root)
        install_copilot_context(home, oni_root)
    except (OSError, ValueError) as error:
        print(f"Oni install failed: {error}", file=sys.stderr)
        return 1

    print(f"Installed Oni instructions and skills from {oni_root}")
    print(
        "Claude Code hooks are registered; Copilot Agent Host loads global "
        "instructions and skills."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
