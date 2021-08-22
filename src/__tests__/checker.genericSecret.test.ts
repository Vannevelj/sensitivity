import { expect, describe, test } from '@jest/globals'
import { check } from '../checker'
import { setFailed } from '@actions/core'

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
      'apiKey: test',
      'apiKey:test',
      'api_Key: "test"',
      'access_token: abc',
      'token: abc',
      'access_token: "abc"',
      "access_token: 'abc'",
      'apiToken: abc',
      'access_token: abc',
      'access-token: abc',
      'access_token = abc',
      'access_token = abc,',
      'access_token = abc;',
      'access_token= abc',
      'apiKey: ""',
      'secret: ""',
      'const apiKey = 5'
    ])('%s', (key: string) => {
      check(key, '')
      expect(setFailed).toHaveBeenCalled()
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
      'bestoken: test',
      'secret',
      'token',
      'if the apiKey is undefined',
      '<Component key=5>'
    ])('%s', (key: string) => {
      check(key, '')
      expect(setFailed).not.toHaveBeenCalled()
    })
  })
})
