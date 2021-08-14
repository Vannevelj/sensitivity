import { info } from '@actions/core'
export async function check(filePath: string) {
  info(`Checking ${filePath}`)
}
