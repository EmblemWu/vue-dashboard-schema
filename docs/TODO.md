# TODO (Mall Admin + Django)

## Milestone A - Django Backend Foundation

- [x] 创建 Django 工程与 `.venv`
- [x] 接入 DRF + JWT + CORS
- [x] 建立核心领域模型：Category/Product/Order/OrderItem
- [x] 提供认证与业务 API
- [x] 提供 demo 初始化命令（admin + 样例数据）

## Milestone B - Frontend Mall Admin

- [x] 登录页与鉴权守卫
- [x] 后台壳子与商城导航
- [x] 概览接入真实 API
- [x] 分类/商品/订单页面接入真实 API
- [x] 保留看板全屏预览模式

## Milestone C - Engineering & Delivery

- [x] `pnpm lint`
- [x] `pnpm typecheck`
- [x] `pnpm test`
- [x] `pnpm build`
- [x] `pnpm test:e2e`
- [x] 提交并推送

## Milestone D - Phase 2 CRUD & Workflow

- [x] 概览页嵌入统一风格运营看板（去除跳转按钮）
- [x] 分类管理：搜索 + 新建 + 编辑 + 启停 + 删除
- [x] 商品管理：筛选 + 新建 + 编辑 + 上下架 + 删除
- [x] 订单管理：筛选 + 状态流转（待支付/待发货/发货/完成/取消）
- [x] 操作反馈：确认弹窗 + 成功提示 + 刷新列表
- [x] 二阶段验收命令全通过

## Milestone E - Rich Domain & Mock Data

- [x] 新增用户域（Customer）后端模型与 API
- [x] 新增优惠券域（Coupon）后端模型与 API
- [x] 扩充 demo 数据量（分类/商品/订单/用户/优惠券）
- [x] 用户管理页面接入真实 API（搜索 + 新建 + 编辑 + 启停）
- [x] 营销管理页面接入真实 API（搜索 + 新建 + 编辑 + 状态切换）
- [x] e2e 增强：覆盖 users/coupons 页面链路
