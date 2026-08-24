# Puzzle Fuzzy 项目结构与配置规范

> 这是个人项目默认规范，不是对历史仓库的强制批量迁移方案。用户明确要求、官方文档、平台限制和当前仓库已运行的契约优先于本文。

## 1. 目标与适用范围

本规范解决以下长期混乱：

- 同一种 HTTP 服务在 `apps/api` 和 `apps/server` 之间摇摆。
- Dockerfile、Compose、Nginx 和部署环境样例散落在根目录、`deploy/`、`infra/`。
- `.env.example` 分散在根目录和各应用目录，真实配置没有清晰边界。
- 同一个项目同时存在 Bun、Node 和 nvm 三套版本声明。
- Tailwind 4 仍保留不再必要的根目录 `tailwind.config.ts`。
- `assets`、`data`、`backups`、运行时存储和用户媒体没有区分。

规范有两个目标：

1. 新项目从第一天使用稳定的目录和命名。
2. 历史项目可以逐步迁移，每一步都能验证和回滚，不因重命名破坏数据或部署。

## 2. 推荐根目录

```text
repository/
├── AGENTS.md                         # 仓库级协作和验证边界（需要时）
├── README.md
├── package.json                      # workspace、packageManager、统一脚本
├── bun.lock                          # 新项目默认；与 pnpm-lock/npm lock 二选一
├── .bun-version                      # Bun 项目唯一运行时版本文件
├── pnpm-lock.yaml                    # 兼容旧项目时使用，不能与其他 lock 并存
├── .node-version                     # pnpm/npm 项目的唯一 Node 版本文件
├── .env.example                      # 根目录统一维护，禁止真实 secret
├── .env.test.example                 # 可选：测试环境变量名和安全默认值
├── .env.production.example           # 可选：生产变量名，不放真实值
├── biome.json                        # 根目录唯一格式化和 lint 配置
├── turbo.json                        # monorepo 任务图和缓存配置
├── playwright.config.ts              # 工作区浏览器 E2E 配置（需要时）
├── .gitignore
├── .github/
│   └── workflows/
├── apps/                             # 可运行、可构建、可独立部署的应用
│   ├── api/                          # HTTP API、认证、业务路由
│   ├── web/                          # Web 前端
│   ├── worker/                       # 独立后台进程、队列消费者、定时任务
│   ├── desktop/                      # Electron 桌面应用
│   ├── extension/                    # 浏览器扩展
│   └── ios/                          # 原生 iOS/Xcode 客户端
├── packages/                         # 可复用库，不直接启动 listener
│   ├── contracts/
│   ├── domain/
│   ├── api-client/
│   ├── db/
│   ├── storage/
│   └── ui/
├── deploy/                           # 容器、Compose 和反向代理声明
│   ├── compose/
│   │   ├── compose.yaml
│   │   ├── compose.dev.yaml
│   │   └── compose.prod.yaml
│   ├── docker/
│   │   ├── api.Dockerfile
│   │   ├── web.Dockerfile
│   │   └── worker.Dockerfile
│   └── nginx/
├── infra/                            # 只放 IaC：Terraform/OpenTofu/Ansible/K8s
├── scripts/                          # 工作区所有自动化入口，按职责分组
│   ├── dev/
│   ├── db/
│   ├── verify/
│   ├── deploy/
│   ├── backup/
│   └── release/
├── tests/                            # 跨应用测试
│   ├── e2e/                          # Playwright 浏览器测试
│   ├── integration/
│   └── fixtures/
├── docs/
│   ├── architecture/
│   ├── decisions/
│   ├── plans/
│   ├── runbooks/
│   └── testing/
├── assets/                           # 跨应用、已纳入版本控制的源资产
└── data/                             # 仅限脱敏 fixture 或本地数据约定
    ├── fixtures/                     # 可以提交的最小开发/测试数据
    ├── local/                        # 本地运行数据，必须 gitignore
    └── runtime/                      # 本地数据库、缓存、下载等，必须 gitignore
```

