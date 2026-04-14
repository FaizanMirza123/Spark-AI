const ALLOWED_TAGS = new Set(["b", "i", "em", "strong", "br", "p", "span"])
const TAG_RE = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi

export function sanitize(input: string): string {
  return input.replace(TAG_RE, (match, tag: string) => {
    return ALLOWED_TAGS.has(tag.toLowerCase()) ? match : ""
  })
}
