// compareTestResults.js
// Script to run Playwright and Cypress tests, capture results, and compare them
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, outputFile, workingDir) {
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe', cwd: workingDir });
    fs.writeFileSync(outputFile, output);
    fs.appendFileSync(outputFile, `\nFinished at: ${new Date().toISOString()}\n`);
  } catch (err) {
    fs.writeFileSync(outputFile, err.stdout || err.message);
    fs.appendFileSync(outputFile, `\nFinished at: ${new Date().toISOString()}\n`);
  }
}

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

function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

const resultsDir = path.join(__dirname, 'test-comparison-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

const timestamp = getTimestamp();
const pwResultFile = path.join(resultsDir, `playwright-results-${timestamp}.txt`);
const cyResultFile = path.join(resultsDir, `cypress-results-${timestamp}.txt`);

// 1. Run Playwright tests (chromium UI + API project)
console.log('Running Playwright tests (chromium + api)...');
runCommand('npx playwright test --project=chromium --project=api --reporter=list', pwResultFile, path.join(__dirname, 'playwright'));

// 2. Run Cypress tests
console.log('Running Cypress tests...');
runCommand('npx cypress run --spec "cypress/cypress/integration/*.js"', cyResultFile, path.join(__dirname, 'cypress'));

// 3. Parse and compare results
const pw = parsePlaywrightResults(pwResultFile);
const cy = parseCypressResults(cyResultFile);

console.log('\n--- Test Comparison ---');
console.log('Playwright:', pw);
console.log('Cypress:', cy);
