# Resume-grade Delivery TODO

## Milestone 1 - 产品路径闭环

- [x] 新增模板列表页 `/templates`
- [x] 新增模板详情页 `/templates/:schemaKey`
- [x] 新增收藏管理页 `/favorites`
- [x] 大屏页改为 `/screen/:schemaKey`
- [x] 路由 404 页面
- [x] 用户路径 A：列表 -> 详情 -> 大屏
- [x] 用户路径 B：列表收藏 -> 收藏管理 -> 大屏

## Milestone 2 - 状态与异常闭环

- [x] 列表页支持加载/空/错误/重试
- [x] 详情页支持加载/空/错误/重试
- [x] 大屏页支持加载/错误/重试
- [x] 全局 ErrorBoundary
- [x] 资源加载失败兜底（图表失败降级文案）

## Milestone 3 - 工程质量闭环

- [x] `pnpm lint` 通过
- [x] `pnpm typecheck` 通过
- [x] `pnpm test` 通过
- [x] `pnpm build` 通过
- [x] Playwright e2e 关键路径覆盖
- [x] CI 集成 e2e

## Milestone 4 - 性能与文档闭环

- [x] PERF_LOG 提供 baseline
- [x] PERF_LOG 提供 2 次优化对比
- [x] PERF_LOG 提供可复现步骤
- [x] README 完整化（定位/功能/架构/取舍/限制/运行部署）
- [x] README 提供线上 demo 链接
- [x] 目录分层体现 `app/pages/features/ui/lib`
