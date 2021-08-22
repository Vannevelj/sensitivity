import { expect, describe, test } from '@jest/globals'
import { check } from '../checker'
import { setFailed } from '@actions/core'

jest.mock('@actions/core', () => ({
  setFailed: jest.fn(),
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
      check(key, '')
      expect(setFailed).toHaveBeenCalled()
    })
  })

  describe('valid', () => {
    test.each([
      'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPL',
      'wJalrXUtnFEMIK7MDENGbPxRfiCYEXAMPLEKEY',
      'wJalrXUtnFEMI0K7MDENG0bPxRfiCYEXAMPLEKEY',
      ''
    ])('%s', (key: string) => {
      check(key, '')
      expect(setFailed).not.toHaveBeenCalled()
    })
  })
})
