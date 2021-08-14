import { getInput, setFailed, info } from '@actions/core'
import * as glob from '@actions/glob'
import { check } from './checker'
import fs from 'fs'

async function run(): Promise<void> {
  try {
    info('Starting sensitivity check..')
    const path = getInput('path', { required: true })
    const ignoredPathsRaw = getInput('ignorePaths', { required: false })
    const ignoredPathsArray = JSON.parse(ignoredPathsRaw) as string[]
    const ignoredFiles: Set<string> = new Set()

    for (const ignoredPath of ignoredPathsArray) {
      const ignoredGlobber = await glob.create(`${ignoredPath}`)
      for await (const ignoredFile of ignoredGlobber.globGenerator()) {
        ignoredFiles.add(ignoredFile)
      }
    }

    const globber = await glob.create(`${path}/**/*.*`)
    for await (const file of globber.globGenerator()) {
      info(`Checking ${file}..`)
      if (ignoredFiles.has(file)) {
        info(`Skipping validation, path is ignored`)
        continue
      }

      const buffer = await fs.promises.readFile(file)
      const content = buffer.toString()
      await check(content)
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
