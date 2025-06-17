# Cypress to Playwright Migration Project

## Overview

This branch is dedicated to showcasing the migration of automation scripts from Cypress (JavaScript/TypeScript) to Playwright (JavaScript/TypeScript). Both frameworks are included in the repository, with each residing in its own folder. This setup allows for direct comparison, stepwise migration, and validation of test coverage between the two tools.

---

## Project Structure

```
TestingCOE/
│
├── playwright/         # Playwright framework (JavaScript/TypeScript)
│   ├── src/            # Source code (tests, page objects, utilities)
│   ├── package.json    # Node.js project file for Playwright
│   ├── playwright.config.js # Playwright configuration file
│   └── ...
│
├── cypress/            # Cypress framework (JavaScript/TypeScript)
│   ├── cypress/
│   ├── cypress.config.js
│   ├── package.json
│   └── ...
│
└── README.md           # This documentation
```

---

## How to Use

### Playwright
- Navigate to the `playwright/` folder.
- Install dependencies and run tests:

  ```powershell
  cd playwright
  npm install
  npx playwright test
  ```
- Configure Playwright in `playwright/playwright.config.js` and environment variables as needed.

### Cypress
- Navigate to the `cypress/` folder.
- Install dependencies and run tests:

  ```powershell
  cd cypress
  npm install
  npx cypress open   # for interactive mode
  npx cypress run    # for headless mode
  ```
- Configure Cypress in `cypress/cypress.config.js` and environment variables as needed.

---

## API Test Automation

- Both Cypress and Playwright projects include robust, maintainable API test automation for the OWASP Juice Shop order flow.
- API tests use modular helpers, centralized data, and admin user flows to ensure reliability and repeatability.
- Status checks are robust: all API-modifying actions use truthy/2xx checks, matching best practices across frameworks.
- All test artifacts (videos, screenshots, reports) are ignored via `.gitignore` for a clean repository.
- See subproject READMEs for details on running only API tests and reviewing results.

---

## API Automation Flows & Best Practices

- **End-to-End Order Placement:** Both Cypress and Playwright implementations automate the full OWASP Juice Shop order flow via API, including address creation, delivery selection, payment setup, and order placement.
- **Modular Helpers:** All API calls are encapsulated in modular helper functions for maintainability and reuse.
- **Centralized Test Data & Locators:** Test data and selectors are managed centrally to ensure DRY code and easy updates.
- **Admin User Flows:** API tests use an admin user for setup and execution, ensuring repeatability and avoiding registration/data setup issues.
- **Robust Status Checks:** All API-modifying actions assert on truthy/2xx status codes (`isOkStatusCode` in Cypress, `.ok()` in Playwright) for reliability.
- **Idempotency:** Logic ensures products are only added to the basket if not already present, preventing unique constraint errors.
- **Allure Reporting:** Integrated for both frameworks, with results and HTML reports generated for every run.
- **.gitignore Hygiene:** All test artifacts (videos, screenshots, reports) are ignored for a clean repository.
- **Best Practices:** Code follows DRY, SOLID, and modularization principles for maintainability and scalability.

See the `cypress/` and `playwright/` subproject READMEs for framework-specific details and usage instructions.

---

## Reporting
- **Playwright:** See `playwright/` for details on reporting (e.g., HTML, Allure, etc.).
- **Cypress:** HTML and video reports are generated in the `cypress/results/` or `cypress/videos/` folders by default.

---

## Customization
- Add new tests, page objects, and utilities in the respective framework folders.
- Update configuration files as needed for your environment.

---

## Support
For issues, please raise a ticket or contact the project maintainer.

---
