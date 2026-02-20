<template>
  <el-card>
    <template #header>
      <div class="header-row">
        <span>系统设置</span>
        <el-button @click="load">刷新</el-button>
      </div>
    </template>

    <el-table v-loading="loading" :data="rows">
      <el-table-column prop="key" label="配置键" width="240" />
      <el-table-column prop="description" label="说明" width="220" />
      <el-table-column label="配置值">
        <template #default="scope">
          <el-input v-model="scope.row.value" @change="save(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchSettingsApi, updateSettingApi, type SiteSetting } from '@/api/mall'

const rows = ref<SiteSetting[]>([])
const loading = ref(false)

const load = async () => {
  loading.value = true
  try {
    rows.value = await fetchSettingsApi()
  } finally {
    loading.value = false
  }
}

const save = async (row: SiteSetting) => {
  await updateSettingApi(row.id, {
    key: row.key,
    value: row.value,
    description: row.description
  })
  ElMessage.success(`配置 ${row.key} 已保存`)
}

onMounted(() => {
  void load()
})
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
