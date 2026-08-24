# puzzle-fuzzy-skill

Puzzle Fuzzy 的个人 TypeScript 全栈、产品界面、Provider、桌面端和交付偏好 skill。

## 定位

这是个人偏好层，不是通用最佳实践。使用时必须遵循：

1. 当前用户要求和安全约束。
2. 实际版本对应的官方文档、标准和安全指南。
3. 当前仓库的架构、脚本、依赖和既有约定。
4. 本 skill 中的个人默认。

当这些依据仍然无法决定方案时，说明不确定性并询问，不要猜测产品方向。

## 内容

- [SKILL.md](SKILL.md)：中文个人工程规则，包括只读审计、证据等级、Git 协作、真实产品 UI、虚拟滚动、固定高度弹窗、Lucide 图标、Electron Builder、Provider 合规、增量持久化、媒体安全和原生平台边界。
- [agents/openai.yaml](agents/openai.yaml)：Codex 界面显示信息和默认调用提示。

## 调用

需要这些个人偏好时可以显式调用 `$puzzle-fuzzy-skill`。它只应作为官方最佳实践和当前项目约定之后的补充层。

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
