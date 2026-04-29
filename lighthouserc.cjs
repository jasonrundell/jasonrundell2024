const ROUTES = ['/', '/about', '/projects', '/posts', '/contact']

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run start:ci',
      startServerReadyPattern: 'Local:',
      url: ROUTES.map((route) => `http://localhost:3000${route}`),
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'color-contrast': 'error',
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
}
