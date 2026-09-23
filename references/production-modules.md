# Production modules

Keep the core starter lean. Add a module only when the confirmed product boundary gives it real work and an acceptance path; never add an empty dependency or a placeholder workflow merely to make the directory tree look complete.

| Module | Add when | Do not add when | Boundary |
| --- | --- | --- | --- |
| E2E / Playwright | A stable page and primary interaction have observable acceptance criteria | Content, layout, routing, or login rules are still exploratory | Root `playwright.config.ts`, root `tests/e2e/`, Bun `test:e2e`; use an explicit local-server command/base URL and install browsers only in the chosen CI or test host |
| User Web | The production baseline always includes `apps/web` as a technical shell | N/A for this starter | Its React Router tree, access metadata, API client, Vite config, static-host fallback, and release acceptance stay separate from admin |
| External authentication | The identity provider, bootstrap, roles, session/revocation, and audit-retention policy are confirmed | A login screen or provider has merely been suggested | Implement an adapter behind `packages/auth-core`; no development bypass or fixture account |
| Worker | A queue, scheduled job, long-running task, or independent lifecycle is confirmed | HTTP handlers can complete within their request lifecycle | Add `apps/worker` with durable task state, cancellation, retry, observability, and a separate deploy/runtime boundary |
| Provider | A permitted upstream, data contract, credential owner, quota, and failure policy are confirmed | The provider is speculative, behind a challenge, or has no authorization | Add a service adapter with timeout, validation, redaction, bounded retry, and degraded state; never put credentials in a client |
| Deployment | A target, domains/TLS, secret manager, database, observability, rollout, and rollback owner are confirmed | The project only has local development evidence | Add deployment files and CI only for the selected target; local Compose is not a deployment implementation |

## Add E2E

When the user asks to add E2E or Playwright, first verify that the target is a Bun workspace and that at least one real page flow has stable acceptance. Then run:

```sh
bun /Users/yxswy/Documents/GitHub/puzzle-fuzzy-skill/scripts/add-production-e2e.ts \
  --path /absolute/path/to/project
```

The script adds only the root configuration, root `tests/e2e/` guidance, root dependency, Bun test command, ignored reports, and runs Bun install plus Biome formatting. It does not create a fake spec, choose a route, start a service, install browsers, or add CI. Add a real specification after setting `E2E_BASE_URL` and, when appropriate, `E2E_START_COMMAND` to a deterministic local service command. In CI, use `bun install --frozen-lockfile`, then install the required Playwright browser on the approved runner; do not commit browser binaries.
