import { Locator, Page } from "@playwright/test";

export class ProductCatalogPage {
  readonly sortListIcon: Locator;
  readonly pagerItemText: Locator;
  readonly arrowRightIcon: Locator;
  readonly filterMenuItem: Locator;
  readonly productTableRow: Locator;
  readonly productTableTitle: Locator;
  readonly getSortListButton: Locator;

  /**
   * Locators object containing all CSS selectors used in the tests
   */
  constructor(private readonly page: Page) {
    this.sortListIcon = this.page.locator(".icon.icon--sort-list");
    this.pagerItemText = this.page.locator(".pager__item-text");
    this.arrowRightIcon = this.page.locator(".icon.icon--arrow-right");
    this.filterMenuItem = this.page.locator(".filterMenu-a");
    this.productTableRow = this.page.locator(
      ".productsTable-row.j-product-row",
    );
    this.productTableTitle = this.page.locator(".productsTable-cell.__title");
    this.getSortListButton = this.page.locator(".icon.icon--sort-list");
  }

  /**
   * Navigate through all catalog pages and perform action on each
   */
  async showAllCatalogPages(
    onPageAction?: (pageNum: number, totalPages: number) => Promise<void>,
  ) {
    try {
      // Get all pager items to determine total pages
      const pagerItems = await this.pagerItemText.all();
      if (pagerItems.length < 1) {
        console.warn("Unable to find pagination info - may only have 1 page");
        return;
      }

      /*
       * The second-to-last item contains the total page count
       * '-3 slice all buttons that are not page numbers, e.g., "Next" and "Last"'
       */
      const lastPageText =
        await pagerItems[pagerItems.length - 3].textContent();
      if (!lastPageText) {
        console.warn("Could not extract page count from pagination");
        return;
      }

      const totalPages = Number(lastPageText);
      console.log(`Total pages found: ${totalPages}`);

      // Execute action on first page before navigation
      if (onPageAction) {
        await onPageAction(1, totalPages);
      }

      // Navigate through all pages
      for (let currentPage = 1; currentPage < totalPages; currentPage++) {
        await this.arrowRightIcon.click();
        await this.page.waitForLoadState("networkidle");

        // Execute action on each page after navigation
        if (onPageAction) {
          await onPageAction(currentPage + 1, totalPages);
        }
      }
    } catch (error) {
      console.error("Error navigating catalog pages:", error);
      throw error;
    }
  }
}
