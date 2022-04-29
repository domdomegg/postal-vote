import nodemailer from 'nodemailer'
import * as aws from '@aws-sdk/client-ses'
import { NodeHttpHandler } from '@aws-sdk/node-http-handler'
import env from './env/env'

const requestHandler = new NodeHttpHandler({
    connectionTimeout: 30_000,
    socketTimeout: 30_000,
})

const ses = env.STAGE === 'local'
    ? new aws.SES({
        apiVersion: '2010-12-01',
        requestHandler,
        region: 'localhost',
        endpoint: 'http://localhost:8005',
        credentials: { accessKeyId: 'DEFAULT_ACCESS_KEY', secretAccessKey: 'DEFAULT_SECRET' },
    })
    : new aws.SES({ requestHandler })

export const transporter = nodemailer.createTransport({
    SES: { ses, aws },
})
