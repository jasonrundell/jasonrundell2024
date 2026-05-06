const fs = require('fs')
const path = require('path')

const summaryPath = path.join(
  process.cwd(),
  'coverage',
  'coverage-summary.json'
)

const thresholds = {
  branches: 70,
  functions: 70,
  lines: 70,
  statements: 70,
}

if (!fs.existsSync(summaryPath)) {
  console.error(`Coverage summary not found at ${summaryPath}`)
  process.exit(1)
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
const total = summary.total
const failures = Object.entries(thresholds).filter(([metric, threshold]) => {
  return total[metric].pct < threshold
})

if (failures.length > 0) {
  for (const [metric, threshold] of failures) {
    console.error(
      `${metric} coverage ${total[metric].pct}% is below ${threshold}%`
    )
  }
  process.exit(1)
}

console.log(
  `Coverage thresholds passed: statements ${total.statements.pct}%, branches ${total.branches.pct}%, functions ${total.functions.pct}%, lines ${total.lines.pct}%`
)
