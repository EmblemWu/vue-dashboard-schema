import { expect, test } from '@playwright/test'

test('admin flow: dashboard center -> detail -> screen + favorites', async ({ page }) => {
  await page.goto('/#/app/dashboards')
  await expect(page.getByText('看板模板中心')).toBeVisible()
  await expect(page.getByTestId('templates-list')).toBeVisible()

  const firstRow = page.locator('[data-testid="templates-list"] .el-table__row').first()
  await firstRow.getByRole('button', { name: '收藏' }).click()
  await firstRow.getByRole('button', { name: '详情' }).click()

  await expect(page).toHaveURL(/#\/app\/dashboards\//)
  await expect(page.getByText('模板详情')).toBeVisible()
  await page.getByRole('button', { name: '打开预览' }).click()

  await expect(page).toHaveURL(/#\/screen\//)
  await expect(
    page.getByRole('heading', { name: /运营总览大屏|管理驾驶舱|Schema Dashboard/ })
  ).toBeVisible()

  await page.goto('/#/app/favorites')
  await expect(page.getByText('收藏看板')).toBeVisible()
  await expect(page.getByTestId('favorites-list')).toBeVisible()
})
