# Sensitivity

A Github action to scan your entire codebase for sensitive information such as emails, SSH keys and, AWS secrets and others.

## Usage

```yaml
name: 'Check for sensitive data'
on: pull_request

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: Vannevelj/sensitivity@v1
        with:
          path: src
          ignorePaths: '["src/__tests__/checker.*.test.ts"]'

```

### Parameters

| Parameter  | Required  | Description  |
|---|---|---|
| path  | Yes  | The path to your root folder, e.g. src  |
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

Actions are run from GitHub repos so we will checkin the packed dist folder. A husky pre-push hook will build the package and commit the changes, you just need to push them and manually create a new release inside Github.

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
