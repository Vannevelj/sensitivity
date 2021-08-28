import { expect, describe, test } from '@jest/globals'
import { check } from '../checker'

jest.mock('@actions/core', () => ({
  error: jest.fn(),
  getInput: jest.fn()
}))

import * as coreActions from '@actions/core'

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

  describe('ignored emails', () => {
    test('no ignored emails', () => {
      const spy = jest.spyOn(coreActions, 'getInput')
      spy.mockImplementation(() => '')
      const annotations = check('test@example.com', '', '')
      expect(annotations).toHaveLength(1)
    })

    test('matching ignored email', () => {
      const spy = jest.spyOn(coreActions, 'getInput')
      spy.mockImplementation(() => JSON.stringify(['.*@example.com']))
      const annotations = check('test@example.com', '', '')
      expect(annotations).toHaveLength(0)
    })

    test('non-matching ignored email', () => {
      const spy = jest.spyOn(coreActions, 'getInput')
      spy.mockImplementation(() => JSON.stringify(['.*@example.net']))
      const annotations = check('test@example.com', '', '')
      expect(annotations).toHaveLength(1)
    })

    test('multiple ignored emails', () => {
      const spy = jest.spyOn(coreActions, 'getInput')
      spy.mockImplementation(() =>
        JSON.stringify(['wowee@test.be', '.*@example.com'])
      )
      const annotations = check('test@example.com', '', '')
      expect(annotations).toHaveLength(0)
    })
  })
})
