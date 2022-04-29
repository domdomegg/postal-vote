import { JSONSchemaType } from 'ajv'

export interface Request {
    firstName: string,
    lastName: string,
    dob: string,
    email: string,
    phone?: string,
    addressLine1: string,
    addressLine2?: string,
    addressLine3?: string,
    addressPostcode: string,
    alternativeAddressLine1?: string,
    alternativeAddressLine2?: string,
    alternativeAddressLine3?: string,
    alternativeAddressPostcode?: string,
    alternativeAddressReason?: string,
    signatureDataUri: string,
    date: string,
    recaptchaToken?: string,
}

const postcodePattern = '^([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]?[0-9][ABD-HJLN-UW-Z]{2}|GIR0AA)$'
const emailPattern = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
const datePattern = '^[0-9]{8}$' // ddmmyyyy

export const schema: JSONSchemaType<Request> = {
    type: 'object',
    properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        dob: { type: 'string', pattern: datePattern },
        email: { type: 'string', pattern: emailPattern },
        phone: { type: 'string', nullable: true },
        addressLine1: { type: 'string' },
        addressLine2: { type: 'string', nullable: true },
        addressLine3: { type: 'string', nullable: true },
        addressPostcode: { type: 'string', pattern: postcodePattern },
        alternativeAddressLine1: { type: 'string', nullable: true },
        alternativeAddressLine2: { type: 'string', nullable: true },
        alternativeAddressLine3: { type: 'string', nullable: true },
        alternativeAddressPostcode: { type: 'string', nullable: true, pattern: postcodePattern },
        alternativeAddressReason: { type: 'string', nullable: true },
        signatureDataUri: { type: 'string' },
        date: { type: 'string', pattern: datePattern },
        recaptchaToken: { type: 'string', nullable: true },
    },
    required: ['firstName', 'lastName', 'dob', 'email', 'addressLine1', 'addressPostcode', 'signatureDataUri', 'date'],
    additionalProperties: false,
}