说明：

- 没有对应内容时不要为了填树创建空目录。
- 生产数据库、用户媒体、上传文件、下载文件、备份和 secret 默认放在仓库 checkout 之外，由 `DATA_DIR`、专用 storage 配置或部署卷指向。
- `assets/` 不是 `data/` 的替代品；前者是可审查的源文件，后者是运行时或 fixture 边界。
- `services/` 不是默认新增目录。只有现有仓库已经依赖它，或有明确的组织/部署边界时才保留；否则使用 `apps/worker` 等可运行应用目录。

## 3. 应用与包的命名

### 3.1 应用目录

| 业务角色 | 标准目录 | 说明 |
| --- | --- | --- |
| HTTP 服务 | `apps/api` | 负责 HTTP/WebSocket、认证、路由和 API 进程入口 |
| 独立后台进程 | `apps/worker` | 队列、调度、批处理、Provider 同步等独立进程 |
| Web 前端 | `apps/web` | 浏览器 Web 应用；复杂项目默认 React，直线型管理端可 Vue |
| 桌面应用 | `apps/desktop` | Electron main/preload/renderer；新项目优先 electron-builder |
| 浏览器扩展 | `apps/extension` | Chrome/Firefox 等扩展目标 |
| 原生 iOS | `apps/ios` | SwiftUI/Xcode；不使用 `apps/mobile` 混淆原生边界 |
| 命令行工具 | `apps/cli` | 只有确实要作为独立可执行入口时使用 |

`server` 的处理规则：

- 新项目不用 `apps/server` 表示 HTTP API。
- 纯 HTTP 服务改为 `apps/api`。
- HTTP + 后台逻辑仍是同一个进程时保留在 `apps/api`，在 `src/workers/` 或 `src/jobs/` 划分内部边界。
- 后台逻辑需要独立生命周期、并发、资源限制或部署时，拆成 `apps/worker`。
- `server` 只有在它确实是平台级 server、非 API 进程，且这个语义能被 README 和部署配置解释时才允许。

### 3.2 包目录与 package name

- 目录名使用小写 kebab-case，例如 `api-client`、`file-runtime`、`catalog-ui`。
- workspace package name 使用统一 scope：`@<repository-slug>/<package-name>`。
- `contracts`、`domain`、`api-client`、`db`、`storage`、`ui` 是优先可读名称；不要使用含义不清的 `common`、`shared`、`utils` 作为万能包。
- `packages/` 内的纯 domain、schema 和 policy 不直接启动 HTTP listener，也不隐式读取环境变量、数据库或 Provider。
- React/Vue 组件文件可以使用 PascalCase；配置、服务、repository、脚本和领域文件默认使用 kebab-case。测试紧跟被测文件，使用 `.test.ts`、`.test.tsx` 或仓库已有 runner 约定。

### 3.3 共享 UI 包

当网页端和桌面端使用同一套 renderer 框架时，领域 UI 统一放在 `packages/<domain>-ui`，例如：

```text
packages/catalog-ui/
├── src/
│   ├── components/
│   ├── styles/
│   ├── tokens/
│   └── index.ts
├── package.json
└── tsconfig.json
```

- `catalog-ui` 负责共享组件、设计 token、CSS、可访问性行为和组件级测试；Web 与 Electron renderer 通过 workspace dependency 使用同一个包。
- `catalog-ui` 不直接读取 API、Electron IPC、`window`、storage、路由或环境变量；这些由 `apps/web`、`apps/desktop` 的 shell 通过 props、typed adapter 或 callback 注入。
- 页面组合、路由、平台能力、API client、preload bridge 和窗口生命周期留在应用边界；共享 UI 只表达可复用的展示和交互契约。
- React Web + React Electron 可以共享一个 `catalog-ui`；Vue 和 React 不能直接共享同一套组件实现。跨框架时共享 `packages/ui-tokens`、CSS 变量和 contracts，必要时分别维护 `catalog-ui-react` 与 `catalog-ui-vue`。
- `packages/ui` 只放跨领域基础组件；产品领域组件使用 `packages/catalog-ui` 等明确名称，避免把整个产品 UI 塞进万能包。

