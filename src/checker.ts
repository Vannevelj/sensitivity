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
  /AKIA[A-Z0-9]{16}/, // AWS_ACCESS_KEY_ID
  /[a-zA-Z0-9]{13}\/[a-zA-Z0-9]{7}\/[a-zA-Z0-9]{18}/, // AWS_SECRET_ACCESS_KEY
  /AIza[0-9A-Za-z_]{35}/, // Google API key
  /\b(?:api[_-]?key|secret|(?:access|api)?[_-]?token)\s?[:=]/i // Generic secrets
].map(r => new RegExp(r))
