# postal-vote [(view live)](https://domdomegg.github.io/postal-vote/)

This service allows users to apply for postal votes in England, Scotland and Wales.

## How it works

![demo](./docs/demo.gif)

This service is composed of a web form and back-end. The web form screens users with eligibility questions (are you registered, what country are you in) and if eligble, collects their details and signature. It sends these to the back-end which generates a completed PDF application form based on [a template](./server//resources/template.pdf). If the user passes an invisible bot challenge the back-end then sends this to the applicants electoral registration office (ERO), otherwise it provides the form to the user and they send it to their ERO.

<details>
<summary>Full process flow</summary>
<img src="./docs/process-flow.svg" />
</details>

## Quick start

1. Install [Node.js](https://nodejs.org/) 
2. Clone this repository
3. Start the web app with `cd web && npm install && npm start`
4. Start the server with `cd server && npm install && npm start`

To view the web app, go to [`localhost:8000`](http://localhost:8005) in your browser.

To view email, go to [`localhost:8005`](http://localhost:8005) in your browser.

You can edit the files in `server/src` and `web/src` and your app will automatically update.

## Structure

- `web`: Website that hosts a webform for users to determine their eligibility for postal voting, collect their details, and interact with the API. Written in [TypeScript](https://www.typescriptlang.org/), using [React](https://reactjs.org/), [govuk-react](https://github.com/govuk-react/govuk-react/) and [signature_pad](https://github.com/szimek/signature_pad), bootstrapped with [create-react-app](https://github.com/facebook/create-react-app/).
- `server`: API for creating the PDF application, looking up user's council and emailing the form. Written in [TypeScript](https://www.typescriptlang.org/), using [Serverless](https://www.serverless.com/), [serverless-offline-ses-v2](https://github.com/domdomegg/serverless-offline-ses-v2), [pdf-lib](https://github.com/Hopding/pdf-lib) and [nodemailer](https://nodemailer.com/about/). Uses the reCAPTCHA and WhereDoIVote APIs.


## Architecture

<img src="./docs/architecture.svg" />

This section describes the dev and production architecture of the app.

This live site is hosted at [domdomegg.github.io/postal-vote](https://domdomegg.github.io/postal-vote/).

The dev site is hosted at [domdomegg.github.io/postal-vote-dev](https://domdomegg.github.io/postal-vote-dev/).

The website is built with React as a static SPA, which is distributed to GitHub pages using GitHub actions to both the dev and prod sites automatically on commits to master. To have separate prod and dev websites there's an additional GitHub repository, [postal-vote-dev](https://github.com/domdomegg/postal-vote-dev), to act as the source repo for GitHub pages for the dev version. Because of limitations in GitHub pages (e.g. can't set redirect rules) we use the hash router from [react-router](https://reactrouter.com/) for routing, so everything is served from `/index.html`. This also has good compatiblity with the form library we use, [react-hook-form](https://react-hook-form.com/).

The server is effectively an AWS Lambda behind API Gateway that talks to a number of other AWS services (e.g. AWS SES for emails, AWS CloudWatch for monitoring, and AWS IAM for getting access to those resources). It talks to two external APIs: [Google's reCAPTCHA](https://developers.google.com/recaptcha/docs/v3) for bot detection and [DemocracyClub's WhereDoIVote](https://wheredoivote.co.uk/api/) for finding an electoral registration office for a postcode. The purpose of bot detection is to prevent someone abusing the API to send email spam to a council. The server infrastructure is managed by [Serverless](https://www.serverless.com/) and defined in [`server/serverless.ts`](./server/serverless.ts). We use various tools to bundle the actual server code before deploying it to Lambda, the key one being [webpack](https://webpack.js.org/). The code is automatically deployed to the dev stage on commits to master by GitHub actions, while deploying the code to prod is manual (done with `cd server && npm install && npm run deploy:prod`).

To configure the dev and prod versions we use environment files, which specify the stage and various settings and credentials. For example, these include whether to display the dev banner, API base URLs, and access keys for reCAPTCHA. The npm scripts in [`web/package.json`](./web/package.json) and [`server/package.json`](./server/package.json) are set up to select the right env file before building and deploying app. The website environment files are public, while the server ones are kept secret. Local templates are provided for ease of local development, which are automatically installed (without overwriting existing configuration if present) in the `postinstall` npm hook.

## Legality of electronic signatures

Regulation 6 (Electronic signatures and related certificates) of The Representation of the People (England and Wales) Regulations 2001 states "A requirement in these Regulations for an application, notice or objection to be signed is satisfied [...] where there is an electronic signature incorporated into or logically associated with a particular electronic communication, and the certification by any person of such a signature."

Regulation 51 (General requirements for applications for an absent vote) of The Representation of the People (England and Wales) Regulations 2001 sets out requirements for what the absent vote application must state and that it must be signed.

Together, these mean electoral registration offices should accept electronic signatures. From experience, all the councils I've dealt with are happy to handle e-signed applications.

The Electoral Commision also has more [guidance on the regulations around requirements for postal votes](https://www.electoralcommission.org.uk/running-electoral-registration-england/absent-voting/postal-voting/what-are-prescribed-requirements-personal-identifiers).