## 4. package manager、运行时与 monorepo 工具链

### 4.1 个人优先级

JavaScript/TypeScript 项目的个人默认优先级为：

1. **Bun + Turborepo + monorepo**：新项目的默认组合。
2. **pnpm + Turborepo + monorepo**：已有 pnpm 项目、生态兼容或 CI/部署明确要求时使用。
3. **npm**：只有外部平台、客户环境或依赖明确要求时使用，仍然保持 monorepo 边界。

不因为个人偏好强行迁移已经稳定运行的项目；但新项目不要在 Bun、pnpm 和 npm 之间摇摆。

### 4.2 一仓库一条 JavaScript 运行时链路

`package.json` 的 `packageManager` 是包管理器事实来源，锁文件必须与它匹配：

| 项目选择 | 必须保留 | 默认删除/禁止新增 |
| --- | --- | --- |
| Bun | `packageManager: bun@...`、`bun.lock`、`.bun-version`、根 `workspaces` | `pnpm-lock.yaml`、`package-lock.json`、`.node-version`、`.nvmrc` |
| pnpm + Node | `packageManager: pnpm@...`、`pnpm-lock.yaml`、`.node-version`、根 `pnpm-workspace.yaml` | `bun.lock`、`package-lock.json`、`.bun-version`、`.nvmrc` |
| npm + Node | `packageManager: npm@...`、`package-lock.json`、`.node-version`、根 `workspaces` | `bun.lock`、`pnpm-lock.yaml`、`.bun-version`、`.nvmrc` |

规则：

- 新的 TypeScript 全栈项目默认 Bun + Turborepo；因生态、CI 或已有仓库原因选择 pnpm/npm 时，明确记录原因。
- `engines.node` 可以作为兼容性下限，但不等于额外的项目运行时；它必须和实际 CI/runtime 一致。
- `.nvmrc` 只作为历史兼容文件保留，不能与 `.node-version` 并列成为两个事实来源；迁移完成后删除。
- 不提交第二个锁文件，不在脚本中混用 `bun`、`pnpm`、`npm` 安装同一工作区；命令、CI、Docker 和 README 使用同一包管理器。
- CI、Docker 和 README 都从 `packageManager` 与唯一版本文件读取版本，不写另一套隐含版本。
- Swift/Xcode、Rust 等原生工具链不通过 Node 版本文件表达；按各自平台的工程文件和官方工具管理。

### 4.3 Bun + Turborepo monorepo 默认形态

新项目默认根目录至少包含：

```json
{
  "packageManager": "bun@<pinned-version>",
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "typecheck": "turbo run typecheck",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "verify": "turbo run verify"
  }
}
```

- `turbo` 和 `@biomejs/biome` 作为根开发依赖；每个 app/package 声明自己的 `dev`、`build`、`typecheck`、`lint`、`test`、`verify` 任务，根脚本只负责编排。
- `turbo.json` 放在仓库根目录，定义任务依赖、缓存输出、持久化 dev 任务和必要的环境变量；不要在根脚本中手写一长串 package-by-package typecheck。
- Bun monorepo 使用根 `workspaces`；只有 pnpm 回退项目使用 `pnpm-workspace.yaml`。新项目不同时维护两套 workspace 声明。
- 需要对单个包调试时使用 `bun run --filter <package>` 或 `bun --cwd <app>`，全局验证使用 `turbo run`。
- `turbo` 只负责任务编排和缓存，不替代业务脚本、测试 runner、数据库迁移工具或部署工具。

### 4.4 迁移检查

迁移运行时前必须检查：

