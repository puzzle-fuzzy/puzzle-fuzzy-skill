---
name: puzzle-fuzzy-skill
description: 仅用于 Puzzle Fuzzy 个人项目的 TypeScript 全栈、产品界面、Provider、桌面端和交付偏好；在官方文档、标准和当前仓库约定无法决定时使用。适用于 Bun 或 pnpm 项目、React/Vue 界面、Elysia/Hono API、Drizzle/Zod 领域代码、Electron Builder 打包和已有的 Tauri/Rust 桌面壳。
---

# puzzle-fuzzy-skill

## 定位与个人范围

这是 Puzzle Fuzzy 的个人工程偏好层，不是通用最佳实践，也不能取代官方文档、平台标准、安全指南或当前仓库的明确约定。它只在以下条件下提供默认选择：

- 用户明确要求使用这些偏好，或当前任务确实属于 Puzzle Fuzzy 的个人项目。
- 官方文档、标准、用户要求和当前仓库约定没有决定唯一方案。
- 记忆中的历史结论只能作为线索；路径、端口、版本、提交号、依赖状态和 Provider 页面都必须重新检查，不能直接当作当前事实。

不要把本 skill 中的个人偏好包装成适用于其他用户或所有项目的硬性规范。

## 决策顺序

实现、审计、诊断和架构选择按以下顺序处理：

1. 遵守用户当前的明确要求、安全约束和已确认的产品边界。
2. 查阅实际版本对应的官方文档、Web/平台标准和安全指南，优先官方示例、受支持集成和安全默认值。
3. 检查当前仓库的架构、package manager、脚本、依赖版本、测试和已有约定，尽量保留兼容行为。
4. 只有前面仍有多个合理方案时，才使用本 skill 的个人默认。
5. 如果仍会改变产品方向、数据库、认证、桌面壳、部署方式或视觉风格，说明不确定性并先询问。

不要用个人偏好替代官方安全、兼容性、API 或平台建议。重要选择要记录依据，并区分“官方事实”“当前仓库事实”“个人默认”和“尚未验证”。

## 个人任务流程与完成定义

### 开始前：只读基线

在进度汇报、审计、维护或改代码前，先只读检查：

- 当前目录、Git 状态、分支、远程、最近提交和是否存在并行工作。
- 仓库结构、package manager、workspace、运行时版本、环境变量、脚本、lint、typecheck、test、build 和 verify 入口。
- 当前实现、文档、测试和调用链是否一致。不要只重复 README 或目录名。
- 如果仓库根目录存在 `.codegraph/`，先使用 CodeGraph 定位符号和调用路径，再使用 `rg` 或读取文件。

不要使用 `git reset --hard`、`git clean` 或删除文件来制造“干净”状态。保留无关修改、未跟踪文件、其他 agent 的提交和用户明确要求保留的数据；如果已有委托任务或共享分支，先检查当前状态，不要重复实现或覆盖工作。

### 实现与验证

1. 先确认官方资料和当前仓库约定，再定义最小兼容变更。
2. 沿真实链路检查路由、状态、权限、持久化、Provider、客户端和错误恢复，不把静态占位页面当作产品流程。
3. 用 TypeScript 类型、运行时 schema、依赖注入和可测试边界实现，保留现有 API、URL 状态、分页、搜索、扫描和业务处理器，除非任务明确要求改变。
4. 按风险从小到大验证：聚焦测试、typecheck、lint/build、集成测试、浏览器检查、设备检查、Provider/凭据 smoke、生产或发布验收。
5. 汇报时明确标记：`已实现`、`已验证`、`历史证据`、`仅计划`、`未运行`、`被环境阻塞` 和 `待用户确认`。不要把一个成功 build 描述成安装、浏览器加载、真实设备、Provider 或生产部署成功。

### Git 交付

