import Ajv from 'ajv'
import type {
    APIGatewayProxyEventV2, APIGatewayProxyResult, Context, Handler,
} from 'aws-lambda'
import createHttpError from 'http-errors'
import axios from 'axios'
import { transporter } from './email'
import makePDF from './pdf'
import { schema } from './validation'
import env from './env/env'

const ajv = new Ajv({ strict: true })
const validate = ajv.compile(schema)

const handler = async (event: APIGatewayProxyEventV2, _context: Context): Promise<APIGatewayProxyResult> => {
    if (!event.body) {
        throw new createHttpError.BadRequest('Missing request body')
    }

    const body = parseJSON(event.body)

    if (!validate(body)) {
        throw new createHttpError.BadRequest(`Request body was not the right structure: ${[validate.errors?.map((e) => `body${e.instancePath} ${e.message}`)].join(', ')}`)
    }

    const pdf = Buffer.from(await makePDF(body))

    const fullName = `${body.firstName} ${body.lastName}`

    const recaptchaResponse = await axios.post<{
        success: boolean,
        score: number,
        action: string,
        // eslint-disable-next-line camelcase
        challenge_ts: string,
        hostanme: string,
        // eslint-disable-next-line camelcase
        error_codes?: string[],
    }>('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
            secret: env.RECAPTCHA_V3_SECRET_KEY,
            response: body.recaptchaToken,
        },
        validateStatus: () => true,
    })

    // Use recaptcha to prevent bots from using this service to spam councils with emails
    if (!recaptchaResponse.data.success || recaptchaResponse.data.score < 0.5) {
        return makeResponse(404, { message: 'Potential bot detected. For API access please get in contact.', pdf: pdf.toString('base64') })
    }

    const wdivResponse = await axios.get<{
        council?: {
            name?: string,
            email?: string,
            phone?: string,
            website?: string,
            address?: string,
            // eslint-disable-next-line camelcase
            electoral_services_contacts?: {
                // eslint-disable-next-line camelcase
                phone_numbers?: string[],
                email?: string,
                address?: string,
                website?: string,
            },
        },
    }>(`https://wheredoivote.co.uk/api/beta/postcode/${body.addressPostcode}.json`, { validateStatus: () => true })
    const councilName = wdivResponse.data?.council?.name
    const toName = `${councilName ? `${councilName} ` : ''}Electoral Services Team`
    const toEmail = wdivResponse.data?.council?.electoral_services_contacts?.email ?? wdivResponse.data.council?.email

    if (!toEmail) {
        return makeResponse(404, { message: "Couldn't find council email", pdf: pdf.toString('base64') })
    }

    await transporter.sendMail({
        from: {
            name: 'Postal Vote Service',
            address: 'postalvoteapp@gmail.com',
        },
        to: [{
            name: toName,
            address: env.STAGE === 'dev' ? 'success@simulator.amazonses.com' : toEmail,
        }],
        // user address
        cc: [{
            name: fullName,
            address: body.email,
        }],
        replyTo: {
            name: fullName,
            address: body.email,
        },
        subject: 'Postal vote application',
        text: `Dear ${toName},\n\nPlease see the attached postal vote application form for ${fullName}.\n\nTo contact the voter, use the details in the form (email: ${body.email}${body.phone ? `, phone: ${body.phone}` : ''}).`,
        attachments: [{
            filename: `postal-vote-${fullName.toLowerCase().replace(/[^a-z]+/g, '-')}.pdf`,
            contentType: 'application/pdf',
            content: pdf,
        }],
    })

    return makeResponse(200, { message: 'Successfully submitted application.', councilName })
}

const parseJSON = (s: string): unknown => {
    try {
        return JSON.parse(s)
    } catch {
        throw new createHttpError.BadRequest('Request body was not valid JSON')
    }
}

export const main: Handler<APIGatewayProxyEventV2, APIGatewayProxyResult> = async (event, context) => {
    try {
        return await handler(event, context)
    } catch (err) {
        if (isSafeError(err) && err.statusCode <= 500) {
            return makeResponse(err.statusCode, err.message)
        }

        // eslint-disable-next-line no-console
        console.error(err)

        return makeResponse(500, 'An unknown error occurred. Please try again later.')
    }
}

const makeResponse = (statusCode: number, data: unknown) => ({
    statusCode,
    headers: {
        // this is always defined, because we add it into the environment in serverless.ts
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        'x-postal-vote-version': process.env.VERSION!,
    },
    body: JSON.stringify(typeof data === 'string' ? { message: data } : data),
})

const isSafeError = (err: unknown): err is {
    statusCode: number, message: string,
} => (
    typeof err === 'object'
    && err !== null
    && 'statusCode' in err
    && 'message' in err
)
