import { expect, test } from '@playwright/test'

test('mall admin flow: login -> embedded overview dashboard -> products -> orders', async ({
  page
}) => {
  await page.goto('/#/login')
  await page.getByRole('button', { name: '登录' }).click()

  await expect(page).toHaveURL(/#\/app\/overview/)
  await expect(page.getByText('近7笔订单金额走势')).toBeVisible()
  await expect(page.getByText('订单状态分布')).toBeVisible()
  await expect(page.getByText('分类销售排行（Top5）')).toBeVisible()

  await page.goto('/#/app/products')
  await expect(page.getByText('商品管理')).toBeVisible()
  await expect(page.getByText('无线降噪耳机 Pro')).toBeVisible()

  await page.goto('/#/app/orders')
  await expect(page.getByText('订单管理')).toBeVisible()
  await expect(page.getByText('SO202602200001')).toBeVisible()
})
