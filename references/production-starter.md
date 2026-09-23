# Production starter

The reusable template lives in the separate repository `puzzle-fuzzy/puzzle-fuzzy-production-starter`. It is product-neutral and evolves independently from this skill. Its default branch is `main`; the baseline validated with this skill is commit `68ed8d4`. Check its current commit and local verification before using it as a new project base.

## What it provides

- Bun workspace and Turborepo task graph with a committed lockfile.
- `apps/api` for Elysia + TypeScript liveness/readiness endpoints and metadata-only JSON logs with request IDs.
- `apps/admin` for a React Router internal-admin shell and `apps/web` for a React Router user-facing technical shell. Both have independent route trees, layouts, root routes, and 404/unknown-route boundaries; use HeroUI v3 direct compound components and Tailwind CSS v4 without a HeroUI v2 provider, and each owns its permissions, API client, Vite config, build output, deployment assets, and release acceptance. The native Mini Program retains `app.json` routing.
- `apps/miniprogram` for native TypeScript Mini Program configuration and structural verification. Its API origin is a deliberate placeholder until the user confirms an HTTPS domain.
- `packages/contracts`, `packages/auth-core`, and `packages/db` for shared types, an authentication adapter boundary, security-event persistence, Drizzle schema, a versioned PostgreSQL migration, and a repository interface.
- Root `tests/`, Biome, Docker Compose for only local PostgreSQL, environment examples, database migration commands, and `bun run verify`.

The template deliberately omits a product domain, fixtures, a development-login bypass, test account, initial admin bootstrap, production credentials, public content, deployment scripts, and external providers. Add these only from confirmed requirements.

## New-project workflow

Run the skill-owned script with Bun; it copies the template without template Git history and starts a new local repository:

```sh
bun /Users/yxswy/Documents/GitHub/puzzle-fuzzy-skill/scripts/scaffold-production-project.ts \
  --name <project-name> \
  --path /Users/yxswy/Documents/GitHub/<project-name>
```

The generated project always includes `apps/web` as a neutral technical shell with a multi-page routing foundation; it must not be described as a delivered public product before approved routes, content, access policy, static-host route fallback, and acceptance criteria exist.

The script refuses an existing target and does not make any GitHub request. After reviewing the generated repository, configuring local environment values, running `bun install` and `bun run verify`, create a private remote only when the user has explicitly asked for one. Use a fresh repository/remote for the new project; never keep the starter's `origin` or push to it.

## Required confirmations after generation

Before implementing product features, obtain the minimum decisions needed for the proposed scope:

1. Product goal, users, terms, brand/content, and the user-facing routes/content that belong in the default `apps/web`.
2. Authentication provider/channel, account bootstrap, roles, session/revocation policy, and audit-retention needs.
3. PostgreSQL hosting, secret management, migrations/backups/restore, and data-retention constraints.
4. Deployment environment, domains/TLS, allowed origins, network model, observability, and release/rollback owner.
5. Approved external providers and their authorization, quota, privacy, and failure boundaries.

`bun run verify` is intentionally a local structural gate. E2E is a progressive module: once stable pages and primary interactions have meaningful acceptance criteria, use [production-modules.md](production-modules.md) to add the repository-root `playwright.config.ts`, root `tests/e2e/`, Bun script, controlled local-service boundary and CI/browser-install guidance; no placeholder spec is required. Neither command substitutes for Docker/database, browser, WeChat DevTools/device, authentication/provider, security review, deployment, or production acceptance.
