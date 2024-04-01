import fs from 'fs'
import path from 'path'
import rehypeStringify from 'rehype-stringify'
import { remark } from 'remark'
import remarkExpressiveCode from 'remark-expressive-code'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'

export async function getAboutThisSite() {
  const filePath = path.join('contents', 'about-this-site.md')
  const content = fs.readFileSync(filePath, { encoding: 'utf-8' })

  const result = await remark()
    .use(remarkParse)
    .use(remarkExpressiveCode, { theme: 'github-light' })
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .use(remarkGfm)
    .process(content)
  return result.toString()
}
