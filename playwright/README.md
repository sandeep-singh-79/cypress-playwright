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

## Allure Reporting

- Allure results are generated automatically in the `allure-results/` folder after running tests.
- To generate and view the Allure HTML report:

  ```powershell
  npx allure generate allure-results --clean -o allure-report
  npx allure open allure-report
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

## Support

For issues, please raise a ticket or contact the project maintainer.
