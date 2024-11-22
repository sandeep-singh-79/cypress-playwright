const report = require('multiple-cucumber-html-reporter');

report.generate({
  theme: 'foundation',
    jsonDir: "test-result",
    reportPath: "test-result/reports/multiple-cucumber-html-report/",
    reportName: "Playwright automation report",
    pageTitle: "Nopcommerce app",
    displayDuration: true,
    openReportInBrowser: true,
    metadata:{
        browser: {
            name: "Chrome",
            version: "121",
        },
        device: "Localhost",
    platform: {
      name: "windows",
      version: "10",
    },
  },
  customData: {
    title: "Project Details",
    data: [
      { label: "Project", value: "nopCommerce app" },
      { label: "Release", value: "1.2.3" },
      { label: "Cycle", value: "B11221.34321" }
         ],
  },
});
    