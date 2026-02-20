<template>
  <section>
    <el-row v-loading="loading" :gutter="12">
      <el-col :span="6">
        <el-card><el-statistic title="商品总数" :value="stats.product_count" /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card><el-statistic title="在售商品" :value="stats.on_sale_count" /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card><el-statistic title="待支付订单" :value="stats.pending_orders" /></el-card>
      </el-col>
      <el-col :span="6">
        <el-card
          ><el-statistic title="今日营收" :value="Number(stats.revenue || 0)" prefix="¥"
        /></el-card>
      </el-col>
    </el-row>

    <el-row :gutter="12" class="mt12">
      <el-col :span="24">
        <el-card>
          <template #header>快速入口</template>
          <el-space wrap>
            <el-button type="primary" @click="go('/app/products')">新建商品</el-button>
            <el-button @click="go('/app/orders')">处理订单</el-button>
            <el-button @click="go('/app/categories')">维护分类</el-button>
            <el-button @click="go('/screen/demo-operations')">看板预览</el-button>
          </el-space>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchOverviewApi, type OverviewStats } from '@/api/mall'

const router = useRouter()
const loading = ref(false)
const stats = reactive<OverviewStats>({
  product_count: 0,
  on_sale_count: 0,
  pending_orders: 0,
  paid_orders: 0,
  revenue: '0'
})

const load = async () => {
  loading.value = true
  try {
    Object.assign(stats, await fetchOverviewApi())
  } finally {
    loading.value = false
  }
}

const go = (path: string) => void router.push(path)

onMounted(() => {
  void load()
})
</script>

<style scoped>
.mt12 {
  margin-top: 12px;
}
</style>
