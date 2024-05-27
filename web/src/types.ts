export interface Env {
  STAGE: 'local' | 'dev' | 'prod',

  API_BASE_URL: string,

  RECAPTCHA_V3_SITE_KEY: string,
}
