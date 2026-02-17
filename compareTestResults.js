// compareTestResults.js
// Script to run Playwright and Cypress tests, capture results, and compare them
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// --- Utility Functions ---
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

function mmssToSeconds(str) {
  if (!str) return null;
  const [min, sec] = str.split(':').map(Number);
  return isNaN(min) || isNaN(sec) ? null : min * 60 + sec;
}

function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

function getPlaywrightVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'playwright', 'package.json'), 'utf8'));
    // Try devDependencies first, then dependencies
    return (pkg.devDependencies && pkg.devDependencies['@playwright/test']) ||
           (pkg.dependencies && pkg.dependencies['@playwright/test']) || 'N/A';
  } catch {
    return 'N/A';
  }
}

// --- Parsing Functions ---
function parsePlaywrightResults(content) {
  const match = content.match(/(\d+) passed(?:, (\d+) failed)?(?:, (\d+) skipped)? \((\d+\.?\d*)s\)/);
  return match ? {
    passed: Number(match[1]),
    failed: match[2] ? Number(match[2]) : 0,
    skipped: match[3] ? Number(match[3]) : 0,
    duration: Number(match[4])
  } : null;
}

function parseCypressResults(content) {
  const summaryLine = content.match(/All specs.*?(\d\d?:\d\d)\s+(\d+)\s+(\d+)\s+(-|\d+)\s+(-|\d+)\s+(-|\d+)/);
  if (summaryLine) {
    return {
      passed: Number(summaryLine[3]),
      failed: summaryLine[4] === '-' ? 0 : Number(summaryLine[4]),
      skipped: summaryLine[6] === '-' ? 0 : Number(summaryLine[6]),
      duration: mmssToSeconds(summaryLine[1])
    };
  }
  // Fallback: sum from each spec row
  const specRows = extractCypressSpecs(content);
  if (specRows.length) {
    let passed = 0, failed = 0, skipped = 0, totalDuration = 0;
    for (const s of specRows) {
      passed += s.passed;
      failed += s.failed;
      skipped += s.skipped;
      totalDuration += s.duration || 0;
    }
    return { passed, failed, skipped, duration: totalDuration };
  }
  return null;
}

function extractEnvInfo(content, tool, nodeVersion, playwrightVersion) {
  if (tool === 'cypress') {
    return {
      cypress: (content.match(/Cypress:\s+([\d.]+)/) || [])[1] || 'N/A',
      node: (content.match(/Node Version:\s+([^\s]+)/) || [])[1] || 'N/A',
      browser: (content.match(/Browser:\s+([^\n]+)/) || [])[1]?.trim() || 'N/A'
    };
  } else if (tool === 'playwright') {
    return {
      node: nodeVersion || 'N/A',
      playwright: playwrightVersion || 'N/A'
    };
  }
  return {};
}

function extractCypressSpecs(content) {
  // Robustly extract per-spec results by scanning line by line
  const lines = content.split(/\r?\n/);
  const basePath = 'cypress/cypress/integration/';
  const specs = [];
  for (let i = 0; i < lines.length; i++) {
    const runningMatch = lines[i].match(/Running:  ([^\s]+\.spec\.js)/);
    if (runningMatch) {
      const specName = basePath + runningMatch[1].trim();
      // Scan forward to find the next (Results) block
      let stats = {
        name: specName,
        duration: null,
        passed: 0,
        failed: 0,
        skipped: 0
      };
      let foundResults = false;
      for (let j = i + 1; j < Math.min(i + 30, lines.length); j++) { // look ahead up to 30 lines
        if (lines[j].trim() === '(Results)') {
          foundResults = true;
          // Parse the next ~12 lines for stats
          for (let k = j + 1; k < Math.min(j + 15, lines.length); k++) {
            const l = lines[k];
            if (/Duration:\s+(\d+) seconds/.test(l)) {
              stats.duration = Number(l.match(/Duration:\s+(\d+) seconds/)[1]);
            }
            if (/Passing:\s+(\d+)/.test(l)) {
              stats.passed = Number(l.match(/Passing:\s+(\d+)/)[1]);
            }
            if (/Failing:\s+(\d+)/.test(l)) {
              stats.failed = Number(l.match(/Failing:\s+(\d+)/)[1]);
            }
            if (/Skipped:\s+(\d+)/.test(l)) {
              stats.skipped = Number(l.match(/Skipped:\s+(\d+)/)[1]);
            }
            // End of block
            if (/Spec Ran:/.test(l) || /┘/.test(l)) break;
          }
          break;
        }
      }
      if (foundResults) {
        specs.push(stats);
      }
    }
  }
  // Fallback: parse summary table if no specs found
  if (specs.length === 0) {
    const summaryRegex = /\|\s*√\s+([^|]+)\s+(\d\d?:\d\d)\s+(\d+)\s+(\d+)\s+(-|\d+)\s+(-|\d+)\s+(-|\d+)\s*\|/g;
    let row;
    while ((row = summaryRegex.exec(content))) {
      const fallbackStats = {
        name: basePath + row[1].trim(),
        duration: mmssToSeconds(row[2]),
        passed: Number(row[3]),
        failed: row[4] === '-' ? 0 : Number(row[4]),
        skipped: row[6] === '-' ? 0 : Number(row[6])
      };
      specs.push(fallbackStats);
    }
  }
  return specs;
}

function extractPlaywrightSpecs(content) {
  // Returns array of { name, duration, status }
  const specs = [];
  const regex = /([✓✗]) +\d+ \[[^\]]+\] [›|>] ([^\n]+) \((\d+\.?\d*)s\)/g;
  let row;
  while ((row = regex.exec(content))) {
    specs.push({
      name: row[2].trim(),
      duration: Number(row[3]),
      status: row[1] === '✓' ? 'passed' : 'failed'
    });
  }
  return specs;
}

