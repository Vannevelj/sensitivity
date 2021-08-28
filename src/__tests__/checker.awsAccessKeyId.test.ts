import { expect, describe, test } from '@jest/globals'
import { check } from '../checker'

jest.mock('@actions/core', () => ({
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
      const annotations = check(key, '', '')
      expect(annotations).toHaveLength(1)
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
      const annotations = check(key, '', '')
      expect(annotations).toHaveLength(0)
    })
  })
})