- lockfile 和 `package.json` 的包管理器是否一致。
- CI setup、Docker 基础镜像、README、脚本和 Git hooks 是否引用旧运行时。
- 原生依赖、构建脚本和部署主机是否真的支持目标运行时。
- 迁移后执行 install、typecheck、test、build 和最小启动 smoke；不能只删除版本文件。

### 4.5 Biome 统一规则

- 新项目默认使用根目录 `biome.json`、根开发依赖 `@biomejs/biome`，统一提供 `lint` 和 `format` 脚本。
- Biome 同时承担格式化和 lint；不再新增 ESLint、Prettier 或多个互相覆盖的格式化配置。
- 只有框架或第三方工具存在 Biome 无法替代的专用规则时，才允许增加局部 ESLint；必须限定作用域、说明原因，并避免与 Biome 重复修复同一类规则。
- 包内不复制 `biome.json`；确有差异时使用根配置的 overrides，并在 decision 文档说明边界。

## 5. 环境变量与配置

### 5.1 文件位置

```text
repository/.env.example                  # 本地工作区的非 secret 变量清单
repository/.env                           # 本地实际值，gitignore
repository/.env.test.example             # 可选：测试变量名和安全默认值
repository/.env.production.example       # 可选：生产变量名，不放真实值
```

- 所有环境样例统一放在仓库根目录；默认只维护 `.env.example`，需要区分测试/生产时增加根目录 `.env.test.example`、`.env.production.example`。
- 不在 `apps/*`、`packages/*` 或 `deploy/` 下新增同一项目的 `.env.example`；应用差异写进根文件的分组注释和配置 schema。
- 真实 `.env`、私钥、token、cookie、数据库密码、下载器凭据和生产备份清单不能提交。
- 前端环境变量必须是公开配置；不能因为变量以 `VITE_`、`PUBLIC_` 或相似前缀命名就把 secret 暴露给浏览器。
- 应用在自己的边界加载并校验配置：通常是 `apps/api/src/config.ts`、`apps/worker/src/config.ts`；只有真正跨应用共享的 schema 才放到 `packages/config`。
- 因为 Bun、Vite 和 Compose 的默认工作目录可能不同，必须显式从仓库根目录加载环境：根脚本统一从 workspace root 启动，Vite 设置 `envDir`，Compose 使用根目录 env-file，服务端使用明确的 root path 或 `--env-file`。
- 生产真实配置由部署主机的 secret manager、受保护文件或 CI secret 注入；“统一在根目录”指变量样例和本地入口统一，不代表把生产 secret 放入 Git checkout。

### 5.2 基础命名

新项目优先使用：

```dotenv
NODE_ENV=development
HOST=127.0.0.1
PORT=3000
PUBLIC_BASE_URL=http://127.0.0.1:3000
DATABASE_URL=postgres://...
DATA_DIR=./data/runtime
```

- `HOST`、`PORT`、`PUBLIC_BASE_URL`、`DATABASE_URL`、`DATA_DIR` 是通用基础变量。
- 协议专属监听可以使用 `DHT_HOST`、`DHT_PORT` 等明确名称；不要为了统一把不同协议压成一个 `PORT`。
- `DATA_DIR` 表示应用管理的持久化数据根目录；媒体、上传、缓存、备份等需要独立生命周期时使用 `MEDIA_DIR`、`UPLOAD_DIR`、`CACHE_DIR`、`BACKUP_DIR` 等明确变量。
- 旧变量（如 `HTTP_HOST`、`HTTP_PORT`、`STORAGE_ROOT`）迁移期间可以在 config 层做兼容读取，但新代码不继续扩散旧名称；完成迁移后删除兼容别名。

## 6. 文档位置与语言

