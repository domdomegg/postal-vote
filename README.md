# postal-vote

This service allows users to apply for postal votes in England, Scotland and Wales.

## Quick start

1. Install [Node.js](https://nodejs.org/) 
2. Clone this repository
3. Start the web app with `cd web && npm install && npm start`
4. Start the server with `cd server && npm install && npm start`

## Structure

- `web`: Website that hosts a webform for users to determine their eligibility for postal voting, collect their details, and interact with the API. Written in [TypeScript](https://www.typescriptlang.org/), using [React](https://reactjs.org/), [govuk-react](https://github.com/govuk-react/govuk-react/) and [signature_pad](https://github.com/szimek/signature_pad), bootstrapped with [create-react-app](https://github.com/facebook/create-react-app/). In production, hosted on GitHub pages.
- `server`: API for creating the PDF application, looking up user's council and emailing the form. Written in [TypeScript](https://www.typescriptlang.org/), using [Serverless](https://www.serverless.com/), [serverless-offline-ses-v2](https://github.com/domdomegg/serverless-offline-ses-v2), [pdf-lib](https://github.com/Hopding/pdf-lib) and [nodemailer](https://nodemailer.com/about/). In production, hosted in AWS.

## Legality of electronic signatures

Regulation 6 (Electronic signatures and related certificates) of The Representation of the People (England and Wales) Regulations 2001 states "A requirement in these Regulations for an application, notice or objection to be signed is satisfied [...] where there is an electronic signature incorporated into or logically associated with a particular electronic communication, and the certification by any person of such a signature."


Regulation 51 (General requirements for applications for an absent vote) of The Representation of the People (England and Wales) Regulations 2001 sets out requirements for what the absent vote application must state and that it must be signed.

Together, these mean electoral registration offices should accept electronic signatures. From experience, all the councils I've dealt with are happy to handle e-signed applications.

The Electoral Commision also has more [guidance on the regulations around requirements for postal votes](https://www.electoralcommission.org.uk/running-electoral-registration-england/absent-voting/postal-voting/what-are-prescribed-requirements-personal-identifiers).