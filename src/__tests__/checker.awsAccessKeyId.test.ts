import { expect, describe, test } from '@jest/globals'
import { check } from '../checker'
import { setFailed } from '@actions/core'

jest.mock('@actions/core', () => ({
  setFailed: jest.fn(),
  error: jest.fn()
}))

describe('AWS_ACCESS_KEY_ID', () => {
  describe('invalid', () => {
    test.each([
      'AKIAIOSFODNN7EXAMPLE',
      'AKIAJYBSD6XWRPL375LT',
      '"AKIAIOSFODNN7EXAMPLE"',
      "'AKIAIOSFODNN7EXAMPLE'",
      'AKIAIOSFODNN7EXAMPLEERRRR'
    ])('%s', (key: string) => {
      check(key, '')
      expect(setFailed).toHaveBeenCalled()
    })
  })

  describe('valid', () => {
    test.each([
      'AKIAIOSFODNN7EXAMPL*',
      'AKIA is a nice car',
      'POLOIOSFODNN7EXAMPL',
      '',
      'AKIAIOSFODNN7'
    ])('%s', (key: string) => {
      check(key, '')
      expect(setFailed).not.toHaveBeenCalled()
    })
  })
})
