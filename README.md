# Mall Admin (Vue3 + Element Plus + ECharts + Django)

一个可交付的商城后台项目：前端为 Vue3 管理台，后端为 Django DRF API。

## Tech Stack

- Frontend: Vue3 + TypeScript + Vite + Pinia + Element Plus + ECharts
- Backend: Django + DRF + JWT + SQLite (dev)
- Quality: ESLint + Typecheck + Vitest + Playwright + GitHub Actions

## Features (V1)

- 登录鉴权（JWT）
- 角色权限（RBAC，菜单/路由/按钮级）
- 运营概览（真实统计接口）
- 分类管理（真实 API）
- 商品管理（真实 API）
- 订单管理（真实 API，含发货流程）
- 用户管理（真实 API）
- 管理员管理（真实 API，含重置密码）
- 优惠券管理（真实 API）
- 公告管理（真实 API）
- 系统设置管理（真实 API）
- 大屏预览模式（保留）

## Quick Start

### 1) Backend

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r backend/requirements.txt
cd backend
python manage.py migrate
python manage.py bootstrap_demo
python manage.py runserver
```

### 2) Frontend

```bash
pnpm install
pnpm dev
```

默认前端 API 地址：`http://127.0.0.1:8000/api`

演示账号：

- username: `admin`
- password: `admin123`

## Scripts

```bash
pnpm dev
pnpm dev:backend
pnpm backend:migrate
pnpm backend:seed
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

## Main Routes

- `/#/login`
- `/#/app/overview`
- `/#/app/categories`
- `/#/app/products`
- `/#/app/orders`
- `/#/app/users`
- `/#/app/managers`
- `/#/app/coupons`
- `/#/app/notices`
- `/#/app/settings`
- `/#/screen/demo-operations`

## Backend API

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/permissions`
- `GET /api/auth/managers/`
- `GET /api/dashboard/overview`
- `GET /api/catalog/categories`
- `GET /api/catalog/products`
- `GET /api/orders/orders`
- `GET /api/common/customers`
- `GET /api/common/coupons`
- `GET /api/common/notices`
- `GET /api/common/settings`

## Notes

- 你提供的“完整代码”和“后端api源码【仅供参考】”作为能力标杆，本项目已转向前后端一体的商城后台路线。
- 当前版本已补齐用户/营销/公告/设置等核心后台域，并持续对照参考项目增强操作深度。
- 权限模型：`superuser` 拥有全部权限，`staff` 可读管理员列表但不能新增/编辑/重置密码。
