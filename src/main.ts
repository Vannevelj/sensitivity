import { getInput, setFailed, info, debug } from '@actions/core'
import { Annotation, check } from './checker'
import fs from 'fs'
import * as glob from '@actions/glob'
import { createCheck, updateRunWithAnnotations } from './github'

async function run(): Promise<void> {
  try {
    info('Starting sensitivity check..')
    const path = getInput('path', { required: true })
    const token = getInput('token', { required: true })
    const ignoredPathsRaw = getInput('ignorePaths', { required: false })
    const ignoredPathsArray = ignoredPathsRaw
      ? (JSON.parse(ignoredPathsRaw) as string[])
      : []
    const ignoredFiles: Set<string> = new Set()

    for (const ignoredPath of ignoredPathsArray) {
      debug(`Found ignored path: ${ignoredPath}`)
      const ignoredGlobber = await glob.create(`${ignoredPath}`)
      for await (const ignoredFile of ignoredGlobber.globGenerator()) {
        ignoredFiles.add(ignoredFile)
      }
    }

    const annotations: Annotation[] = []
    const globber = await glob.create(`${path}/**/*.*`)
    for await (const file of globber.globGenerator()) {
      if (!(await fs.promises.lstat(file)).isFile()) {
        continue
      }

      info(`Checking ${file}..`)
      if (ignoredFiles.has(file)) {
        debug(`Skipping validation, path is ignored`)
        continue
      }

      const buffer = await fs.promises.readFile(file)
      const content = buffer.toString()
      const fileAnnotations = check(content, file, 'sensitivity')
      annotations.push(...fileAnnotations)
    }

    if (annotations.length > 0) {
      const checkResponse = await createCheck(token)
      await updateRunWithAnnotations(token, checkResponse.data.id, annotations)
      setFailed('Sensitive data found!')
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
