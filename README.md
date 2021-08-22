# Sensitivity

A Github action to scan your entire codebase for sensitive information such as emails, SSH keys and, AWS secrets and others.

## Usage

```yaml
name: 'Check for sensitive data'
on: pull_request

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: Vannevelj/sensitivity@v1.9
        with:
          path: src
          ignorePaths: '["src/__tests__/checker.*.test.ts"]'
          token: ${{ secrets.GITHUB_TOKEN }}

```

![](https://user-images.githubusercontent.com/2777107/130368748-ebfdbbb4-8035-430f-9704-fb0f90aaa2da.png)

See it on the Marketplace: https://github.com/marketplace/actions/sensitive-data-check

### Parameters

| Parameter  | Required  | Description  |
|---|---|---|
| path  | Yes  | The path to your root folder, e.g. src  |
| token | Yes | Github authentication token, i.e. ${{ secrets.GITHUB_TOKEN }} |
| ignorePaths  | No  | Array of globs for paths that will be ignored  |

## Contributing

Install the dependencies  
```bash
npm install
```

Build the typescript and package it for distribution
```bash
npm run all
```

Run the tests
```bash
npm test
```

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder. To generate the updated code, execute the following:

```bash
npm run all
git add .
git commit -m "Generated release files"
```

You just need to push them and manually create a new release inside Github.

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
