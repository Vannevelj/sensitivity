export function check(
  content: string,
  file: string,
  repo: string
): Annotation[] {
  let lineIndex = 0
  const annotations: Annotation[] = []
  for (const line of content.split('\r\n')) {
    lineIndex++
    for (const regex of regexes) {
      if (regex.test(line)) {
        const filename = file.replace(
          `${process.env.RUNNER_WORKSPACE as string}/${repo}/`,
          ''
        )

        annotations.push({
          path: filename,
          start_line: lineIndex,
          end_line: lineIndex,
          annotation_level: 'failure',
          message: 'Woopiedoop',
          title: 'wambawam',
          start_column: 1,
          end_column: 1
        })
      }
    }
  }

  return annotations
}

const regexes = [
  /[a-z0-9_.]*@[a-z].[a-z]*(?:\.[a-z]*)/i, // emails
  /-----BEGIN[A-Z\s+]*PRIVATE KEY(?:\sBLOCK)?-----/, // SSH keys
  /AKIA[A-Z0-9]{16}/, // AWS_ACCESS_KEY_ID
  /[a-zA-Z0-9]{13}\/[a-zA-Z0-9]{7}\/[a-zA-Z0-9]{18}/, // AWS_SECRET_ACCESS_KEY
  /AIza[0-9A-Za-z_]{35}/, // Google API key
  /\b(?:api[_-]?key|secret|(?:access|api)?[_-]?token)\s?[:=]/i // Generic secrets
].map(r => new RegExp(r))

export interface Annotation {
  path: string
  start_line: number
  end_line: number
  start_column: number
  end_column: number
  annotation_level: 'failure' | 'warning' | 'notice'
  title: string
  message: string
}
