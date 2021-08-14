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
  /-----BEGIN[A-Z\s+]*PRIVATE KEY(?:\sBLOCK)?-----/, // SSH keys
  /(?:AKIA)[A-Z0-9]{16}/ // AWS_ACCESS_KEY_ID
].map(r => new RegExp(r))
