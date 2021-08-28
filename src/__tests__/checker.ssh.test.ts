import { expect, describe, test } from '@jest/globals'
import { check } from '../checker'

jest.mock('@actions/core', () => ({
  error: jest.fn()
}))

describe('ssh', () => {
  describe('invalid', () => {
    test.each([
      '-----BEGIN DSA PRIVATE KEY-----',
      '-----BEGIN PRIVATE KEY-----',
      '-----BEGIN RSA PRIVATE KEY-----',
      '-----BEGIN EC PRIVATE KEY-----',
      '-----BEGIN PGP PRIVATE KEY BLOCK-----'
    ])('%s', (key: string) => {
      const annotations = check(key, '', '')
      expect(annotations).toHaveLength(1)
    })
  })

  describe('valid', () => {
    test.each([
      '-----BEGIN DANCING-----',
      'BEGIN KEY MOMENTS',
      '----------',
      '',
      'BEGIN PRIVATE KEY'
    ])('%s', (key: string) => {
      const annotations = check(key, '', '')
      expect(annotations).toHaveLength(0)
    })
  })
})
