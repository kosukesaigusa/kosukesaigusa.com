import fs from 'node:fs'
import path from 'node:path'
import rehypeStringify from 'rehype-stringify'
import { remark } from 'remark'
import remarkExpressiveCode from 'remark-expressive-code'
import remarkExtractFrontmatter from 'remark-extract-frontmatter'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import yaml from 'yaml'
import { postsDir } from '../constants'

type Post = {
  emoji: string
  slug: string
  title: string
  publishedAt: string
  description: string
  ogImage?: string
  body: string
}

export const getPosts = async () => {
  const posts: Post[] = await Promise.all(
    fs.readdirSync(postsDir).map(async (file) => {
      const filePath = path.join(postsDir, file)
      const content = fs.readFileSync(filePath, { encoding: 'utf-8' })

      const result = await remark()
        .use(remarkParse)
        .use(remarkFrontmatter, [
          { type: 'yaml', marker: '-', anywhere: false },
        ])
        .use(remarkExtractFrontmatter, {
          yaml: yaml.parse,
          name: 'frontMatter',
        })
        .use(remarkExpressiveCode, { theme: 'github-light' })
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeStringify, { allowDangerousHtml: true })
        .use(remarkGfm)
        .process(content)

      const data = result.data.frontMatter as Post

      const post: Post = {
        emoji: data.emoji,
        slug: path.parse(path.basename(filePath)).name,
        title: data.title,
        publishedAt: data.publishedAt,
        description: data.description,
        ogImage: data.ogImage,
        body: result.toString(),
      }
      return post
    }),
  )

  posts.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })

  return posts
}
