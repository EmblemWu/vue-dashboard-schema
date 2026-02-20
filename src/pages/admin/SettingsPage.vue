<template>
  <el-card>
    <template #header>系统设置</template>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="API Base URL">{{ apiBase }}</el-descriptions-item>
      <el-descriptions-item label="默认登录账号">admin</el-descriptions-item>
      <el-descriptions-item label="默认密码">admin123</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script setup lang="ts">
const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'
</script>