- 所有项目文档的 canonical location 是根目录 `docs/`；不要把计划、架构、部署说明长期散落在 `apps/*`、`packages/*`、`deploy/` 或 `docs/superpowers/`。
- `README.md` 是唯一默认例外，可以根据 GitHub 读者保留英文或双语；`docs/` 下的正文默认使用中文。
- 文件名使用小写 kebab-case 和英文稳定 slug，正文使用中文；计划使用 `docs/plans/YYYY-MM-DD-<slug>.md`，决策使用 `docs/decisions/NNNN-<slug>.md`。
- 推荐分类：`docs/product/`、`docs/architecture/`、`docs/decisions/`、`docs/plans/`、`docs/runbooks/`、`docs/testing/`、`docs/research/`。
- 根目录不再新增 `PRODUCT.md`、`DESIGN.md` 等平行文档入口；迁移时移入 `docs/product/` 或 `docs/architecture/`。可独立安装的 package/app 可以保留自己的 `README.md`，但不得复制根文档的事实。
- `AGENTS.md` 是协作指令文件，不属于产品文档；内容也优先使用中文，并且只记录当前仓库真正有效的边界。

## 7. Playwright、测试与自动化脚本

### 7.1 Playwright 位置

- 工作区级浏览器 E2E 统一使用根目录 `playwright.config.ts`；依赖放在根 `package.json`，脚本使用 `bunx playwright test`。
- E2E 用例放根目录 `tests/e2e/`，跨应用 fixtures 放 `tests/fixtures/`，集成测试放 `tests/integration/`；报告和 `test-results/`、`playwright-report/` 必须 gitignore。
- Web、Electron 或多端浏览器目标使用 Playwright `projects` 区分，不为每个 app 复制一份配置。只有一个 app 被独立发布且无法从 workspace root 启动时，才允许 app 内配置。
- 单元测试默认与源文件 colocate；不要把单元测试和自动化脚本混在 `scripts/`。

### 7.2 自动化脚本实际位置

根目录 `scripts/` 是工作区所有人工、CI 和运维自动化的统一入口，按职责分组：

```text
scripts/
├── dev/       # 本地启动、模拟器、开发依赖
├── db/        # generate、migrate、seed、备份检查
├── verify/    # workspace boundary、发布前检查
├── deploy/    # Compose、发布、回滚、生产 smoke
├── backup/    # backup、restore、retention
└── release/   # 打包、签名、归档
```

- 脚本文件使用明确动词命名，例如 `scripts/db/seed-dev.ts`、`scripts/verify/workspace.ts`；不要使用 `misc.ts`、`helper.ts` 或无职责的万能脚本。
- `scripts/` 里的脚本只做编排、边界检查和外部命令调用；业务规则放在所属 `apps/<app>/src/commands/` 或 `packages/<pkg>/src/`，避免根脚本变成第二个服务层。
- 新代码不使用 `apps/api/src/scripts/` 存放长期命令；改用 `apps/api/src/commands/`，再由根 `scripts/db/` 或 app package script 调用。
- `apps/<app>/scripts/` 只在构建工具强制要求 app-local entrypoint 时使用，例如浏览器扩展打包；应保持薄并在对应 README/decision 说明。
- 自动化脚本的测试放在 `tests/` 或与 command 实现 colocate；不要将 `scripts/*.test.ts` 当作脚本入口。

## 8. Tailwind 与前端配置

### Tailwind 4 默认

```text
apps/web/
├── src/
│   └── styles/
│       ├── app.css                 # @import "tailwindcss";
│       └── tokens.css              # 可选：项目设计 token
└── vite.config.ts                  # @tailwindcss/vite
```

- Tailwind 4 使用 CSS-first 配置；没有明确 legacy 需求时，根目录不放 `tailwind.config.ts`。
- 主题 token、组件样式和扫描边界跟随所属应用；不要由根配置隐式控制多个互不相关的前端。
- 确实使用 Tailwind 3，或 Tailwind 4 需要 `@config` 兼容旧配置时，配置放在 `apps/web/`，文件内容和迁移原因写入 README/decision。
- 移除配置前先确认不存在 `@config`、自定义 plugin、content glob、旧版 PostCSS 依赖或 CI 生成步骤。

