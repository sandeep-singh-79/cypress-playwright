# Cypress to Playwright Migration Project

[![CI - Playwright & Cypress](https://github.com/sandeep-singh-79/cypress-playwright/actions/workflows/ci.yml/badge.svg)](https://github.com/sandeep-singh-79/cypress-playwright/actions/workflows/ci.yml)

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
  npx playwright test --project=chromium         # Run UI tests (Chromium browser)
  npx playwright test --project=api              # Run API tests only
  npx playwright test --project=chromium --project=api  # Run both UI and API tests together
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

## Automated Test Comparison: Playwright vs Cypress

This project includes a Node.js script to automate running both Playwright and Cypress test suites, capture their results, and compare pass/fail counts and durations for robust analysis.

**New & Improved Features:**
- **Environment Info:** The script prints Node, Cypress, Playwright, and browser versions for both frameworks.
- <!-- **Test Coverage Comparison:** Accurately compares which scenarios/specs are present in both tools, using normalized spec filenames. (Temporarily disabled; to be fixed later) -->
- **Per-Spec/Test Duration Breakdown:** Prints duration, pass/fail/skipped status for each spec, and highlights the slowest/fastest specs.
- **Wall-Clock Duration:** Reports the total wall-clock time for each framework’s run.
- **Summary:** Pass/fail/skipped counts and total durations are shown at the end.
- **Robust Parsing:** Handles differences in log formats and normalizes durations for fair comparison.
- **Historical Results:** All results are timestamped and stored in `test-comparison-results/` for trend analysis.

> **Note:** Test coverage comparison is temporarily disabled due to missing Cypress specs in the output. This will be fixed in a future update.

### How to Run the Comparison

1. **Run the comparison script from the project root:**
   ```powershell
   node compareTestResults.js
   ```
2. **Result files will be stored in `test-comparison-results/`** (created automatically if it doesn't exist). Each run generates timestamped result files, e.g.:
   - `test-comparison-results/playwright-results-YYYY-MM-DDTHH-MM-SS.txt`
   - `test-comparison-results/cypress-results-YYYY-MM-DDTHH-MM-SS.txt`
3. **The script prints a detailed comparison** to the console, including environment info, per-spec durations, wall-clock times, and a summary.
4. **Historical results are retained** for future analysis of flakiness, performance, and error trends.

---

## Continuous Integration (CI) with GitHub Actions

This repository includes a robust GitHub Actions workflow that automatically validates both Playwright and Cypress test runs on every pull request to the `main` branch.

- The workflow:
  - Caches npm dependencies for faster builds.
  - Sets up Node.js and installs dependencies for each tool.
  - Starts the backend (Juice Shop) using Docker Compose and waits for it to be ready before running tests.
  - Runs Playwright and Cypress tests in parallel matrix jobs.
  - Generates and uploads Allure reports and test result artifacts for both frameworks.
  - Cleans up the backend after tests complete.

You can find the workflow file at `.github/workflows/ci.yml`.

---

## Support

For issues, please raise a ticket or contact the project maintainer.
