# Mall Admin (Vue3 + Element Plus + ECharts + Django)

一个可交付的商城后台项目：前端为 Vue3 管理台，后端为 Django DRF API。

## Tech Stack

- Frontend: Vue3 + TypeScript + Vite + Pinia + Element Plus + ECharts
- Backend: Django + DRF + JWT + SQLite (dev)
- Quality: ESLint + Typecheck + Vitest + Playwright + GitHub Actions

## Features (V1)

- 登录鉴权（JWT）
- 运营概览（真实统计接口）
- 分类管理（真实 API）
- 商品管理（真实 API）
- 订单管理（真实 API）
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
- `/#/screen/demo-operations`

## Backend API

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard/overview`
- `GET /api/catalog/categories`
- `GET /api/catalog/products`
- `GET /api/orders/orders`

## Notes

- 你提供的“完整代码”和“后端api源码【仅供参考】”作为能力标杆，本项目已转向前后端一体的商城后台路线。
- V1 优先打通真实交易后台主链路，营销/用户高级能力将在下一阶段扩展。
