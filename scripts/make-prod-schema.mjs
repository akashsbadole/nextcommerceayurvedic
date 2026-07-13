// Generates prisma/schema.postgres.prisma from the canonical
// prisma/schema.prisma by swapping the SQLite provider for Postgres.
// Used for production (Neon). Both schemas share the exact same models,
// so the only difference is the datasource `provider` line.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const src = join(root, 'prisma', 'schema.prisma')
const out = join(root, 'prisma', 'schema.postgres.prisma')

let schema = readFileSync(src, 'utf8')
if (!schema.includes('provider = "sqlite"')) {
  console.error('Expected `provider = "sqlite"` in prisma/schema.prisma')
  process.exit(1)
}
schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"')
writeFileSync(out, schema)
console.log('Generated prisma/schema.postgres.prisma (provider = "postgresql")')
