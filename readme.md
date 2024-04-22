# Guy Veut

<img align="right" width="100" height="100" src="images/bot_logo.png">

Guy Veut is a slack application that do the same as HeyTaco or Briq, for free :wink:

The main goal is to build a strong and happy team.

## Tech used

### Infra

- [AWS Lambda](https://aws.amazon.com/lambda/)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb/)
- [Serverless](https://www.serverless.com/)

### Code

- [Node](https://nodejs.org/)
- [Lerna](https://lerna.js.org/)
- [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)

## Prerequisites

You need to have on your machine

- Node.js (use nvm)
- Yarn
- Lerna
- AWS cli
- Serverless

## Installation

### Retrieve a Slack App Configuration Token

1. Generate your [App Configuration Token](https://api.slack.com/reference/manifests#config-tokens)
1. Export it as an environment variable : `export SLACK_APP_CONF_TOKEN=xoxe.xoxp-1-Mi...`

### Init a Slack app (only once)

1. Create the slack app - run `./install slack create`
1. Retrieve from output:
   - APP_ID
   - CLIENT_ID
   - CLIENT_SECRET
   - VERIFICATION_TOKEN
   - CLIENT_SIGNING_SECRET
1. Retrieve your BOT_TOKEN:
   - connect to `https://api.slack.com/apps/${app_id}/oauth`
   - click `Install to Workspace`
   - validate
   - Retrieve BOT_TOKEN
1. Reflect those to this example configuration file - .config.dev.yml _(must be placed in the root directory)_
   ```
   MAX_POINT_PER_DAY: 5        # Maximum point a user can give per day
   REACT_SYMBOL: ""            # Emoticon the bot will use to validate message
   REACT_NEGATIVE_SYMBOL: ""   # Emoticon the bot will use to reject message
   REWARD_SYMBOL: ""           # Emoticon use to reward someone
   REWARD_NAME: ""             # Name of the reward (eq. cookie)
   REWARD_PLURAL: ""           # Plural name of the reward (eq. cookies)
   CLIENT_ID: ""
   CLIENT_SECRET: ""
   VERIFICATION_TOKEN: ""
   CLIENT_SIGNING_SECRET: ""
   BOT_TOKEN: ""
   STAGE: "dev"
   ```

### Deploy the bot

Install dependencies :

```bash
yarn
```

Deploy the serverless stack :

```bash
yarn deploy
```

### Configure your slack app (again)

1. Reconfigure you Slack app - run `./install slack update -i ${app_id}`

## Todo

- Verify and list permissions needed on slack side
- Remove unused variables
