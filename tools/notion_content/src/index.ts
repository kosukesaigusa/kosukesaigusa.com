import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import fs from 'fs'
import path, { dirname } from 'path'
import { toFrontmatterString } from './markdown'
import {
  NotionProperty,
  extractEmoji,
  extractSlug,
  markdownContentFromNotionPage,
  parseNotionProperties,
  queryDatabase,
} from './notion'

const properties: NotionProperty[] = [
  { name: 'title', type: 'title' },
  // { name: 'imageUrl', type: 'url' },
  { name: 'coverImage', type: 'files' },
  { name: 'description', type: 'rich_text' },
  { name: 'publishedAt', type: 'date' },
  { name: 'isDraft', type: 'checkbox' },
]

const generateMarkdowns = async () => {
  const projectRoot = path.resolve(__dirname, '../../../')
  const response = await queryDatabase()
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
  await generateMarkdowns()
})()
