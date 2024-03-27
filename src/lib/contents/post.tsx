import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import fs from 'fs'
import path from 'path'
import remarkFrontmatter from 'remark-frontmatter'
import remarkExtractFrontmatter from 'remark-extract-frontmatter'
import remarkExpressiveCode from 'remark-expressive-code'
import yaml from 'yaml'
import { postsDir } from '../constants'

type Post = {
  slug: string
  title: string
  publishedAt: string
  description: string
  coverImage?: string
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
        slug: path.parse(path.basename(filePath)).name,
        title: data.title,
        publishedAt: data.publishedAt,
        description: data.description,
        coverImage: data.coverImage,
        body: result.toString(),
      }
      return post
    })
  )

  posts.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })

  return posts
}
