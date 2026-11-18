import { expect, test } from "@playwright/test";

test("都道府県を選択し天気を取得できる", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: "天気を確認" });
  await expect(button).toBeDisabled();
  await page.getByLabel("都道府県を選択してください").selectOption("東京都");
  await button.click();
  await expect(page.getByRole("heading", { name: "Tokyo" })).toBeVisible();
  await expect(page.getByText("22°C", { exact: true })).toBeVisible();
});

test("APIエラーと再試行の導線を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("都道府県を選択してください").selectOption("鳥取県");
  await page.getByRole("button", { name: "天気を確認" }).click();
  await expect(page.getByText(/city not found/)).toBeVisible();
  await expect(page.getByRole("button", { name: /再試行/ })).toBeVisible();
});
