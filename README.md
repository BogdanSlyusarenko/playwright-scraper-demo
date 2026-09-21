# Catalog Scraper

Playwright test suite that collects product names from a catalog and writes them to `scraped_data.csv`.

## Setup

```bash
npm install
npx playwright install
```

Create a `.env` file in the project root:

```env
TARGET_PAGE=https://example.com/catalog/
BASE_URL=http://localhost:3000
```

`TARGET_PAGE` is required. `BASE_URL` is optional and defaults to `http://localhost:3000`.

## Run

Run the scraper in Chromium:

```bash
npx playwright test tests/initial.access.spec.ts --project=chromium
```

Run the test across all configured browsers:

```bash
npx playwright test tests/initial.access.spec.ts
```

List tests without running them:

```bash
npx playwright test tests/initial.access.spec.ts --list
```

## Output

Results are written to `scraped_data.csv` with the catalog URL, catalog name, item name, page number, and timestamp. Playwright reports are generated in `playwright-report/`.

## Structure

- `tests/initial.access.spec.ts` - scraper test
- `pages/product-catalog.page.ts` - catalog locators and pagination
- `helpers/saveToFile.ts` - CSV writer
- `playwright.config.ts` - Playwright and environment configuration
