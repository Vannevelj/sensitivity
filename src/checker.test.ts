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

  describe('AWS_ACCESS_KEY_ID', () => {
    describe('invalid', () => {
      test.each([
        'AKIAIOSFODNN7EXAMPLE',
        'AKIAJYBSD6XWRPL375LT',
        '"AKIAIOSFODNN7EXAMPLE"',
        "'AKIAIOSFODNN7EXAMPLE'",
        'AKIAIOSFODNN7EXAMPLEERRRR'
      ])('%s', (key: string) => {
        check(key)
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
        check(key)
        expect(setFailed).not.toHaveBeenCalled()
      })
    })
  })

  describe('AWS_SECRET_ACCESS_KEY', () => {
    describe('invalid', () => {
      test.each([
        'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
        '"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"',
        "'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'",
        'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY2'
      ])('%s', (key: string) => {
        check(key)
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
        check(key)
        expect(setFailed).not.toHaveBeenCalled()
      })
    })
  })

  describe('Google API key', () => {
    describe('invalid', () => {
      test.each([
        'AIzaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2E_k',
        'AIzaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2Eyk',
        '"AIzaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2E_k"',
        "'AIzaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2E_k'",
        'AIzaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2E_ky'
      ])('%s', (key: string) => {
        check(key)
        expect(setFailed).toHaveBeenCalled()
      })
    })

    describe('valid', () => {
      test.each([
        'AIzaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2E_',
        'AIzaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2Ek',
        'AizaSyBdJ88HN7LTGkHHK5whfaVv8a5ozlx2E_k'
      ])('%s', (key: string) => {
        check(key)
        expect(setFailed).not.toHaveBeenCalled()
      })
    })
  })
})
