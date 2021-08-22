import { expect, describe, test } from '@jest/globals'
import { check } from '../checker'

jest.mock('@actions/core', () => ({
  setFailed: jest.fn(),
  error: jest.fn()
}))

describe('generic secrets', () => {
  describe('invalid', () => {
    test.each([
      'apiKey: "test"',
      'apiKey:"test"',
      'secret: "test"',
      'apiKey:"test"',
      'api_Key: "test"',
      "token: 'abc'",
      "token: '123'",
      'access_token: "abc"',
      "access_token: 'abc'",
      'access_token = "abc"',
      'access_token = "abc",',
      'access_token = "abc";',
      'access_token= "abc"',
      'apiKey: ""',
      'secret: ""',
      'const apiKey = "5"'
    ])('%s', (key: string) => {
      const annotations = check(key, '', '')
      expect(annotations).toHaveLength(1)
    })
  })

  describe('valid', () => {
    test.each([
      'monkey: "capuchin"',
      'key: ',
      '',
      '=',
      ':',
      'yes=true',
      'method: key',
      'apiKey: test',
      'bestoken: test',
      'secret',
      'token',
      'if the apiKey is undefined',
      '<Component key=5>',
      'apiToken: abc',
      'access_token: abc',
      'access_token = abc',
      'access_token = abc,',
      'access_token = abc;',
      'const apiKey = get(5)',
      'const apiKey = 5',
      'token: string,',
      'const apiKey = `Test-${getIt(5)}`',
      'var token = "AKIA{getRest()}"',
    ])('%s', (key: string) => {
      const annotations = check(key, '', '')
      expect(annotations).toHaveLength(0)
    })
  })
})
