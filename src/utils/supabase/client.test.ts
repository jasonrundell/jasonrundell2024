import { createClient } from './client'

describe('client', () => {
  describe('createClient', () => {
    it('should be a function', () => {
      // Assert
      expect(typeof createClient).toBe('function')
    })

    it('should be defined', () => {
      // Assert
      expect(createClient).toBeDefined()
    })
  })
})