- 任务开始前先确认目标仓库，避免在已有父仓库内部错误地嵌套 `git init`。
- 任务完成或问题修复后，检查完整 diff、`git diff --check` 和 status，原子提交本次相关文件；不要提交 secrets、环境文件、生成产物或无关修复。
- 只 stage 当前任务的文件。根验证被无关修改阻塞时，保留并明确归因，不为了全绿修改无关区域。
- 拉取主分支默认先检查工作区，再使用 `git pull --ff-only`；push 被拒绝时 fetch、检查远端提交并安全合并，未经明确授权不要 force push。
- 仓库无 Git 时才初始化；存在远程且当前任务授权发布时，提交后 push，并核对本地和远程 refs。

## 证据与完成状态

- 代码存在不等于功能完成；测试通过不等于真实 Provider、浏览器、设备、安装包或生产环境通过。
- 生成图片不等于已复制到项目、完成 seed、写入数据库或在 Web 中显示；必须检查项目路径、seed 结果、数据库行数和可见页面。
- 服务启动不等于服务可用；要检查容器 health、API `/health`、Web HTML、实际端口和关键用户流程。
- OpenAPI、搜索片段、README、历史 rollout 或 mock 能力不等于当前代码已实现；必须从路由、调用链、测试和实际运行结果核对。
- 计划、代码、测试、构建、安装、浏览器、真实设备、Provider 和生产部署分别记录，不要合并成一个“完成”状态。

## 主动提问与不确定性处理

不要为了让回答看起来完整而隐藏疑问、补造事实或替用户做高影响决策。每次任务都要主动区分：

- `事实`：当前代码、命令输出、测试或用户已经确认的内容。
- `推断`：根据事实得出的解释，必须说明这是推断。
- `假设`：为了继续工作临时采用的默认，必须告诉用户并说明影响。
- `建议`：个人偏好或未来方案，不能描述成已实现能力。
- `未验证`：尚未运行、无法访问、凭据缺失、页面登录门禁、设备不可用或环境阻塞的部分。

遇到以下情况必须主动提问或暂停，而不是自行猜测：

- 方案会改变产品方向、数据删除/保留语义、认证模型、Provider 合规边界、平台选择、部署目标或视觉方向。
- 有两个以上合理方案，且选择会影响用户体验、数据库迁移、兼容性、费用、隐私、安全或后续维护成本。
- 用户要求与当前代码、官方文档、测试结果或历史记忆互相矛盾。
- 发现并行修改、远程分支变化、未授权外部访问、可能破坏用户数据或无法确认文件归属。
- 关键字段、Provider 内容、生产配置、设备行为或完成状态无法通过当前证据确认。

提问要具体，至少说明：当前已知事实、真正不确定的点、推荐的默认选择、另一种选择的代价，以及用户需要决定的最小问题。不要把一串低影响问题一次性抛给用户；可以安全、可逆地默认时，先说明假设并继续。

任务结束前做一次不确定性自检：有未验证事项就列出并询问是否继续；没有待确认问题时，也明确说明“当前没有待确认问题”。任何时候都不能用“应该”“大概”“看起来”掩盖缺少证据。

## 条件化默认建议

以下都是适用条件下的个人默认，不是强制迁移规则：

