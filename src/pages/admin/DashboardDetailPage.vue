<template>
  <el-card>
    <template #header>
      <div class="header-row">
        <span>模板详情</span>
        <el-space>
          <el-button @click="goBack">返回</el-button>
          <el-button type="success" @click="openScreen">打开预览</el-button>
        </el-space>
      </div>
    </template>

    <el-skeleton v-if="store.schemaLoading" :rows="8" animated />
    <el-result
      v-else-if="store.schemaError"
      icon="error"
      title="加载失败"
      :sub-title="store.schemaError"
    >
      <template #extra>
        <el-button type="primary" @click="reload">重试</el-button>
      </template>
    </el-result>

    <template v-else-if="store.activeSchema">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="标题">{{ store.activeSchema.title }}</el-descriptions-item>
        <el-descriptions-item label="版本">{{ store.activeSchema.version }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">
          {{ store.activeSchema.description || '无描述' }}
        </el-descriptions-item>
        <el-descriptions-item label="布局模式">{{
          store.activeSchema.layout.mode
        }}</el-descriptions-item>
        <el-descriptions-item label="组件数">{{
          store.activeSchema.widgets.length
        }}</el-descriptions-item>
      </el-descriptions>

      <el-divider />

      <el-table :data="store.activeSchema.widgets">
        <el-table-column prop="id" label="Widget ID" width="180" />
        <el-table-column prop="type" label="Type" width="140" />
        <el-table-column prop="datasource" label="Datasource" width="180" />
        <el-table-column label="Position">
          <template #default="scope">
            x={{ scope.row.position.x }}, y={{ scope.row.position.y }}, w={{
              scope.row.position.w
            }}, h={{ scope.row.position.h }}
          </template>
        </el-table-column>
      </el-table>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDashboardStore } from '@/store/dashboard'

const route = useRoute()
const router = useRouter()
const store = useDashboardStore()

const schemaKey = computed(() => String(route.params.schemaKey || ''))

const reload = async () => {
  await store.loadCatalog()
  if (schemaKey.value) {
    await store.loadSchema(schemaKey.value)
  }
}

watch(
  () => schemaKey.value,
  () => {
    void reload()
  }
)

onMounted(() => {
  void reload()
})

const goBack = () => void router.push('/app/dashboards')
const openScreen = () => void router.push(`/screen/${schemaKey.value}`)
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
