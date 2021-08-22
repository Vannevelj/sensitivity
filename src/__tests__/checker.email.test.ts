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
      'hello.me@google.org',
      'hello.me@google.co.uk',
      'hello.me@google.be',
      'hello.me@google.net',
      'hello.me@google.in',
      'hello.me@google.ru',
      'hello.me@google.de',
      'hello.me@google.nl',
      'hello.me@google.fr',
      'hello.me@google.es',
      'hello.me@google.pt',
      'hello.me@google.br',
      'hello.me@google.ir',
      'hello.me@google.tk',
      'hello.me@google.cn',
      'hello.me@google.info',
      'hello.me@google.com',
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