- 复杂产品、丰富状态、复杂 UI 组合、dashboard 或高级工作流优先 React；简单 CRUD、管理端、H5 和直线交互优先 Vue 3 + Vite。已有项目除非明确要求或有充分收益，不做框架迁移。
- 单机、单实例、个人工具或控制面优先 SQLite；只有出现多实例、HA、团队协作、复杂查询、生产一致性或明确的环境一致性需求时，才考虑 Docker Compose + Postgres。不要仅因为“全栈”就引入 Postgres。
- 需要历史、恢复或审计的业务记录优先软删除、审计字段、显式 retention 和恢复规则；必须物理删除的数据、secret、隐私擦除流程和不适合软删除的高容量表除外。
- 中间件顺序会影响行为且仓库没有既有顺序时，使用 request ID、安全 headers、logging、rate limit、CORS、static assets、error handling、auth、业务路由的稳定顺序；有既有顺序时先保留并验证影响。
- 内部原型和早期 MVP 在诊断充分时可以 MVP 后再引入 structured logging；生产、公开、安全敏感或分布式服务要更早使用结构化日志、脱敏和 request/trace ID。
- 新桌面项目优先 Electron + `electron-builder`，不必要时不引入 Electron Forge；已有 Tauri 不主动迁移。个人 iOS 项目使用原生 SwiftUI/Xcode，不用 Tauri 或 WebView 代替原生客户端。
- 避免不必要的跨语言业务逻辑；Rust 只在平台能力、性能或现有仓库确实需要时加入，并保持命令小、类型明确、容易审计。

## 产品内容与 UI 边界

- 优先工具型、任务型和工作台 UI：创建/加入、连接、发送、结果、重试、恢复和下一步操作要清楚，不用营销 header、重复卡片、装饰性 section 或无需求的 dashboard 取代真实功能。
- 产品内容未定义前，不生成示例业务数据、品牌文案、假任务、假通知或 placeholder workflow；只实现明确要求的 shell、导航、组件、真实 API 和交互。
- 真实业务流必须接通路由、API、状态、权限、加载、空态、错误、pending、只读和恢复操作。中文产品的标签、状态和错误文案保持一致，代码标识遵循仓库现有语言。
- PC、移动端、iOS 和 Electron 根据输入方式、窗口生命周期、安全模型和平台习惯分别设计；共享 contracts、API client 或纯展示组件，不代表完整页面行为可以强行共用。
- 视觉改造要保留真实 handler、URL state、data-action selector、协议状态机和已有数据边界；先做结构和交互，再做颜色或装饰。
- 优先沿用仓库已有的 Tailwind、shadcn-style、Radix/Base UI、feature folder、hooks、React Query/Zustand、Pinia、i18n 和 theme 体系；只有现有体系不适用或任务明确要求时才引入替代方案。
- H5、WeChat、screen、支付、WebSocket、device detection 和 SDK/auth 逻辑放入 package、composable 或 hook，不要塞进一个页面组件；数据请求和缓存要能取消、刷新并阻止旧响应污染新账户或新查询。

### 虚拟滚动、弹窗与图标

- 长列表、表格、网格、feed、侧栏、历史和日志在数量或渲染成本达到阈值时优先虚拟滚动。React 选择维护良好的 virtualizer；`simplebar-react` 只解决滚动条呈现，不等于虚拟滚动。Vue 可选 `vue-virtual-scroller`，但不强制绑定。
- 虚拟滚动和无限加载是性能增强，不得破坏现有分页、搜索、筛选、排序、URL 状态和手动“加载更多”降级路径。追加失败要保留已经加载的数据并提供重试。
- 产品界面不要把未样式化的浏览器原生滚动条作为视觉方案；优先稳定的自定义滚动容器，避免 scrollbar gutter 让页面晃动。保留 wheel、trackpad、touch、keyboard、focus、screen reader、resize 和 reduced-motion 行为；平台或无障碍要求必须使用原生滚动时，用 `scrollbar-gutter: stable` 等方式稳定布局，不得只为隐藏滚动条而移除语义。
- 弹窗内容会变化时，外层高度按断点固定或稳定约束；动态内容、加载、错误、长表单和长列表放入内部滚动区，标题、操作区和 footer 固定。小屏使用 viewport-constrained shell，不使用内容驱动高度，避免状态变化让弹窗跳动。
- 弹窗内有长列表、历史、表格或搜索结果时使用虚拟滚动，只重新计算内部 viewport，不改变外层弹窗高度。
- 图标唯一使用 Lucide：React 使用 `lucide-react`，Vue 使用 `lucide-vue-next` 或仓库已有的官方 Lucide 集成。禁止手写 SVG 图标、混用其他图标库或使用输入法 emoji 充当图标。Lucide 内部使用 SVG 不属于手写图标例外。
- 交互要有明确主操作、重复提交保护、pending/success/failure 状态、可恢复错误下的输入保留，以及适合场景的取消或撤销。乐观更新必须定义 rollback。
- UI 修改需要检查窄屏、文字溢出、键盘、焦点移动、触摸目标、screen reader、reduced motion 和固定比例媒体容器；必要时分别做 320/390/1280 CSS px、浏览器和真实设备验证。

