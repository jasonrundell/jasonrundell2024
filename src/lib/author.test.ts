import AUTHOR from './author'

describe('AUTHOR identity', () => {
  it('exports the site author name', () => {
    expect(AUTHOR.name).toBe('Jason Rundell')
  })

  it('exports a picture path string', () => {
    expect(typeof AUTHOR.picture).toBe('string')
    expect(AUTHOR.picture).toBeTruthy()
  })

  it('exports a LinkedIn URL', () => {
    expect(AUTHOR.url).toContain('linkedin.com')
  })
})
