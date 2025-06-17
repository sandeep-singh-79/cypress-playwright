# Cypress Automation Framework

## Overview
This sub-project contains a Cypress-based automation framework using JavaScript (or TypeScript). It is designed for fast, reliable end-to-end testing of web applications, with built-in support for UI and API automation, Page Object Model, fixtures for test data, and rich reporting (including Allure).

---

## Project Structure

```
cypress/
│
├── cypress/
│   ├── integration/         # Test specifications (spec files)
│   ├── support/
│   │   └── pageObjects/     # Page Object Model classes (HomePage, LoginPage, ProductDetailsPage)
│   └── fixtures/            # Test data files (e.g., testData.json)
├── cypress.config.js        # Cypress configuration file
├── package.json             # Node.js project file (scripts, dependencies)
└── README.md                # This documentation
```

---

## Test Case Coverage
- Homepage load: verifies product catalog and key UI elements
- Product details: verifies product details page displays all required info (name, price, description, image)
- Logout: verifies logout functionality and access control

---

## How to Use
- Navigate to the `cypress/` folder.
- Install dependencies:
  ```powershell
  npm install
  ```
- Run all tests (headless):
  ```powershell
  npm test
  ```
- Open Cypress interactive UI:
  ```powershell
  npm run open
  ```
- Run tests in a specific browser:
  ```powershell
  npm run test:chrome
  npm run test:firefox
  npm run test:edge
  ```
- Run a specific spec file:
  ```powershell
  npm run test:spec -- --spec cypress/integration/logout.spec.js
  ```

---

## Reporting
- **Allure reports** are generated in the `allure-results/` folder after running tests.
- To generate and view the Allure HTML report (with screenshots and videos attached):
  ```powershell
  npm run allure:report
  ```
- Default Cypress HTML and video reports are in `cypress/screenshots/` and `cypress/videos/`.

---

## Best Practices & Customization
- All selectors and UI actions are centralized in page objects (`cypress/support/pageObjects/`).
- Test data is managed in `cypress/fixtures/testData.json`.
- Add new tests in `cypress/integration/`.
- Add or update page objects in `cypress/support/pageObjects/`.
- Update configuration in `cypress.config.js` as needed.

---

## API Automation Flows & Best Practices

- **Order Placement Flow:** Automates the full Juice Shop order process via API, including address, delivery, payment, and order placement endpoints.
- **Modular API Helpers:** All API calls are implemented as modular helpers in `support/apiHelpers.js` for reuse and maintainability.
- **Centralized Test Data:** Test data is managed in `fixtures/` for easy updates and DRY code.
- **Admin User Usage:** API tests use an admin user for setup and execution, ensuring repeatability and avoiding registration issues.
- **Robust Status Checks:** All API-modifying actions use `isOkStatusCode` assertions for reliability.
- **Idempotency:** Logic ensures products are only added to the basket if not already present, preventing unique constraint errors.
- **Allure Reporting:** Integrated for API and UI tests, with results in `allure-results/` and HTML reports generated via `npm run allure:report`.
- **.gitignore Hygiene:** All test artifacts (videos, screenshots, reports) are ignored for a clean repository.
- **Best Practices:** Code follows DRY, SOLID, and modularization principles for maintainability and scalability.

---

## Scripts

The following npm scripts are available in `package.json` for convenience:

- `npm test` — Run all tests (headless)
- `npm run open` — Open Cypress interactive UI
- `npm run test:headed` — Open Cypress interactive UI (headed mode)
- `npm run test:chrome` — Run all tests in Chrome browser (headless)
- `npm run test:spec -- --spec <path>` — Run a specific spec file
- `npm run api:test` — Run only API tests (all *Api*.spec.js files)
- `npm run allure:report` — Generate and open the Allure HTML report from results

You can also use the underlying `npx cypress` and `npx allure` commands directly as shown above.

---

## Support
For issues, please raise a ticket or contact the project maintainer.