## 9. Docker、Compose 与部署目录

### 9.1 固定位置

新项目默认：

```text
deploy/
├── compose/
│   ├── compose.yaml                  # 默认本地或基础 Compose
│   ├── compose.dev.yaml              # 可选：开发覆盖
│   └── compose.prod.yaml             # 可选：生产覆盖
├── docker/
│   ├── api.Dockerfile
│   ├── web.Dockerfile
│   └── worker.Dockerfile
└── nginx/
```

- 新项目不在根目录放 `Dockerfile` 或 `docker-compose.yml`；Compose Specification 使用 `compose.yaml`。
- 每个镜像有清晰目标名，例如 `api.Dockerfile`；构建 context 默认是仓库根目录，路径在 Compose 中显式写出。
- `deploy/nginx/` 放反向代理、静态服务和媒体边界配置；不要把 Nginx 混在 `infra/`。
- 发布、回滚、备份、恢复、证书和生产 smoke 的可执行脚本统一放根 `scripts/deploy/`、`scripts/backup/` 或 `scripts/release/`；`deploy/` 保持声明式部署文件。
- `infra/` 仅在有 Terraform/OpenTofu、Ansible、Kubernetes manifests 等基础设施即代码时使用。
- Docker Compose 默认负责本地 PostgreSQL、依赖服务和健康检查；生产卷、secret、TLS 和公网入口必须明确写在部署文档中。

### 9.2 例外

已经被外部平台固定识别的根目录 Dockerfile 可以暂时保留，但应在 README 记录原因。只有单文件、单服务且没有 monorepo 部署目标时，才可以使用 `deploy/docker/app.Dockerfile` 之外的简化布局；不要为了目录形式牺牲构建 context 的可读性。

## 10. assets、data、storage 和 backups

| 内容 | 位置 | Git 规则 |
| --- | --- | --- |
| 跨应用品牌/源素材 | 根 `assets/` | 可提交，需有归属和用途 |
| 应用专属静态文件 | `apps/<app>/public` 或 `apps/<app>/assets` | 可提交，归所属应用 |
| 脱敏 fixture | `data/fixtures/` | 可提交，禁止真实个人数据和 secret |
| 本地数据库/缓存/下载 | `data/runtime/` 或外部 `DATA_DIR` | 必须忽略 |
| 用户媒体/上传 | 外部 `MEDIA_DIR`/`UPLOAD_DIR` | 不放 checkout |
| 本地备份 | `data/backups/` 或外部 `BACKUP_DIR` | 默认忽略，不进仓库 |
| 生成的 dist/build | 各应用构建目录 | 默认忽略，除非发布流程明确要求 |

UI 图标规则仍然独立生效：`assets/` 中存在图片或品牌素材，不代表可以用手写 SVG 或输入法 emoji 作为 UI icon；产品界面仍只使用 Lucide。

## 11. 当前三套项目的只读盘点

以下是 2026-08-24 对 `/Users/yxswy/Documents/Github` 的本地证据快照，不是永久事实；后续使用前应重新检查。

| 项目 | 当前事实 | 与目标规范的差异 |
| --- | --- | --- |
| `dht-observer` | `apps/server`；根 `Dockerfile`；`deploy/docker-compose.yml`；根 `.env.example` 和部署 env 样例；pnpm + Biome + Turbo；根 `scripts/` | HTTP 应用目录、Bun 优先级、Dockerfile/Compose 文件名、根 env 和脚本分组需要统一；Playwright 尚未配置 |
| `jav-media-catalog` | `apps/api`；根 `docker-compose.yml`；`infra/nginx/`；根 `assets/`、`data/`；Bun + Biome + Turbo；`packages/catalog-ui` 已被 Web/Electron 共享 | API、Bun/工具链、共享 UI 方向已符合；Docker/Compose/Nginx、根 env、文档和脚本分组需要统一 |
| `relay-transfer` | `apps/api`；`apps/api/.env.example`；根 `.bun-version`、`.node-version`、`.nvmrc`；根 `tailwind.config.ts`；Bun + Biome；根 `playwright.config.ts`；当前工作树已有 `packages/catalog-ui` 变更 | env 应收拢根目录；运行时只保留 Bun；移除根 Tailwind 配置或确认 legacy 依赖；补 `turbo.json` 并迁移脚本/测试目录 |

