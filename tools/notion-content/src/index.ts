import fs from 'node:fs'
import path, { dirname } from 'node:path'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { toFrontmatterString } from './markdown'
import { queryNotionDatabase } from './notion/db'
import {
  extractEmoji,
  extractSlug,
  markdownContentFromNotionPage,
  type NotionProperty,
  parseNotionProperties,
} from './notion/notion'
import { generateOGImage } from './og'
import { maybeUploadImageToR2 } from './r2'
import { single } from './utils'

const contentKeys = ['about-this-site', 'contact']

async function generateContents() {
  for (const key of contentKeys) {
    console.log(`---`)
    console.log(`Generating contents (${key})...`)
    const projectRoot = path.resolve(__dirname, '../../../')
    const response = await queryNotionDatabase('contents', {
      filter: {
        and: [
          {
            property: 'key',
            select: {
              equals: key,
            },
          },
        ],
      },
    })
    const pageObjectResponse = single(response.results) as PageObjectResponse

    const markdownContent = await markdownContentFromNotionPage(
      pageObjectResponse.id,
      ['contents', key],
    )

    const filePath = path.join(projectRoot, 'contents', `${key}.md`)
    fs.mkdirSync(dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, markdownContent)

    console.log(`✅ Generated markdown file: ${key}.md`)
  }
}

const talkProperties: NotionProperty[] = [
  { name: 'isFeatured', type: 'checkbox' },
  { name: 'title', type: 'title' },
  { name: 'body', type: 'rich_text' },
  { name: 'date', type: 'date' },
  { name: 'type', type: 'select' },
  { name: 'link', type: 'url' },
  { name: 'imageUrl', type: 'url' },
]

async function generateTalks() {
  console.log(`---`)
  console.log(`Generating talks...`)
  const projectRoot = path.resolve(__dirname, '../../../')
  const response = await queryNotionDatabase('talks')
  const talks: {
    [k: string]: string | boolean
  }[] = []
  for (const pageObjectResponse of response.results) {
    const response = pageObjectResponse as PageObjectResponse
    const emoji = extractEmoji(response)
    const extractedProperties = await parseNotionProperties({
      response,
      properties: talkProperties,
      r2PathSegments: ['talks', response.id],
      r2FileId: 'image',
    })

    const talk = Object.fromEntries([
      ...(emoji ? [['emoji', emoji]] : []),
      ...extractedProperties.map((value, index) => {
        const propertyName = talkProperties[index].name
        return [propertyName, value]
      }),
    ])
    talks.push(talk)
  }

  const filePath = path.join(projectRoot, 'contents', 'talks', 'talks.json')
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify({ talks }, null, 2))
  console.log(`✅ Generated ${filePath}`)
}

const postProperties: NotionProperty[] = [
  { name: 'title', type: 'title' },
  { name: 'description', type: 'rich_text' },
  { name: 'publishedAt', type: 'date' },
  { name: 'isDraft', type: 'checkbox' },
]

async function generatePosts() {
  console.log(`---`)
  console.log(`Generating posts...`)
  const projectRoot = path.resolve(__dirname, '../../../')
  const response = await queryNotionDatabase('posts')
  const length = response.results.length
  for (const [index, pageObjectResponse] of response.results.entries()) {
    console.log(`🔄 (${index + 1}/${length}) Generating markdown...`)
    const response = pageObjectResponse as PageObjectResponse
    const emoji = extractEmoji(response)
    const slug = extractSlug(response)
    const extractedProperties = await parseNotionProperties({
      response,
      properties: postProperties,
      r2PathSegments: ['posts', slug],
      r2FileId: 'cover_image',
    })

    const ogImageUrl = await maybeUploadPostOGImage({
      // Assuming the title is the first property.
      title: extractedProperties[0] as string,
      slug,
    })

    const frontmatter = toFrontmatterString(
      Object.fromEntries([
        ...(emoji ? [['emoji', emoji]] : []),
        ...extractedProperties.map((value, index) => {
          const propertyName = postProperties[index].name
          return [propertyName, value]
        }),
        ['ogImage', ogImageUrl],
      ]),
    )
    const markdownContent = await markdownContentFromNotionPage(response.id, [
      'posts',
      slug,
    ])

    const markdown = `---\n${frontmatter}\n---\n ${markdownContent}`
    const filePath = path.join(projectRoot, 'contents', 'posts', `${slug}.md`)
    fs.mkdirSync(dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, markdown)
    console.log(`✅ (${index + 1}/${length}) Generated ${filePath}`)
  }
  console.log(`✅ Generated all (${length}) markdown files`)
}

async function maybeUploadPostOGImage(param: {
  title: string
  slug: string
}): Promise<string> {
  const extension = 'webp'
  const ogImageBuffer = await generateOGImage(param.title, extension)
  const ogImageUrl = await maybeUploadImageToR2({
    r2PathSegments: ['posts', param.slug],
    image: {
      buffer: ogImageBuffer,
      extension,
    },
    fileId: 'og-image',
  })
  return ogImageUrl
}

;(async () => {
  await generateContents()
  await generateTalks()
  await generatePosts()
})()
