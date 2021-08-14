import { getInput, setFailed, info } from '@actions/core'
import * as glob from '@actions/glob'
import { check } from './checker'
import fs from 'fs'

async function run(): Promise<void> {
  try {
    info('Starting sensitivity check..')
    const path = getInput('path', { required: true })

    const globber = await glob.create(`${path}/**/*.*`)
    for await (const file of globber.globGenerator()) {
      info(`Checking ${file}`)
      const buffer = await fs.promises.readFile(file)
      const content = buffer.toString()
      await check(content)
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
