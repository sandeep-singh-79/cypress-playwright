# Test Execution Comparison Script: Playwright vs Cypress

This script template helps you capture, compare, and summarize the results of running the same test suite in both Playwright and Cypress.

---

## 1. Run Playwright and Cypress Tests (with Timestamped Results)

The comparison script now stores result files in a dedicated `test-comparison-results/` folder, with each file name including a timestamp for future analysis.

**You do not need to manually redirect output.** Instead, simply run:

```sh
node compareTestResults.js
```

This will automatically:
- Run Playwright and Cypress tests
- Store results as:
  - `test-comparison-results/playwright-results-YYYY-MM-DDTHH-MM-SS.txt`
  - `test-comparison-results/cypress-results-YYYY-MM-DDTHH-MM-SS.txt`
- Print a summary comparison to the console

## 2. Script to Parse and Compare Results (Node.js example)

```js
// compareTestResults.js
const fs = require('fs');

function parsePlaywrightResults(file) {
  const content = fs.readFileSync(file, 'utf8');
  const match = content.match(/\b(\d+) passed.*?(\d+) failed.*?in ([\d.]+)m?s/);
  return match ? {
    passed: Number(match[1]),
    failed: Number(match[2]),
    duration: match[3]
  } : null;
}

function parseCypressResults(file) {
  const content = fs.readFileSync(file, 'utf8');
  const match = content.match(/(\d+) passing.*?(\d+) failing.*?\((\d+ms|\d+\.\d+s)\)/s);
  return match ? {
    passed: Number(match[1]),
    failed: Number(match[2]),
    duration: match[3]
  } : null;
}

const pw = parsePlaywrightResults('playwright-results.txt');
const cy = parseCypressResults('cypress-results.txt');

console.log('--- Test Comparison ---');
console.log('Playwright:', pw);
console.log('Cypress:', cy);
```

## 3. Usage

1. Run the comparison script:
   ```sh
   node compareTestResults.js
   ```
2. Review the output for pass/fail counts and durations.
3. Historical results are retained for future analysis.

## Cross-Platform Compatibility

The comparison script uses Node.js's `cwd` option to ensure Playwright and Cypress tests are executed from their respective subfolders, making it robust on both Windows and Unix-based systems. No shell-specific commands are used.

---

**Tip:**
- This template ensures Playwright runs both UI (chromium) and API tests for a fair comparison.
- You can extend the script to parse per-test timings, flake rates, or error messages for deeper analysis.
- For more advanced observability, integrate with OTEL or a tracing backend.
