import { setFailed } from '@actions/core'

export async function check(content: string) {
  for (const regex of regexes) {
    if (regex.test(content)) {
      setFailed('Sensitive data found!')
    }
  }
}

const regexes = [/^[^@\s]+@[^@\s]+\.[^@\s]+$/].map(r => new RegExp(r))