function extractWallClock(content, tool) {
  if (tool === 'cypress') {
    const finished = content.match(/Finished at: ([^\n]+)/g);
    if (finished && finished.length) {
      const last = finished[finished.length - 1].replace('Finished at: ', '');
      const first = content.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z/);
      if (first) {
        const start = new Date(first[0]);
        const end = new Date(last);
        return (end - start) / 1000;
      }
    }
  } else if (tool === 'playwright') {
    const timestamps = [...content.matchAll(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g)];
    if (timestamps.length >= 2) {
      const start = new Date(timestamps[0][0].replace(' ', 'T'));
      const end = new Date(timestamps[timestamps.length - 1][0].replace(' ', 'T'));
      return (end - start) / 1000;
    }
  }
  return null;
}

function getBaseSpecName(name) {
  // Extracts the base spec filename from a test name or path
  const match = name.match(/([\w-]+\.spec\.(js|ts))/i);
  return match ? match[1] : name.trim();
}

function compareCoverage(cySpecs, pwSpecs) {
  const cyNames = cySpecs.map(s => getBaseSpecName(s.name));
  const pwNames = pwSpecs.map(s => getBaseSpecName(s.name));
  return {
    both: cyNames.filter((n, i) => pwNames.includes(n) && cyNames.indexOf(n) === i),
    onlyCypress: cyNames.filter((n, i) => !pwNames.includes(n) && cyNames.indexOf(n) === i),
    onlyPlaywright: pwNames.filter((n, i) => !cyNames.includes(n) && pwNames.indexOf(n) === i)
  };
}

function printSection(title, fn) {
  console.log(`\n=== ${title} ===`);
  fn();
}

// --- Main Execution ---
(function main() {
  const resultsDir = path.join(__dirname, 'test-comparison-results');
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir);

  const timestamp = getTimestamp();
  const pwResultFile = path.join(resultsDir, `playwright-results-${timestamp}.txt`);
  const cyResultFile = path.join(resultsDir, `cypress-results-${timestamp}.txt`);

  console.log('Running Playwright tests (chromium + api)...');
  runCommand('npx playwright test --project=chromium --project=api --reporter=list', pwResultFile, path.join(__dirname, 'playwright'));
  console.log('Running Cypress tests...');
  runCommand('npx cypress run --spec "cypress/integration/*.js"', cyResultFile, path.join(__dirname, 'cypress'));

  const pwContent = fs.readFileSync(pwResultFile, 'utf8');
  const cyContent = fs.readFileSync(cyResultFile, 'utf8');
  const pw = parsePlaywrightResults(pwContent);
  const cy = parseCypressResults(cyContent);
  const playwrightVersion = getPlaywrightVersion();
  const cyEnv = extractEnvInfo(cyContent, 'cypress');
  const pwEnv = extractEnvInfo(pwContent, 'playwright', cyEnv.node, playwrightVersion); // Use Cypress node version for Playwright
  const cySpecs = extractCypressSpecs(cyContent);
  const pwSpecs = extractPlaywrightSpecs(pwContent);
  const cyWall = extractWallClock(cyContent, 'cypress');
  const pwWall = extractWallClock(pwContent, 'playwright');
  const coverage = compareCoverage(cySpecs, pwSpecs);

  printSection('Environment Info', () => {
    console.log('Cypress:', cyEnv);
    console.log('Playwright:', pwEnv);
  });

  printSection('Test Coverage Comparison', () => {
    // NOTE: Coverage comparison is currently commented out due to missing Cypress specs in output. To be fixed later.
    // console.log('Specs in both:', coverage.both);
    // if (coverage.onlyCypress.length) console.log('Only in Cypress:', coverage.onlyCypress);
    // if (coverage.onlyPlaywright.length) console.log('Only in Playwright:', coverage.onlyPlaywright);
    console.log('Test coverage comparison is temporarily disabled (to be fixed later).');
  });

  printSection('Per-Spec/Test Duration Breakdown', () => {
    console.log('Cypress:');
    cySpecs.forEach(s => console.log(`  ${s.name}: ${s.duration}s, passed: ${s.passed}, failed: ${s.failed}, skipped: ${s.skipped}`));
    if (cySpecs.length) {
      const slowest = cySpecs.reduce((a, b) => (a.duration > b.duration ? a : b));
      const fastest = cySpecs.reduce((a, b) => (a.duration < b.duration ? a : b));
      console.log(`  Slowest: ${slowest.name} (${slowest.duration}s), Fastest: ${fastest.name} (${fastest.duration}s)`);
    }
    console.log('Playwright:');
    pwSpecs.forEach(s => console.log(`  ${s.name}: ${s.duration}s, status: ${s.status}`));
    if (pwSpecs.length) {
      const slowest = pwSpecs.reduce((a, b) => (a.duration > b.duration ? a : b));
      const fastest = pwSpecs.reduce((a, b) => (a.duration < b.duration ? a : b));
      console.log(`  Slowest: ${slowest.name} (${slowest.duration}s), Fastest: ${fastest.name} (${fastest.duration}s)`);
    }
  });

  printSection('Wall-Clock Duration', () => {
    console.log('Cypress wall-clock duration:', cyWall !== null ? cyWall + 's' : 'N/A');
    console.log('Playwright wall-clock duration:', pwWall !== null ? pwWall + 's' : 'N/A');
  });

  printSection('Test Comparison (Summary)', () => {
    console.log('Playwright:', pw ? { ...pw, duration: pw.duration + 's' } : pw);
    console.log('Cypress:', cy ? { ...cy, duration: cy.duration !== null ? cy.duration + 's' : null } : cy);
  });
})();
