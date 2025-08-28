describe('Simple Test', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle basic string operations', () => {
    const message = 'Hello World'
    expect(message).toContain('Hello')
    expect(message.length).toBe(11)
  })
})
