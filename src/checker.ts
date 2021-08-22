export function check(
  content: string,
  file: string,
  repo: string
): Annotation[] {
  let lineIndex = 0
  const annotations: Annotation[] = []
  for (const line of content.split(/\r?\n/)) {
    lineIndex++
    for (const { type, regex } of regexes) {
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
          message: `The following line breaks the rules:\n${line}`,
          title: `A violation of type '${type}' has been found`,
          start_column: 1,
          end_column: 1
        })
      }
    }
  }

  return annotations
}

const regexes = [
  { type: 'email', regex: /[a-z0-9_.]*@[a-z].[a-z]*(?:\.[a-z]*)/i },
  { type: 'ssh', regex: /-----BEGIN[A-Z\s+]*PRIVATE KEY(?:\sBLOCK)?-----/ },
  { type: 'AWS_ACCESS_KEY_ID', regex: /AKIA[A-Z0-9]{16}/ },
  {
    type: 'AWS_SECRET_ACCESS_KEY',
    regex: /[a-zA-Z0-9]{13}\/[a-zA-Z0-9]{7}\/[a-zA-Z0-9]{18}/
  },
  { type: 'Google API key', regex: /AIza[0-9A-Za-z_]{35}/ },
  {
    type: 'Generic secret',
    regex: /\b(?:api[_-]?key|secret|(?:access|api)?[_-]?token)\s?[:=]/i
  }
].map(r => ({ type: r.type, regex: new RegExp(r.regex) }))

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
