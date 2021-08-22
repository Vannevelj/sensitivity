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

    const ignoredFileExtensions = ['.png', '.mp4', '.dll', '.jpg', '.exe']
    const ignoredDirectories = ['node_modules', '.git', '.nuget']
    const annotations: Annotation[] = []
    const globber = await glob.create(`${path}/**/*.*`)
    for await (const file of globber.globGenerator()) {
      if (!(await fs.promises.lstat(file)).isFile()) {
        continue
      }

      info(`Checking ${file}`)
      if (ignoredFiles.has(file)) {
        debug(`Skipping validation, path is ignored`)
        continue
      }

      if (ignoredDirectories.some(ext => file.endsWith(ext))) {
        debug(`Skipping validation, ignored directory`)
        continue
      }

      if (ignoredFileExtensions.some(ext => file.endsWith(ext))) {
        debug(`Skipping validation, ignored filetype`)
        continue
      }

      const buffer = await fs.promises.readFile(file)
      const content = buffer.toString()
      const fileAnnotations = check(content, file, 'sensitivity')
      annotations.push(...fileAnnotations)
    }

    const checkResponse = await createCheck(token)
    await updateRunWithAnnotations(token, checkResponse.data.id, annotations)

    if (annotations.length > 0) {
      setFailed('Sensitive data found!')
    }
  } catch (error) {
    setFailed(error.message)
  }
}

run()
