import { info, setFailed } from '@actions/core'

import fs from 'fs'

export async function check(filePath: string) {
  info(`Checking ${filePath}`)
  const buffer = await fs.promises.readFile(filePath)
  const content = buffer.toString()

  for (const regex of regexes) {
    if (regex.test(content)) {
      setFailed('Sensitive data found!')
    }
  }
}

const regexes = ['.*'].map(r => new RegExp(r))
