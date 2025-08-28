describe('check-env-vars', () => {
  it('should be able to import the module', async () => {
    // This test verifies that the module can be imported without errors
    // The actual value of hasEnvVars depends on the environment variables being loaded
    await expect(import('./check-env-vars')).resolves.toBeDefined()
  })
})
