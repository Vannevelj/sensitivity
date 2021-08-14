import { expect, describe, test } from '@jest/globals'
import { check } from './checker'
import { setFailed } from '@actions/core'

jest.mock('@actions/core', () => ({
  setFailed: jest.fn()
}))

describe('checker', () => {
  describe('email address', () => {
    describe('invalid', () => {
      test.each([
        'test@home.be',
        '125@example.com',
        'hello.me@google.test',
        'wowee@hello.co.uk',
        "O'Connor@example.com"
      ])('%s', (email: string) => {
        check(email)
        expect(setFailed).toHaveBeenCalled()
      })
    })

    describe('valid', () => {
      test.each(['fold@home', 'test.me', '@@@', '...'])(
        '%s',
        (email: string) => {
          check(email)
          expect(setFailed).not.toHaveBeenCalled()
        }
      )
    })
  })

  describe('ssh', () => {
    describe('invalid', () => {
      test.each([
        '-----BEGIN DSA PRIVATE KEY-----',
        '-----BEGIN PRIVATE KEY-----',
        '-----BEGIN RSA PRIVATE KEY-----',
        '-----BEGIN EC PRIVATE KEY-----',
        '-----BEGIN PGP PRIVATE KEY BLOCK-----'
      ])('%s', (key: string) => {
        check(key)
        expect(setFailed).toHaveBeenCalled()
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
        check(key)
        expect(setFailed).not.toHaveBeenCalled()
      })
    })
  })
})
