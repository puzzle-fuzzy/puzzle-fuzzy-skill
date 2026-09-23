# puzzle-fuzzy-skill

[![skills.sh](https://skills.sh/b/puzzle-fuzzy/puzzle-fuzzy-skill)](https://skills.sh/puzzle-fuzzy/puzzle-fuzzy-skill)

Puzzle Fuzzy 的个人 TypeScript 全栈、产品界面、Provider、桌面端、简单 Bun 脚本和交付偏好 skill。对于用户明确要求“可以正式上线”的长期全栈多端项目，它会从独立的私有生产底座开始；简单脚本仍只用 Bun 运行，不默认创建 Git/GitHub 仓库或复杂架构。

## 定位

这是个人偏好层，不是通用最佳实践。使用时必须遵循：

1. 当前用户要求和安全约束。
2. 实际版本对应的官方文档、标准和安全指南。
3. 当前仓库的架构、脚本、依赖和既有约定。
4. 本 skill 中的个人默认。

当这些依据仍然无法决定方案时，说明不确定性并询问，不要猜测产品方向。

## 内容

- [SKILL.md](SKILL.md)：中文个人工程规则，包括只读审计、证据等级、worktree 与分支交付、临时文件清理、代码与文档同步、根目录 `PRODUCT.md` 与 `impeccable` UI 边界、真实产品 UI、虚拟滚动、固定高度弹窗、Lucide 图标、Electron Builder、Provider 合规、增量持久化、媒体安全和原生平台边界。
- [references/production-starter.md](references/production-starter.md)：独立生产底座的范围、版本、生成方式、必需产品决策和验证边界。
- [scripts/scaffold-production-project.ts](scripts/scaffold-production-project.ts)：从模板复制为新的无历史 Git 项目；它不创建远程或 push。
- [agents/openai.yaml](agents/openai.yaml)：Codex 界面显示信息和默认调用提示。

## 生产底座

当用户明确要求生产全栈多端项目时，使用私有模板仓库 [`puzzle-fuzzy-production-starter`](https://github.com/puzzle-fuzzy/puzzle-fuzzy-production-starter)。它提供 Bun + Turborepo、Elysia API、React + HeroUI v3 内部管理端、原生小程序、Drizzle/PostgreSQL、安全日志、迁移、根测试和 `verify`，但不包含任何产品、账号、凭据或部署数据。

默认仅有内部 `apps/admin`；公开 `apps/web` 必须由用户明确确认。使用前后都要先读 [生产底座说明](references/production-starter.md)，并继续确认认证、业务、品牌、部署和 Provider 边界。

## 调用

需要这些个人偏好时可以显式调用 `$puzzle-fuzzy-skill`。它只应作为官方最佳实践和当前项目约定之后的补充层。

通过 [skills.sh](https://skills.sh/) 安装：

```bash
npx skills add puzzle-fuzzy/puzzle-fuzzy-skill
```

## 校验

使用 skill-creator 提供的 validator。把 `<CODEX_HOME>` 替换为当前机器的 Codex home 路径：

```bash
python3 <CODEX_HOME>/skills/.system/skill-creator/scripts/quick_validate.py .
```

Windows PowerShell：

```powershell
python <CODEX_HOME>\skills\.system\skill-creator\scripts\quick_validate.py .
```

此外还应运行：

```bash
git diff --check
```

validator 只能检查 skill 结构、frontmatter 和未完成的 scaffold 占位符，不能替代项目自身的 typecheck、test、build、浏览器、设备、Provider、打包和生产验收。
