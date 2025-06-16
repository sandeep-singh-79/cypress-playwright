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
