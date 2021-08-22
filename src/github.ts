import { Annotation } from './checker'
import { getOctokit, context } from '@actions/github'
import { RestEndpointMethodTypes } from '@octokit/rest'
import { info, error } from '@actions/core'

type ChecksCreateResponse = RestEndpointMethodTypes['checks']['create']['response']
const checkName = 'Sensitivity Check Results'

export async function createCheck(
  token: string
): Promise<ChecksCreateResponse> {
  const octokit = getOctokit(token)

  const response = await octokit.rest.checks.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    status: 'in_progress',
    head_sha: context.payload.pull_request?.head.sha ?? context.sha,
    name: checkName
  })

  info(`Created check with ID ${response.data.id}`)

  return response
}

export async function updateRunWithAnnotations(
  token: string,
  checkRunId: number,
  annotations: Annotation[]
) {
  const octokit = getOctokit(token)

  info(`Found ${annotations.length} violations.`)

  if (annotations.length === 0) {
    await octokit.request(
      `PATCH /repos/${context.repo.owner}/${context.repo.repo}/check-runs/${checkRunId}`,
      {
        owner: context.repo.owner,
        repo: context.repo.repo,
        check_run_id: checkRunId,
        name: checkName,
        status: 'completed',
        conclusion: 'success',
        output: {
          title: `Sensitivity check results`,
          summary: `${annotations.length} violations have been found`,
          text: `No violations were found in the included files.`
        }
      }
    )
    return
  }

  const violatingFiles = Array.from(new Set(annotations.map(v => v.path)))
  const violationsPerType = new Map<string, number>()
  annotations.forEach(ann => {
    if (violationsPerType.has(ann.type)) {
      violationsPerType.set(ann.type, violationsPerType.get(ann.type)! + 1)
    } else {
      violationsPerType.set(ann.type, 1)
    }
  })

  const octokitAnnotationsPerRequest = 50
  for (let i = 0; i < annotations.length; i += octokitAnnotationsPerRequest) {
    info(`Sending violations ${i} to ${Math.min(i + 49, annotations.length)}`)
    const status = i < annotations.length ? 'in_progress' : 'completed'
    const annotationsForPage = annotations.slice(i, i + 50)
    try {
      await octokit.request(
        `PATCH /repos/${context.repo.owner}/${context.repo.repo}/check-runs/${checkRunId}`,
        {
          owner: context.repo.owner,
          repo: context.repo.repo,
          check_run_id: checkRunId,
          name: checkName,
          status,
          conclusion: 'failure',
          output: {
            title: `Sensitivity check results`,
            summary: `${annotations.length} violations have been found`,
            text: `Summary of violations by type: \n* ${Array.from(
              violationsPerType
            )
              .map(v => `${v[0]}: ${v[1]}`)
              .join('\n* ')}

Found violations in the following files: \n* ${violatingFiles.join('\n* ')}`,
            annotations: annotationsForPage
          }
        }
      )
    } catch (err) {
      error(`Unable to update check with annotations: ${err}`)
    }
  }
}
