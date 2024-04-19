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

 * Node.js (use nvm)
 * Yarn
 * Lerna
 * AWS cli
 * Serverless

## Installation

### Configure a slack app

Create a new slack app to obtain :

CLIENT_SIGNING_SECRET, CLIENT_ID, CLIENT_SECRET, BOT_TOKEN, VERIFICATION_TOKEN

Reflect this to this example configuration file - .config.dev.yml *(must be placed in the root directory)*
```
LOG_TABLE_NAME: ""          # DynamoDB table name
MAX_POINT_PER_DAY: 5        # Maximum point a user can give per day
REACT_SYMBOL: ""            # Emoticon the bot will use to validate message
REACT_NEGATIVE_SYMBOL: ""   # Emoticon the bot will use to reject message
REWARD_SYMBOL: ""           # Emoticon use to reward someone
REWARD_NAME: ""             # Name of the reward (eq. cookie)
REWARD_PLURAL: ""           # Plural name of the reward (eq. cookies)
CLIENT_SIGNING_SECRET: ""   
CLIENT_ID: ""
CLIENT_SECRET: ""
BOT_TOKEN: ""
VERIFICATION_TOKEN: ""
STAGE: "dev"
```

### Deploy the bot

Install dependencies :

```bash
yarn
```

Deploy dynamodb with cloudformation :

```bash
aws cloudformation create-stack --stack-name guyveut-db --template-body file://cloudformation.yaml
```

Deploy the serverless stack :

```bash
yarn deploy
```

### Configure your slack app (again)

  1. Event subscriptions (redirect to api/message)
  1. Slash commands (redirect to api/reports)
  1. Interactivity (redirect to api/action)

## Todo

 * Delegate the dynamodb creation to serverless instead of plain yaml
 * Verify and list permissions needed on slack side
 * Remove unused variables
