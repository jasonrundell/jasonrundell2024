import { HeroConstField } from './HeroTerminal'

export type Role = 'comment' | 'keyword' | 'identifier' | 'key' | 'string' | 'plain'

export interface Segment {
  text: string
  role: Role
}

export function buildSegments(
  comment: string,
  identifier: string,
  fields: ReadonlyArray<HeroConstField>
): Segment[] {
  const out: Segment[] = []
  out.push({ text: `// ${comment}\n`, role: 'comment' })
  out.push({ text: 'const', role: 'keyword' })
  out.push({ text: ' ', role: 'plain' })
  out.push({ text: identifier, role: 'identifier' })
  out.push({ text: ' = {\n', role: 'plain' })
  fields.forEach((field, index) => {
    out.push({ text: '  ', role: 'plain' })
    out.push({ text: field.key, role: 'key' })
    out.push({ text: ': ', role: 'plain' })
    out.push({ text: `'${field.value}'`, role: 'string' })
    out.push({ text: index < fields.length - 1 ? ',\n' : '\n', role: 'plain' })
  })
  out.push({ text: '}', role: 'plain' })
  return out
}

export function totalLength(all: ReadonlyArray<Segment>): number {
  return all.reduce((sum, seg) => sum + seg.text.length, 0)
}

export function sliceSegments(
  all: ReadonlyArray<Segment>,
  n: number
): Segment[] {
  if (n <= 0) return []
  const out: Segment[] = []
  let remaining = n
  for (const seg of all) {
    if (remaining <= 0) break
    if (seg.text.length <= remaining) {
      out.push(seg)
      remaining -= seg.text.length
    } else {
      out.push({ text: seg.text.slice(0, remaining), role: seg.role })
      remaining = 0
    }
  }
  return out
}
