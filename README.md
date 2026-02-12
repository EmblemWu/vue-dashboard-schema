# Schema Dashboard Renderer (Vue3 + TS)

面向运营/管理者的大屏看板渲染器：通过 JSON Schema 定义布局、组件和数据源，动态渲染可配置看板。

## Features

- Schema 驱动渲染：`schemas/*.json` -> 页面
- 组件库（6类）：Text / NumberCard / Line / Bar / Pie / Table
- 数据源：mock + http polling
- 刷新调度：统一 scheduler、可见性暂停/恢复、全局降频
- 失败兜底：保留 last-success 数据并标记 stale/error
- 1920x1080 等比缩放适配
- CI：lint/typecheck/test/build
- 部署：GitHub Pages（workflow 已提供）

## Quick Start

```bash
pnpm install
pnpm dev
```

## Validation Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Project Structure

```text
src/
  app/
  pages/
  renderer/
    schema.ts
    validate.ts
    render.ts
    datasources/
    scheduler/
  widgets/
  ui/
  store/
  lib/
schemas/
docs/
```

## How To Add A Widget

1. 在 `src/widgets/` 新增组件文件（例如 `GaugeWidget.vue`）。
2. 更新 `src/renderer/schema.ts` 的 `WidgetType` 联合类型。
3. 更新 `src/renderer/validate.ts` 的 zod `type` 枚举。
4. 在 `src/renderer/render.ts` 的 `widgetMap` 注册新组件。
5. 在 schema 文件中添加 widget 配置并验证渲染。

## How To Add A Datasource

1. 在 `src/renderer/schema.ts` 扩展 datasource 类型定义。
2. 在 `src/renderer/validate.ts` 扩展 zod 校验。
3. 在 `src/renderer/datasources/index.ts` 的 `loadSource` 中添加处理逻辑。
4. 在 schema 中配置新 datasource，并在 widget 里通过 `datasource` 绑定。

## Deployment (GitHub Pages)

- CI 构建后上传 `dist` 到 GitHub Pages。
- workflow: `.github/workflows/deploy-pages.yml`
- `vite` 的 `base` 由 `VITE_BASE_PATH` 注入。

Demo 链接（部署后替换）：`https://<your-account>.github.io/<your-repo>/`

## Docs

- 里程碑：`docs/TODO.md`
- Schema 规范：`docs/SCHEMA.md`
- 性能记录：`docs/PERF_LOG.md`
- 使用说明（org）：`docs/USER_GUIDE.org`
