# Schema Dashboard Renderer (Vue3 + TS)

面向运营/管理者的大屏看板渲染器：通过 JSON Schema 描述布局、组件和数据源，运行时动态渲染，支持模板管理、收藏管理、统一刷新调度与失败兜底。

## Demo

- Online: `https://emblemwu.github.io/vue-dashboard-schema/`

## Product Positioning

- 目标用户：运营、管理者、分析人员。
- 核心价值：低代码配置大屏模板，不改前端代码即可切换展示。
- 交付目标：在“稳定展示 + 性能可控 + 异常可恢复”之间取得平衡。

## Core Features

- Schema 驱动渲染（`schemas/*.json`）
- 6 类 widgets：Text / NumberCard / Line / Bar / Pie / Table
- 数据源：mock + http polling
- 刷新策略：统一 scheduler、请求合并、可见性暂停、恢复补偿、全局降频
- 兜底策略：last-success + stale/error 标记，图表资源失败降级
- 页面闭环：模板列表 / 模板详情 / 收藏管理 / 大屏页

## User Flows

1. 路径 A：模板列表 -> 模板详情 -> 打开大屏
2. 路径 B：模板列表收藏 -> 收藏管理 -> 打开大屏

## Architecture

```text
src/
  app/        # 应用入口、路由、全局错误边界
  pages/      # 路由页面
  features/   # 业务能力（templates/favorites）
  renderer/   # schema 类型、校验、渲染、数据源、调度器
  widgets/    # 可视化组件
  ui/         # 通用 UI 状态组件
  lib/        # 通用工具
  store/      # 全局 dashboard 状态
```

## Key Trade-offs

- 选择“统一 scheduler”而不是组件各自 interval：实现复杂度更高，但请求控制更稳定。
- 选择运行时 zod 校验：牺牲少量初始化开销，换来模板错误可诊断且不崩溃。
- 选择 hash 路由 + Pages 部署：配置简单，适合静态托管场景。

## Known Limitations

- e2e 当前覆盖核心路径 1 条，复杂异常链路仍可继续补。
- ECharts 体积较大，构建产物存在大 chunk 警告。
- HTTP datasource 仅支持基础 GET/POST；鉴权、签名、重放策略尚未内建。

## Local Development

```bash
pnpm install
pnpm dev
```

## Quality Gates

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

## CI / Deployment

- CI: `.github/workflows/ci.yml`（lint/typecheck/test/build/e2e）
- Deploy: `.github/workflows/deploy-pages.yml`（GitHub Pages）

## Extensibility

### Add Widget

1. 在 `src/widgets/` 新建组件。
2. 更新 `src/renderer/schema.ts` 的 `WidgetType`。
3. 更新 `src/renderer/validate.ts` 的 zod 枚举。
4. 在 `src/renderer/render.ts` 注册组件映射。

### Add Datasource

1. 扩展 `src/renderer/schema.ts` 数据源类型。
2. 扩展 `src/renderer/validate.ts` 校验。
3. 在 `src/renderer/datasources/index.ts` 添加执行逻辑。
4. 在 schema 里绑定 datasource key。

## Docs

- TODO: `docs/TODO.md`
- Schema: `docs/SCHEMA.md`
- Perf: `docs/PERF_LOG.md`
- User Guide (org): `docs/USER_GUIDE.org`
