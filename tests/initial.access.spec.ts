/// <reference types="node" />
import { test } from "@playwright/test";
import { writeToCSV } from "../helpers/saveToFile";
import { ProductCatalogPage } from "../pages/product-catalog.page";

test("Grab catalog items list", async ({ page }) => {
  await page.goto(`${process.env.TARGET_PAGE}`);

  // Expects page to have a heading with the name of Installation.
  const productCatalogPage = new ProductCatalogPage(page);
  await productCatalogPage.getSortListButton.click();

  // Store scraped data - allows dynamic columns
  const allItems: Array<Record<string, string | number>> = [];

  const catalogPages = await productCatalogPage.filterMenuItem.evaluateAll(
    (items) =>
      items
        .map((item) => ({
          href: item.getAttribute("href"),
          text: item.textContent?.trim() ?? "",
        }))
        .filter((item): item is { href: string; text: string } =>
          Boolean(item.href && item.text),
        ),
  );

  // navigate through all catalog pages and collect data
  for (const { href, text: catalogName } of catalogPages) {
    await page.goto(href);
    await page.waitForLoadState("networkidle");

    /*
     * Recursively collect data from product catalog items
     */
    await productCatalogPage.showAllCatalogPages(
      async (pageNum, totalPages) => {
        // const maxPages: number = totalPages ? totalPages : 1;
        // console.log(`Processing page ${pageNum} of ${maxPages}`);

        const itemNames =
          await productCatalogPage.productTableTitle.allTextContents();

        for (const itemName of itemNames.slice(0, -1)) {
          allItems.push({
            page: `${process.env.TARGET_PAGE}`,
            itemText: catalogName,
            itemName: itemName.trim(),
            // Example additional columns (uncomment and modify to add more data):
            // price: await item.locator('.price').textContent() || '',
            // url: await item.locator('a').getAttribute('href') || '',
            // description: await item.locator('.description').textContent() || '',
            timestamp: new Date().toISOString(),
          });
        }
      },
    );
  }

  // Write all collected data to CSV after scraping is complete
  writeToCSV(allItems);
});
