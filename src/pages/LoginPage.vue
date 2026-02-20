<template>
  <main class="login-page">
    <el-card class="login-card">
      <template #header>
        <strong>商城后台登录</strong>
      </template>

      <el-alert
        v-if="errorMessage"
        :title="errorMessage"
        type="error"
        show-icon
        :closable="false"
        class="mb12"
      />

      <el-form :model="form" @submit.prevent="submit">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="admin" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="admin123" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" style="width: 100%" @click="submit">
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <small>演示账号：admin / admin123</small>
    </el-card>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  username: 'admin',
  password: 'admin123'
})

const loading = ref(false)
const errorMessage = ref('')

const submit = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await auth.login(form.username, form.password)
    await router.push('/app/overview')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '登录失败，请检查账号密码'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100%;
  display: grid;
  place-content: center;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
}

.login-card {
  width: 380px;
}

.mb12 {
  margin-bottom: 12px;
}
</style>