## TypeScript、包边界与后端

- 优先维护熟悉的 TypeScript 端到端边界；不要为了“架构更高级”把业务逻辑迁移到不熟悉的 Rust 或另一个语言层。
- 按仓库当前 package manager 工作。全局 Bun/Node/pnpm 升级不代表修改项目 `packageManager`、lockfile 或依赖；项目 pin 优先于机器默认版本。
- 多产品面使用 `apps/*`、`services/*`、`packages/*` 的清晰边界。共享 contracts、schema、API client 和纯 domain/policy 放在 packages，纯 domain 不直接依赖 DB、Provider、storage 或 app IO。
- API 使用 Elysia 或 Hono 时保留现有框架；优先 `@elysia/eden`、`hono/client` 或仓库等价 typed client。使用 app factory，避免测试导入时启动 listener 或 Provider。
- 优先使用官方或成熟的 framework integration 处理 CORS、cookies、JWT、OpenAPI、static files 等横切能力，不手写已有可靠替代方案。
- repository 负责持久化和状态转换；service 负责权限、认证、校验、编排和业务流程。边界错误用稳定 code/class 或 discriminated result 表达。
- 对外契约使用运行时 schema 和 TypeScript 类型，集合接口明确分页、排序、筛选、最大查询量和 cursor；会重试的创建、计费、上传、发布和入队操作使用 idempotency key 或确定性去重。
- webhook 必须签名、带时间戳、拒绝 replay、幂等处理。不能因为 OpenAPI 中有某个能力，就宣称当前项目已经实现。
- 已有 Drizzle 时保留其 schema/query 约定；enum、string literal 和 API/frontend contracts 尽量共享唯一来源。公开 OpenAPI/docs 要有用，但生产环境不应无意暴露内部路由和 schema 细节。
- 需要本地持久化时，迁移、generate、migrate、push、studio、test DB 分开；未经明确批准不得 reset 数据或执行破坏性迁移。

## Provider 与外部数据合规

- 从具体 Provider 详情页开始时，优先检查真实渲染 DOM、JSON-LD、meta 和结构化 payload；不要只凭泛化 API 文档、搜索片段或旧 README 猜字段。
- 登录门禁页面必须使用已授权的浏览器 DOM 证据，并明确区分可验证内容和不可公开验证内容。服务端 credentials 留在服务端；扩展或客户端不得转发 cookies、tokens 或认证 API 请求。
- Provider 能力分开建模：metadata/cover、discovery/release、magnet/download、import 不互相冒充。一个 Provider 失败不能覆盖本地扫描事实或最近一次成功快照。
- 匹配使用 normalized code、明确 external ID/SKU 和有限 fallback；多条候选不能静默选择第一条，必须精确匹配、报告歧义或保持未匹配。
- 对外请求使用 same-origin/allowed-origin 检查、timeout、响应大小上限、内容类型和字段校验、有限 retry、低频 pacing、缓存和可观测的 degraded 状态。
- 遇到 Cloudflare/CAPTCHA/managed challenge 时停止、进入 cooldown、fail closed；不得使用 stealth、代理池、Cookie 注入、CAPTCHA 绕过、隐藏 endpoint 探测或过度并发。
- 只把已授权、低频、必要的公开读取当作合规边界；公开 HTML、`robots.txt` 或 `Allow: /` 不等于允许批量复制、数据库同步或磁力再分发。

