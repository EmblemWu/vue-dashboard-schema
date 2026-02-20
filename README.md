# Insight Admin (Vue3 + ECharts + Element Plus)

一个通用业务分析后台：支持运营概览、看板模板中心、指标分析、数据源管理、告警中心与大屏预览。

## Demo

- https://emblemwu.github.io/vue-dashboard-schema/

## Product Positioning

- 从单页大屏升级为可交付后台系统（BI-lite + 运营工作台）
- 适用于电商、SaaS、内容平台等常见业务分析场景

## Core Modules

- 运营概览：关键 KPI、趋势图、待关注事项
- 看板中心：模板检索、收藏、详情、预览
- 指标分析：时间与分群维度对比
- 数据源管理：连接信息、状态展示、连接测试入口
- 告警中心：规则与事件记录
- 大屏预览：保留原 schema 渲染能力，作为全屏模式

## Tech Stack

- Vue3 + TypeScript(strict) + Vite + pnpm
- UI: Element Plus
- Charts: ECharts (via vue-echarts)
- State: Pinia
- Validation: zod
- CI/CD: GitHub Actions + GitHub Pages

## Project Structure

```text
src/
  app/        # layout, route, app-level config
  pages/      # admin pages + screen preview page
  features/   # templates/favorites
  renderer/   # schema render engine
  ui/         # shared UI and chart wrappers
  widgets/    # schema widgets
  store/      # domain stores
  lib/        # utils
```

## Run

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

## Main Routes

- `/#/app/overview`
- `/#/app/dashboards`
- `/#/app/dashboards/:schemaKey`
- `/#/app/analysis`
- `/#/app/datasources`
- `/#/app/alerts`
- `/#/app/favorites`
- `/#/screen/:schemaKey`

## Docs

- `docs/TODO.md`
- `docs/SCHEMA.md`
- `docs/PERF_LOG.md`
- `docs/USER_GUIDE.org`
