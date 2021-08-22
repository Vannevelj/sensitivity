import { Annotation } from './checker'
import { getOctokit, context } from '@actions/github'
import { RestEndpointMethodTypes } from '@octokit/rest'

type ChecksCreateResponse = RestEndpointMethodTypes['checks']['create']['response']
const checkName = 'Some test name'

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

  return response
}

export async function updateRunWithAnnotations(
  token: string,
  checkRunId: number,
  annotations: Annotation[]
) {
  const octokit = getOctokit(token)

  if (annotations.length === 0) {
    await octokit.request(
      `PATCH /repos/${context.repo.owner}/${context.repo.repo}/check-runs/${checkRunId}`,
      {
        owner: context.repo.owner,
        repo: context.repo.repo,
        check_run_id: checkRunId,
        name: checkName,
        status: 'completed',
        conclusion: 'success'
      }
    )
  }

  const octokitAnnotationsPerRequest = 50
  for (let i = 0; i < annotations.length; i += octokitAnnotationsPerRequest) {
    const status = i < annotations.length ? 'in_progress' : 'completed'
    const annotationsForPage = annotations.slice(i, i + 50)
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
          summary: `A little summary`,
          text: `Some text`,
          annotationsForPage
        }
      }
    )
  }
}