## 增量持久化、媒体与文件安全

- 长批次同步遵循“抓一个，保存一个”：每个成功项立即原子写入，使用 temp + rename 或等价机制更新 registry/checkpoint，重启可以从已保存进度继续。
- 明确区分“内存抓取成功”“已写入磁盘”“已写入数据库”“快照完整验证成功”。部分成功使用 `partial` 状态，不能等全部成功才保存，也不能把 partial 冒充 complete。
- 生成的测试资产必须进入项目允许的路径，运行真实 seed，检查数据库行数和 Web 显示；开发 fixture 与生产数据分开，不能仅凭文件存在宣称已接入。
- 媒体扫描器默认只读，不移动、不重命名、不删除视频；importer 是媒体写入的唯一边界。下载完成不等于已导入或本地 `present`，扫描失败不能批量把全部文件标为 missing。
- 文件、archive、upload、static serving 和备份路径都按 hostile input 处理：规范化路径、检查归属、限制大小/数量/类型/解压/超时，隔离 storage adapter，并在删除、发布、GC 前重新确认目标身份。
- 备份、restore、GC 和清理操作优先 dry-run、明确参数 grammar、权限检查和运行时 ownership；只有资源释放和清理成功后才输出操作成功。

## Worker、Provider 任务与外部系统

- 持久化异步任务明确 `type`、`domain`、`status`、`priority`、`attempts`、`maxAttempts`、`nextRunAt`、`lockedBy`、`lockedUntil` 和结构化 input/output/error。
- 使用 claim、heartbeat、sweep、cancel、启动恢复、优雅关停、并发上限、backpressure 和 cancellation；明确 at-least-once 语义并让 handler 幂等。
- 为外部 Provider 设置 timeout、retry budget、quota/cost 上限、circuit recovery、脱敏诊断和可注入测试 adapter；禁止记录 secret 或无上限的请求/响应内容。
- 任务生命周期对前端可见时，用 SSE、数据库通知或事件总线传递状态，但仍保留刷新、重试和断线恢复路径，不能把单次推送当作持久状态。
- Provider 调用通过 registry/runner 进入 service，并由纯 policy 决定 health、degradation、retry 和 circuit 状态；不要把 Provider-specific 分支散落到所有 service。

## 安全、私有网络与运行环境

- 公共和特权边界检查 XSS、CSRF、SSRF、path traversal、unsafe deserialization、request smuggling、resource exhaustion、依赖供应链、CSP、cookie、origin、CORS 和 webhook replay。
- secret 只在服务端或系统安全存储中存在；日志、错误、诊断和截图脱敏。认证要支持 revoke、logout、过期、last-used 审计和适当的 quota/rate limit。
- 个人应用默认优先私有网络、trusted device、QR/短码 enrollment、revocation、VPN/tailnet 或受保护 gateway，不把匿名 LAN 标记、Host 检查、same-origin 或自定义 header 当作 authentication。
- 如果部署媒体或 API 到公网，必须补齐 TLS、身份验证、trusted proxy、rate limit、audit log、Range/concurrency 控制和外部访问保护；没有这些证据不得宣称 public/private remote ready。
- 配置按环境分离，生产缺少危险配置时 fail fast；开发默认值不得泄漏到客户端 bundle 或生产凭据。
- 区分 liveness 和 readiness，健康检查只暴露安全诊断，保留 request/trace ID、结构化日志、指标、告警和 redaction 规则。
- MVP 之后优先使用维护良好的 structured logger，例如 `pino` 或更适合当前 stack 的库，不手写 logger；需要在更早阶段观测生产、安全或分布式故障时提前引入。
- 仓库变大后提供顶层 `verify`，把 boundary checks、typecheck、lint、unit test、focused integration test 和必要的 build 组织成可重复入口；外部系统失败要有 retry、degradation、恢复提示和可复制诊断。

