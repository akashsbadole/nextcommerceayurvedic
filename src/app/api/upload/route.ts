import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_BYTES = 5 * 1024 * 1024

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported type' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
    const filename = `${randomUUID()}.${ext}`
    const dir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(dir, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(dir, filename), buffer)

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (e) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
