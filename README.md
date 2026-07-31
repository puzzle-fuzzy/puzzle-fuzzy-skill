# puzzle-fuzzy-skill

Puzzle Fuzzy's TypeScript full-stack engineering preference skill for Codex.

## Priority

This skill is a fallback decision layer. Use the following order when making an implementation choice:

1. Follow explicit user requirements and safety constraints.
2. Check the official documentation, standards, and security guidance for the actual technology and version.
3. Preserve compatible architecture and conventions already present in the repository.
4. Use this skill's preferences only when the official guidance leaves multiple reasonable options.
5. State uncertainty and ask before making a product-direction choice when the decision remains unresolved.

The skill must not replace an official security, compatibility, API, or platform recommendation with a personal preference.

## Contents

- [`SKILL.md`](SKILL.md): Codex instructions and fallback engineering preferences.
- [`agents/openai.yaml`](agents/openai.yaml): UI metadata for the skill.

## Invocation

Use `$puzzle-fuzzy-skill` when the task needs these preferences after checking official best practices.

## Validation

Run the Codex skill validator from the skill-creator package:

```powershell
python C:\Users\18267\.codex\skills\.system\skill-creator\scripts\quick_validate.py .
```