盘点时三套项目均存在 Git 仓库；当时 `dht-observer` 的 iOS 文件和 `relay-transfer` 的 workspace/验证/新包已有未提交或未跟踪修改，`jav-media-catalog` 未显示未提交文件。以上修改均未被本次规范审计触碰。任何实际迁移开始前都要重新执行 Git 状态检查，并避开并行修改。

## 12. 历史项目迁移顺序

不要一次性“全局替换”。推荐按以下顺序逐项目迁移：

1. **建立清单**：记录当前目录、package name、workspace filter、脚本、CI、Docker context、Compose volume、环境变量和外部 URL。
2. **先统一事实来源**：确定 Bun/pnpm/npm、唯一运行时版本文件、唯一 lockfile、根 `.env.example`、根 `biome.json`、根 `turbo.json` 和目标目录树。
3. **先统一编排和工具**：补齐根 Turbo task、Biome、Playwright（需要时）和分组后的 `scripts/`，再改 package scripts。
4. **先迁移无数据项**：先改 package name、脚本、CI 和中文文档，再 `git mv` 应用目录；每一步运行 install、typecheck 和 focused test。
5. **迁移共享 UI**：同框架的 Web/Electron 抽到 `packages/<domain>-ui`；先确认没有 API/IPC/路由耦合，再更新两端入口和视觉测试。
6. **迁移环境与部署入口**：把 env 样例收回根目录，移动 Dockerfile、Compose、Nginx，逐项更新 build context、挂载路径、healthcheck、备份/恢复脚本和 README。
7. **处理 assets/data**：先区分版本化资产、fixture、本地运行数据和生产数据；涉及真实媒体、数据库、备份或用户目录时先设计复制/回滚，再执行移动。
8. **清理兼容层**：旧变量、旧路径和旧目录只在确认没有外部引用后删除；删除前保留迁移说明和验证证据。
9. **分批提交**：目录重命名、工具链统一、部署调整、数据迁移分开提交；完成 `git diff --check`、聚焦验证和必要的 Compose config/health smoke 后再 push。

## 13. 必须提出疑问的地方

遇到以下情况不能静默执行：

- `apps/server` 被公网 URL、Docker volume、systemd、CI filter、客户端 import 或发布脚本引用。
- `.env`、`data/`、`assets/`、`backups/` 中可能含有真实用户数据、媒体、凭据或不可重建数据库。
- 一个项目确实需要 Bun 和 Node 两个独立运行时，或同一仓库被两个构建平台读取不同版本文件。
- 根 `tailwind.config.ts` 含有迁移后仍不可替代的 plugin、preset、content glob 或自定义生成步骤。
- 生产部署依赖根 Dockerfile、根 Compose 文件、`infra/` 路径或固定的外部文件路径。
- 统一目录会改变公开 package name、import path、容器镜像名、URL、备份恢复路径或用户手动操作。
- Web 和 Electron 使用不同 UI 框架，却要求共用同一个 `catalog-ui` 实现。
- 根目录 env 需要被 Vite、Bun、Compose 或外部部署工具读取，但当前启动 cwd 不一致。
- 现有 Playwright 测试依赖 app-local config、固定端口、登录态或桌面窗口，不能直接迁移到根配置。
- pnpm/npm 项目是否真的具备切换到 Bun 的依赖、原生模块和 CI 条件。

提问时至少给出：当前证据、真正未知点、推荐默认、另一方案的维护代价，以及需要用户确认的最小决定。没有这些影响时可以按本规范可逆地默认执行。
