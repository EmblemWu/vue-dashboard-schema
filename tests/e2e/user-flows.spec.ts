import { expect, test } from '@playwright/test'

test('mall admin flow: login -> products -> orders -> screen', async ({ page }) => {
  await page.goto('/#/login')
  await page.getByRole('button', { name: '登录' }).click()

  await expect(page).toHaveURL(/#\/app\/overview/)
  await page.goto('/#/app/products')
  await expect(page.getByText('商品管理')).toBeVisible()
  await expect(page.getByText('无线降噪耳机 Pro')).toBeVisible()

  await page.goto('/#/app/orders')
  await expect(page.getByText('订单管理')).toBeVisible()
  await expect(page.getByText('SO202602200001')).toBeVisible()

  await page.goto('/#/screen/demo-operations')
  await expect(
    page.getByRole('heading', { name: /运营总览大屏|Schema Dashboard|管理驾驶舱/ })
  ).toBeVisible()
})
