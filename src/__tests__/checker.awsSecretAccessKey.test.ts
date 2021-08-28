import { expect, describe, test } from '@jest/globals'
import { check } from '../checker'

jest.mock('@actions/core', () => ({
  error: jest.fn()
}))

describe('AWS_SECRET_ACCESS_KEY', () => {
  describe('invalid', () => {
    test.each([
      'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      '"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"',
      "'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'",
      'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY2'
    ])('%s', (key: string) => {
      const annotations = check(key, '', '')
      expect(annotations).toHaveLength(1)
    })
  })

  describe('valid', () => {
    test.each([
      'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPL',
      'wJalrXUtnFEMIK7MDENGbPxRfiCYEXAMPLEKEY',
      'wJalrXUtnFEMI0K7MDENG0bPxRfiCYEXAMPLEKEY',
      ''
    ])('%s', (key: string) => {
      const annotations = check(key, '', '')
      expect(annotations).toHaveLength(0)
    })
  })
})
