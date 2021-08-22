import { Annotation } from './checker'
import { getOctokit } from '@actions/github'
import { RestEndpointMethodTypes } from '@octokit/rest'

type ChecksCreateResponse = RestEndpointMethodTypes['checks']['create']['response']

export async function createCheck(
  token: string,
  owner: string,
  repo: string
): Promise<ChecksCreateResponse> {
  const octokit = getOctokit(token)

  const response = await octokit.rest.checks.create({
    owner,
    repo,
    status: 'in_progress'
  })

  return response
}

export async function updateRunWithAnnotations(
  token: string,
  checkRunId: number,
  owner: string,
  repo: string,
  annotations: Annotation[]
) {
  const octokit = getOctokit(token)

  if (annotations.length === 0) {
    await octokit.request(
      `PATCH /repos/${owner}/${repo}/check-runs/${checkRunId}`,
      {
        owner,
        repo,
        check_run_id: checkRunId,
        name: 'some test name',
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
      `PATCH /repos/${owner}/${repo}/check-runs/${checkRunId}`,
      {
        owner,
        repo,
        check_run_id: checkRunId,
        name: 'some test name',
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
