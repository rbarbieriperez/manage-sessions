module.exports = {
    require: ['./features/step_definitions/*.js', './features/pages/*.js', './features/epics/*.feature'], // Path to step definitions
    format: ['pretty', 'json:report.json'], // Output formats
    // Other configuration options
  };