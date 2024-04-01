import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import fs from 'fs'
import path, { dirname } from 'path'
import { toFrontmatterString } from './markdown'
import { queryNotionDatabase } from './notion/db'
import {
  NotionProperty,
  extractEmoji,
  extractSlug,
  markdownContentFromNotionPage,
  parseNotionProperties,
} from './notion/notion'
import { single } from './utils'

async function generateContents() {
  console.log(`---`)
  console.log(`Generating contents...`)
  const projectRoot = path.resolve(__dirname, '../../../')
  const response = await queryNotionDatabase('contents', {
    filter: {
      and: [
        {
          property: 'key',
          select: {
            equals: 'about-this-site',
          },
        },
      ],
    },
  })
  const pageObjectResponse = single(response.results) as PageObjectResponse

  const markdownContent = await markdownContentFromNotionPage(
    pageObjectResponse.id,
    ['contents', 'about-this-site']
  )

  const filePath = path.join(projectRoot, 'contents', `about-this-site.md`)
  fs.mkdirSync(dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, markdownContent)

  console.log(`✅ Generated markdown file: about-this-site.md`)
}

const properties: NotionProperty[] = [
  { name: 'title', type: 'title' },
  // { name: 'imageUrl', type: 'url' },
  { name: 'coverImage', type: 'files' },
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
      slug,
      response,
      properties,
    })

    const frontmatter = toFrontmatterString(
      Object.fromEntries([
        emoji ? ['emoji', emoji] : [],
        ...extractedProperties.map((value, index) => {
          const propertyName = properties[index].name
          return [propertyName, value]
        }),
      ])
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

;(async () => {
  await generateContents()
  await generatePosts()
})()
