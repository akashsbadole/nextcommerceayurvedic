import prisma from './prisma'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from './utils'

const DEFAULTS: Record<string, string> = {
  siteName: 'Vedika Ayurveda',
  supportEmail: 'support@vedika.in',
  phone: '',
  address: '',
  freeShippingThreshold: String(FREE_SHIPPING_THRESHOLD),
  shippingFee: String(SHIPPING_FEE),
  instagram: '',
  facebook: '',
}

export type StoreSettings = Record<string, string>

export async function getStoreSettings(): Promise<StoreSettings> {
  const rows = await prisma.setting.findMany()
  const map: StoreSettings = { ...DEFAULTS }
  for (const r of rows) map[r.key] = r.value
  return map
}
