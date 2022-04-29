import type { AWS } from '@serverless/typescript'
import { execSync } from 'child_process'
import env from './src/env/env'

const SERVICE_NAME = 'postal-vote-server'

const getVersion = (): string => {
    const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' })
    return `${(new Date()).toISOString().replace(/-/g, '').replace(/\..*/, '')
        .replace(/:/g, '')
        .replace('T', '.')}.${hash.trim()}`
}

const serverlessConfiguration: AWS = {
    service: SERVICE_NAME,
    frameworkVersion: '2',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: {
                forceExclude: [
                    // When the aws-sdk v3 is included in the lambda environment, we should exclude all of it
                    '@aws-sdk/types',
                ],
            },
            packagerOptions: {
                scripts: [
                    // Remove unused code that the bundler misses
                    'rm -rf node_modules/@types',
                ],
            },
        },
        'serverless-offline': {
            httpPort: 8001,
            websocketPort: 8002,
            lambdaPort: 8003,
        },
        'serverless-offline-ses-v2': {
            port: 8005,
        },
    },
    plugins: [
        'serverless-webpack',
        'serverless-offline',
        'serverless-offline-ses-v2',
    ],
    provider: {
        name: 'aws',
        stage: env.STAGE,
        runtime: 'nodejs14.x',
        region: 'eu-west-1',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        httpApi: {
            payload: '2.0',
            cors: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            STAGE: env.STAGE,
            VERSION: getVersion(),
        },
        lambdaHashingVersion: '20201221',
        memorySize: 128,
        timeout: 10,
        iam: {
            role: {
                statements: [
                    {
                        Effect: 'Allow',
                        Action: [
                            'ses:SendRawEmail',
                        ],
                        Resource: '*',
                    },
                ],
            },
        },
        // https://www.serverless.com/framework/docs/providers/aws/events/event-bridge
        eventBridge: {
            useCloudFormation: true,
        },
    },
    functions: {
        apiRouter: {
            handler: 'src/submit.main',
            events: [{
                httpApi: {
                    method: 'POST',
                    path: '/submit',
                },
            }],
        },
    },
}

module.exports = serverlessConfiguration
