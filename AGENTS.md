# Project Guidelines

## Project Context
- This repository currently contains metadata and external resource references only.
- Primary files in the repo are text files with Arena.site URLs (`Claude2link.txt`, `Link2GemLink.txt`, `MAIN/NewA.txt`).
- There is no source code, build system, test suite, or configuration files present in the repository root.

## What to do first
- If asked to implement, modify, or analyze code, verify whether actual source files exist in the repo.
- If source code is absent, ask the user for the relevant external content or request that they add the missing files.
- Treat the Arena URLs as potential locations for the real project content.

## Build and Test
- No build, install, or test commands are currently available.
- Do not assume a language or framework without explicit user input or files present.

## Conventions
- Preserve the current structure of link/reference files unless the user asks to reorganize the repository.
- Use plain text format for external reference files and avoid introducing unrelated tooling or formats without user approval.

## Agent Behavior
- Be cautious: this repo appears to be a placeholder or pointer repository rather than a complete codebase.
- When providing suggestions, focus on helping the user add real source files or documentation to make the repository actionable.
