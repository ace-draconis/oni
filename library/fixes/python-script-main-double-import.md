---
name: python-script-main-double-import
type: fix
tags: [python, imports, exceptions, cli, hooks]
project: squad-brain
date: 2026-10-27
---

## Problem
A Python file run as a script (`python3 bin/squad.py ...`) is loaded as `__main__`. When a
helper module it uses does `import squad`, Python loads the same file a second time as a
separate module, `squad`. Classes are duplicated: `__main__.SquadError` and
`squad.SquadError` are different types. An exception raised by objects created in the
script is not caught by `except SquadError` inside the helper's copy, so error handling
silently fails. In this case, offline and "not provisioned" notices were dropped.

Unit tests miss this because they `import squad` once, so only one copy exists.

## Solution
Alias the running script as its module name before anything imports it:

    if __name__ == "__main__":
        sys.modules.setdefault("squad", sys.modules[__name__])
        sys.exit(main())

Add a test that runs the entry point the way production does (`subprocess.run` with
`sys.executable` and the script path), not only in-process imports.

## Why it works
`import squad` checks `sys.modules` first. With the alias in place it returns the already
running `__main__` module, so there is one set of classes and `except` clauses match.
