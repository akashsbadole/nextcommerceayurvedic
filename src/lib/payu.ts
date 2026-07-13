import crypto from 'crypto'

export function getPayuBaseUrl() {
  return process.env.PAYU_MODE === 'live'
    ? 'https://secure.payu.in/_payment'
    : 'https://test.payu.in/_payment'
}

export interface PayuParams {
  txnid: string
  amount: string
  productinfo: string
  firstname: string
  email: string
  phone: string
  surl: string
  furl: string
  udf1?: string
  udf2?: string
  udf3?: string
  udf4?: string
  udf5?: string
}

/**
 * Request hash:
 * sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
 */
export function generatePayuHash(params: PayuParams): string {
  const key = process.env.PAYU_KEY || ''
  const salt = process.env.PAYU_SALT || ''
  const { txnid, amount, productinfo, firstname, email } = params
  const udf1 = params.udf1 || ''
  const udf2 = params.udf2 || ''
  const udf3 = params.udf3 || ''
  const udf4 = params.udf4 || ''
  const udf5 = params.udf5 || ''

  const sequence = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`
  return crypto.createHash('sha512').update(sequence).digest('hex')
}

/**
 * Reverse hash for verifying the callback:
 * sha512(SALT|status|||||||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPayuResponse(body: Record<string, string>): boolean {
  const key = process.env.PAYU_KEY || ''
  const salt = process.env.PAYU_SALT || ''
  const { txnid, amount, productinfo, firstname, email, status, hash } = body
  const udf1 = body.udf1 || ''
  const udf2 = body.udf2 || ''
  const udf3 = body.udf3 || ''
  const udf4 = body.udf4 || ''
  const udf5 = body.udf5 || ''

  const sequence = `${salt}|${status}|||||||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`
  const expected = crypto.createHash('sha512').update(sequence).digest('hex')
  return expected === hash
}

export function getPayuKey(): string {
  return process.env.PAYU_KEY || ''
}
