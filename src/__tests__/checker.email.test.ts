import { expect, describe, test } from '@jest/globals'
import { check } from '../checker'
import { setFailed } from '@actions/core'

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
      check(email, '')
      expect(setFailed).toHaveBeenCalled()
    })
  })

  describe('valid', () => {
    test.each(['fold@home', 'test.me', '@@@', '...', '', ' ', '@me'])(
      '%s',
      (email: string) => {
        check(email, '')
        expect(setFailed).not.toHaveBeenCalled()
      }
    )
  })
})
