import { setFailed } from '@actions/core'

export async function check(content: string) {
  for (const regex of regexes) {
    if (regex.test(content)) {
      setFailed('Sensitive data found!')
    }
  }
}

const regexes = [
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/, // emails
  /-----BEGIN[A-Z\s+]*PRIVATE KEY(?:\sBLOCK)?-----/ // SSH keys
].map(r => new RegExp(r))
