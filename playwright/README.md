# Playwright Automation Framework

## Overview
This sub-project contains a Playwright-based automation framework using TypeScript. It is designed for robust, maintainable end-to-end testing of the OWASP Juice Shop application, with best practices such as the Page Object Model, centralized locators, helpers, and reusable test data.

---

## Project Structure

```text
playwright/
│
├── src/
│   ├── pages/               # Page Object Model classes (HomePage, LoginPage, ProductDetailsPage)
│   ├── tests/               # Test specifications (spec files)
│   └── utils/               # Helpers and test data
├── playwright.config.ts     # Playwright configuration file
├── package.json             # Node.js project file (scripts, dependencies)
├── tsconfig.json            # TypeScript configuration
└── README.md                # This documentation
```

---

## Test Case Coverage

- **Low-complexity UI scenarios automated:**
  - Homepage load: verifies product catalog and key UI elements
  - Product details: verifies product details page displays all required info
  - Logout: verifies logout functionality and access control

- **Best practices implemented:**
  - Page Object Model for all major pages
  - Centralized locators and helpers for DRY, maintainable code
  - Robust pop-up/banner handling on homepage load
  - Test data and navigation helpers centralized

---

## How to Use

- Navigate to the `playwright/` folder.
- Install dependencies:

  ```powershell
  npm install
  ```

- Run all tests (default browser):

  ```powershell
  npx playwright test
  ```

- Run a specific test file:

  ```powershell
  npx playwright test src/tests/homepage.spec.ts
  ```

- Run tests in headed mode (with browser UI):

  ```powershell
  npx playwright test --headed
  ```

- Generate HTML report:

  ```powershell
  npx playwright show-report
  ```

- Update Playwright browsers:

  ```powershell
  npx playwright install
  ```

---

## Scripts

The following npm scripts are available in `package.json` for convenience:

- `npm test` — Run all tests (default browser)
- `npm run test:headed` — Run all tests in headed mode (with browser UI)
- `npm run test:chromium` — Run all tests in Chromium browser (headless)
- `npm run test:chromeHeaded` — Run all tests in Chromium browser (headed)
- `npm run test:api` — Run only API tests (if using a dedicated API project)
- `npm run test:report` — Open the Playwright HTML report
- `npm run allure:report` — Generate and open the Allure HTML report from results

You can also use the underlying `npx playwright` and `npx allure` commands directly as shown above.

---

## Allure Reporting

- Allure results are generated automatically in the `allure-results/` folder after running tests.
- To generate and view the Allure HTML report using the npm script:

  ```powershell
  npm run allure:report
  ```

---

## Customization & Extending

- Add new tests in `src/tests/`.
- Add or update page objects in `src/pages/`.
- Add helpers or test data in `src/utils/`.
- Update configuration in `playwright.config.ts` as needed.

---

## Debugging & Troubleshooting

- Screenshots and videos are saved in `playwright-report/` and `test-results/` on test failure.
- Console logs and additional screenshots are available for debugging dialog/banner handling.
- Use `--debug` or `--trace on` for step-by-step debugging.

---

## API Automation Flows & Best Practices

- **Order Placement Flow:** Automates the full Juice Shop order process via API, including address, delivery, payment, and order placement endpoints.
- **Modular API Helpers:** All API calls are implemented as modular helpers in `src/utils/apiHelpers.ts` for reuse and maintainability.
- **Centralized Test Data & Locators:** Test data and selectors are managed centrally for DRY code and easy updates.
- **Admin User Usage:** API tests use an admin user for setup and execution, ensuring repeatability and avoiding registration/data setup issues.
- **Robust Status Checks:** All API-modifying actions use `.ok()` assertions for reliability.
- **Idempotency:** Logic ensures products are only added to the basket if not already present, preventing unique constraint errors.
- **Allure Reporting:** Integrated for API and UI tests, with results in `allure-results/` and HTML reports generated via Allure CLI.
- **.gitignore Hygiene:** All test artifacts (videos, screenshots, reports) are ignored for a clean repository.
- **Best Practices:** Code follows DRY, SOLID, and modularization principles for maintainability and scalability.

---

## Support

For issues, please raise a ticket or contact the project maintainer.

---