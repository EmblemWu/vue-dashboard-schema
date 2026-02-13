import { expect, test } from '@playwright/test'

test('path A and B: templates -> detail -> screen + favorites manage', async ({ page }) => {
  await page.goto('/#/templates')
  await expect(page.getByRole('heading', { name: '模板列表' })).toBeVisible()
  await expect(page.getByTestId('templates-list')).toBeVisible()

  const firstCard = page.locator('[data-testid="templates-list"] article').first()
  await firstCard.getByRole('button', { name: '收藏' }).click()
  await firstCard.getByRole('link', { name: '查看详情' }).click()

  await expect(page).toHaveURL(/#\/templates\//)
  await expect(page.getByTestId('template-detail')).toBeVisible()
  await page.getByRole('link', { name: '打开大屏' }).click()

  await expect(page).toHaveURL(/#\/screen\//)
  await expect(
    page.getByRole('heading', { name: /运营总览大屏|管理驾驶舱|Schema Dashboard/ })
  ).toBeVisible()

  await page.goto('/#/favorites')
  await expect(page.getByRole('heading', { name: '收藏管理' })).toBeVisible()
  await expect(page.getByTestId('favorites-list')).toBeVisible()
})
