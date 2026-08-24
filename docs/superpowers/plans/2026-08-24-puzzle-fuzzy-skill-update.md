# Puzzle Fuzzy Skill Guidance Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the Puzzle Fuzzy skill with stable frontend scrolling and dialog guidance, Lucide-only icon usage, conditional architecture defaults, Electron Builder preference, missing production practices, and a clear commit/validation workflow.

**Architecture:** Keep the skill self-contained in `SKILL.md`, with the README documenting invocation and cross-platform validation. Treat React, Electron Builder, soft deletion, Docker Compose/Postgres, middleware order, and post-MVP structured logging as conditional defaults rather than universal mandates.

**Tech Stack:** Markdown, YAML frontmatter, Codex skill validator, Git.

## Global Constraints

- Official documentation, standards, explicit user requirements, and existing repository conventions take precedence over this skill.
- Virtual scrolling and custom scrollbar presentation must preserve keyboard, pointer, touch, focus, accessibility, and stable layout behavior.
- Do not hand-write SVG or use input-method emoji as icons; use the appropriate Lucide package for the framework.
- Prefer Electron Builder for new Electron packaging; do not migrate existing Tauri/Electron Forge projects without a task-specific reason.
- Preserve unrelated worktree changes and never commit secrets or generated temporary artifacts.

---

### Task 1: Update the skill instructions

**Files:**
- Modify: `/Users/yxswy/Documents/Github/puzzle-fuzzy-skill/SKILL.md`

- [x] Add an operational workflow and definition of done.
- [x] Add conditional defaults and frontend interaction/scrolling/icon rules.
- [x] Add security, API evolution, worker/provider reliability, accessibility, desktop packaging, and delivery guidance.
- [x] Keep existing official-first precedence and avoid universal rules where context is required.

### Task 2: Update user-facing metadata and validation docs

**Files:**
- Modify: `/Users/yxswy/Documents/Github/puzzle-fuzzy-skill/README.md`
- Modify: `/Users/yxswy/Documents/Github/puzzle-fuzzy-skill/agents/openai.yaml`

- [x] Make the skill description and default prompt mention the new applicable UI and Electron guidance without becoming a catch-all trigger.
- [x] Replace the machine-specific Windows-only validator path with portable macOS/Linux and Windows examples.

### Task 3: Validate and review the documentation change

**Files:**
- Check: `/Users/yxswy/Documents/Github/puzzle-fuzzy-skill/SKILL.md`
- Check: `/Users/yxswy/Documents/Github/puzzle-fuzzy-skill/README.md`
- Check: `/Users/yxswy/Documents/Github/puzzle-fuzzy-skill/agents/openai.yaml`

- [x] Run `python3 /Users/yxswy/.codex/skills/.system/skill-creator/scripts/quick_validate.py .`.
- [x] Run `git diff --check` and inspect the complete diff for scope, contradictions, and placeholder text.

### Task 4: Commit and publish

**Files:**
- Commit the reviewed documentation changes in the current Git repository.

- [x] Commit with a focused message describing the skill guidance update.
- [x] Push the resulting `main` commit to `origin` and report the commit plus validation results.
