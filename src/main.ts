import { getInput, setFailed, info } from '@actions/core'
import * as glob from '@actions/glob'
import { check } from './checker'

async function run(): Promise<void> {
  try {
    info('Starting sensitivity check..')
    const path = getInput('path', { required: true })

    const globber = await glob.create(`${path}/**/*.*`)
    for await (const file of globber.globGenerator()) {
      await check(file)
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
