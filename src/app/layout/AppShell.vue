<template>
  <el-container class="app-shell">
    <el-aside width="220px" class="app-shell__aside">
      <div class="brand">Insight Admin</div>
      <el-menu :default-active="activePath" router class="app-shell__menu">
        <el-menu-item v-for="item in NAV_ITEMS" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="app-shell__header">
        <div>
          <h2>{{ title }}</h2>
          <small>{{ subtitle }}</small>
        </div>
        <div class="app-shell__actions">
          <el-tag type="success">Online</el-tag>
          <el-text size="small">{{ auth.user?.username ?? 'guest' }}</el-text>
          <el-avatar size="small">{{ initials }}</el-avatar>
          <el-button text type="danger" @click="logout">退出</el-button>
        </div>
      </el-header>

      <el-main class="app-shell__main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NAV_ITEMS } from '@/app/config/navigation'
import { useAuthStore } from '@/store/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const activePath = computed(() => {
  if (route.path.startsWith('/app/dashboards/')) {
    return '/app/dashboards'
  }
  return route.path
})

const current = computed(() => NAV_ITEMS.find((item) => item.path === activePath.value))
const title = computed(() => current.value?.label ?? 'Insight Admin')
const subtitle = computed(() => '商城运营后台')
const initials = computed(() => (auth.user?.username?.slice(0, 2) ?? 'GU').toUpperCase())

const logout = () => {
  auth.logout()
  void router.push('/login')
}
</script>

<style scoped>
.app-shell {
  min-height: 100%;
  background: #f4f6f8;
}

.app-shell__aside {
  border-right: 1px solid #e9edf2;
  background: #fff;
}

.brand {
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: #1f2a37;
  border-bottom: 1px solid #eef2f6;
}

.app-shell__menu {
  border-right: none;
}

.app-shell__header {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #e9edf2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-shell__header h2 {
  margin: 0;
  font-size: 18px;
  color: #1f2a37;
}

.app-shell__header small {
  color: #6b7280;
}

.app-shell__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-shell__main {
  padding: 16px;
}
</style>
