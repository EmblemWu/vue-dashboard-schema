import { expect, test } from '@playwright/test'

test('mall admin flow: login -> overview -> core modules', async ({ page }) => {
  await page.goto('/#/login')
  await page.getByRole('button', { name: '登录' }).click()

  await expect(page).toHaveURL(/#\/app\/overview/)
  await expect(page.getByText('近7笔订单金额走势')).toBeVisible()

  await page.goto('/#/app/products')
  await expect(page.getByText('商品管理')).toBeVisible()
  await expect(page.getByText('无线降噪耳机 Pro')).toBeVisible()

  await page.goto('/#/app/orders')
  await expect(page.getByText('订单管理')).toBeVisible()
  await page.locator('.el-table__row').first().getByRole('button', { name: '详情' }).click()
  await expect(page.getByText('订单详情')).toBeVisible()

  await page.goto('/#/app/users')
  await expect(page.getByText('用户管理')).toBeVisible()

  await page.goto('/#/app/managers')
  await expect(page.getByText('管理员管理')).toBeVisible()
  await expect(page.getByText('ops_admin')).toBeVisible()

  await page.goto('/#/app/coupons')
  await expect(page.getByText('营销管理（优惠券）')).toBeVisible()

  await page.goto('/#/app/notices')
  await expect(page.getByText('公告管理')).toBeVisible()

  await page.goto('/#/app/settings')
  await expect(page.getByText('系统设置')).toBeVisible()
})