## Electron、iOS 与 Tauri

- Electron 保持 `main`、`preload`、`renderer` 分离，使用 `contextBridge`、typed window bridge、`contextIsolation: true` 和明确的 native capability namespace。
- 新 Electron 项目优先 `electron-builder`，记录 targets、签名/notarization、auto-update、native permissions、crash diagnostics 和平台验收。构建目录或 `.app` 存在不等于已安装或验收成功。
- Electron 的 renderer client、IPC、cookie jar、Bearer token、`net.request` 和服务端 session middleware 要沿真实链路一起检查；需要时使用一次性 loopback code exchange，不默认依赖浏览器 cookie。
- iOS 使用独立的 SwiftUI/Xcode 客户端。可以共享 contracts、API client 和纯模型，但不要用 Tauri、WebView 或桌面网页直接替代 iOS；iOS 远程访问需要私有 origin、enrollment、revocation、TLS 和真实 4G/5G/HTTP Range 证据。
- Tauri 只在已有项目或明确的原生能力需求下维护；不为了“跨平台”新增复杂 Rust 业务层，也不把 Tauri 计划描述成已实现。

## 测试与验证

- 使用仓库现有 runner：`bun test`、Vitest、Playwright、XCTest、Swift test 或项目脚本；不另起一套测试体系。
- Vue SFC 或前端边界先 typecheck，再 build；新增 API、状态、模板表达式、事件类型、浏览器和资源文件都要有针对性验证。
- 业务测试覆盖权限、状态机、并发、取消、重试、资源释放、路径边界、空态、错误恢复、虚拟列表、固定弹窗、键盘焦点和追加失败；必要时加 contract/integration/browser/accessibility 测试。
- 设备、Safari、TURN、Provider、签名、公证、安装、Windows、生产和真实媒体播放分别记录，不能用 simulator、mock、build 或历史结果替代。
- 根 verify 被无关文件阻塞时保留聚焦结果并明确归因；不要为一项小改动改动无关 CSS、desktop、iOS、vendor 或生成文件。

## 代码形态与新项目

- 遵循当前仓库的分号、引号、尾逗号、注释语言和目录约定。边界输入使用 `unknown` 加 narrowing，适当使用 `as const`、`satisfies`、discriminated union 和 runtime schema，避免无依据的 `any`。
- 将时间、随机数、storage root、session、Provider、外部 client 和浏览器 runtime 注入测试；纯规则保持无 IO。
- 复用已有的 eslint/tsconfig、Biome、oxlint、Tailwind、lint-staged、Husky、Turbo 等工程配置，不要在局部 package 中复制出平行配置。
- 复用小型纯 helper 处理 normalization、slug validation、retry policy、path rendering、cache policy；部署和 storage 场景优先 deterministic ID、safe path、明确 cache header 和稳定 error code。
- 为复杂概念使用直接命名的包或模块，如 `task-engine`、`workflow-engine`、`deploy-core`、`storage`、`runtime`、`api-client`、`repository`、`service`、`model`，不要把领域代码塞进一个万能 util 文件。
- 新项目先做真实 vertical slice，不做空 scaffold；早期提供 `dev`、`build`、`typecheck`、`test`、`lint` 和 `verify` 脚本，并为实际边界写最小测试。
- 多界面全栈项目可使用 `apps/web`、`apps/api`、`services/worker`、`packages/shared`、`packages/db`、`packages/api-client`，但目录服务于边界，不为满足模板而拆分。

## 需要询问或暂停的情况

当选择会改变产品方向、package manager、框架、桌面/iOS 技术、数据库、认证、部署目标、Provider 合规边界、数据删除语义或视觉风格时，按“主动提问与不确定性处理”章节先询问。遇到安全挑战、权限缺失、未授权外部访问、无法验证的 Provider 字段、可能破坏用户数据或并行工作冲突时暂停并报告证据，不要靠猜测继续。
