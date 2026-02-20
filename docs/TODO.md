# TODO (Insight Admin Upgrade)

## M1 - Repositioning & IA

- [x] 项目定位从单页大屏升级为通用业务分析后台
- [x] 后台信息架构：概览/看板中心/分析/数据源/告警/收藏
- [x] 路由改造为 `/app/*` 主干 + `/screen/:schemaKey` 预览模式

## M2 - UI Framework Upgrade

- [x] 接入 Element Plus
- [x] 实现后台壳子（侧栏 + 顶栏）
- [x] 建立统一后台视觉基线（light admin）

## M3 - Core Pages Delivery

- [x] 运营概览页面
- [x] 看板中心页面（搜索 + 收藏 + 详情 + 预览）
- [x] 模板详情页面
- [x] 指标分析页面
- [x] 数据源管理页面
- [x] 告警中心页面
- [x] 收藏管理页面

## M4 - Existing Engine Integration

- [x] 复用原 schema renderer 能力到预览页
- [x] 保留刷新调度与数据源兜底能力
- [x] 兼容旧入口重定向

## M5 - Quality & Verification

- [x] `pnpm lint`
- [x] `pnpm typecheck`
- [x] `pnpm test`
- [x] `pnpm build`
- [x] `pnpm test:e2e`
- [x] CI 通过并推送
