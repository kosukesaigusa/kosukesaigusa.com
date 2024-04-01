export function urlFromMarkdownImageLink(markdown: string): string {
  const regex = /!\[.*?\]\((.*?)\)/
  const match = markdown.match(regex)
  if (!match) throw new Error('Failed to extract image info from markdown')

  return match[1]
}

type Param = {
  altText: string
  url: string
}

export function toMarkdownImageLink(param: Param) {
  return `![${param.altText}](${param.url})`
}

export function toFrontmatterString(
  frontmatter: Record<string, string | boolean>
) {
  return Object.entries(frontmatter)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}: '${value}'`
      }
      return `${key}: ${value}`
    })
    .join('\n')
}
