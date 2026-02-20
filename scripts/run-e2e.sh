#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

source .venv/bin/activate
pip install -r backend/requirements.txt >/tmp/pip-e2e.log 2>&1

cd backend
python manage.py migrate >/tmp/django-migrate.log 2>&1
python manage.py bootstrap_demo >/tmp/django-seed.log 2>&1
python manage.py runserver 127.0.0.1:8000 >/tmp/django-e2e.log 2>&1 &
DJANGO_PID=$!
cd "$ROOT_DIR"

cleanup() {
  kill "$VITE_PID" 2>/dev/null || true
  kill "$DJANGO_PID" 2>/dev/null || true
}
trap cleanup EXIT

for _ in $(seq 1 60); do
  curl -sf http://127.0.0.1:8000/api/auth/me >/dev/null 2>&1 || true
  if curl -sf http://127.0.0.1:8000/admin/login/ >/dev/null; then
    break
  fi
  sleep 1
done

pnpm dev --host 127.0.0.1 --port 46001 --strictPort >/tmp/vite-e2e.log 2>&1 &
VITE_PID=$!

for _ in $(seq 1 60); do
  if curl -sf http://127.0.0.1:46001/ >/dev/null; then
    break
  fi
  sleep 1
done

pnpm exec playwright test
