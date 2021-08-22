import { expect, describe, test } from '@jest/globals'
import { check } from '../checker'

jest.mock('@actions/core', () => ({
  setFailed: jest.fn(),
  error: jest.fn()
}))

describe('Google API key', () => {
  describe('invalid', () => {
    test.each([
      'AIzaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2E_k',
      'AIzaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2Eyk',
      '"AIzaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2E_k"',
      "'AIzaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2E_k'",
      'AIzaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2E_ky'
    ])('%s', (key: string) => {
      const annotations = check(key, '', '')
      expect(annotations).toHaveLength(1)
    })
  })

  describe('valid', () => {
    test.each([
      'AIzaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2E_',
      'AIzaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2Ek',
      'AizaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2E_k'
    ])('%s', (key: string) => {
      const annotations = check(key, '', '')
      expect(annotations).toHaveLength(0)
    })
  })
})
