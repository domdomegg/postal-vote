import nodemailer from 'nodemailer'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { NodeHttpHandler } from '@smithy/node-http-handler'
import env from './env/env'

const requestHandler = new NodeHttpHandler({
    connectionTimeout: 30_000,
    socketTimeout: 30_000,
})

const sesClient = env.STAGE === 'local'
    ? new SESv2Client({
        requestHandler,
        region: 'localhost',
        endpoint: 'http://localhost:8005',
        credentials: { accessKeyId: 'DEFAULT_ACCESS_KEY', secretAccessKey: 'DEFAULT_SECRET' },
    })
    : new SESv2Client({ requestHandler })

export const transporter = nodemailer.createTransport({
    SES: { sesClient, SendEmailCommand },
})
