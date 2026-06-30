# AGENTS.md
This project uses AKRS.

Boot: read `akrs/KERNEL.md`, then obey it. Do not execute before boot.
Fast path: trivial or isolated change → Mode 0/1 (skip the full chain).

Source of Truth: `docs/data.md`. The framework under `docs/akrs/framework/` is build-time
only and must not be loaded at runtime.
