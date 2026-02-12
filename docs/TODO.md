# TODO Milestones

## Week1 - 骨架与规范 + 大屏容器

- [x] 初始化 Vue3 + TypeScript(strict) + Vite + pnpm
- [x] 配置 `eslint/prettier/husky/commitlint/lint-staged`
- [x] 配置 CI（lint/typecheck/test/build）
- [x] 实现 1920x1080 等比缩放容器
- [x] 提供基础 UI 组件（Button/Card/EmptyState）
- [x] 顶部工具条壳子
- [x] README 与 SCHEMA 草案

## Week2 - Schema MVP 静态渲染

- [x] 定义 schema v1 基础字段
- [x] 提供 `schemas/demo-operations.json`
- [x] `schema -> 页面` 动态渲染流程
- [x] 支持模板切换（2 套 schema）
- [x] 文档更新 v1 示例

## Week3 - Widgets 扩展 + ECharts

- [x] 接入 ECharts（Line/Bar/Pie）
- [x] 实现 6 类 widgets：Text/NumberCard/Line/Bar/Pie/Table
- [x] Widget 默认值和容错逻辑
- [x] 完整大屏模板可展示

## Week4 - 数据源系统与兜底

- [x] 实现 `mock` 数据源
- [x] 实现 `http polling` 数据源
- [x] Widget 绑定 datasource key
- [x] 失败兜底：保留 last-success + stale/error 标识
- [x] PERF_LOG baseline 记录

## Week5 - Scheduler 统一刷新与合并请求

- [x] 单一全局 scheduler（统一 tick）
- [x] 根据 datasource 聚合请求，避免 N interval
- [x] 同 datasource 多 widget 共享 fetch
- [x] PERF_LOG 记录合并收益

## Week6 - 性能深化

- [x] 不可见页面暂停刷新（`document.hidden`）
- [x] 可见恢复后补一次刷新
- [x] 全局降频开关（normal/x5/x10）
- [x] PERF_LOG 记录降频策略

## Week7 - 校验与版本策略

- [x] zod 运行时校验 schema
- [x] 错误提示不崩溃
- [x] schema version（v1/v1.1）兼容说明
- [x] SCHEMA 字段表与迁移策略

## Week8 - 收尾与部署

- [x] 完善 README（新增 widget/数据源流程）
- [x] GitHub Pages 部署 workflow
- [x] 最终验收命令通过
- [x] TODO 勾选完结
