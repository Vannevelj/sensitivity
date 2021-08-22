import { expect, describe, test } from '@jest/globals'
import { check } from '../checker'

jest.mock('@actions/core', () => ({
  setFailed: jest.fn(),
  error: jest.fn()
}))

describe('email address', () => {
  describe('invalid', () => {
    test.each([
      'test@home.be',
      '"test@home.be"',
      "'test@home.be'",
      '125@example.com',
      'hello.me@google.test',
      'wowee@hello.co.uk',
      "O'Connor@example.com"
    ])('%s', (email: string) => {
      const annotations = check(email, '', '')
      expect(annotations).toHaveLength(1)
    })
  })

  describe('valid', () => {
    test.each(['fold@home', 'test.me', '@@@', '...', '', ' ', '@me'])(
      '%s',
      (email: string) => {
        const annotations = check(email, '', '')
        expect(annotations).toHaveLength(0)
      }
    )
  })
})
