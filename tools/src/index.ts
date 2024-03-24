import path from 'path'
import fs from 'fs'
import { Client } from '@notionhq/client'
import { dirname } from 'path'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { NotionToMarkdown } from 'notion-to-md'

const notionClient = new Client({ auth: process.env.NOTION_API_KEY! })

const n2m = new NotionToMarkdown({ notionClient })

const properties: NotionProperty[] = [
  { name: 'title', type: 'title' },
  { name: 'description', type: 'rich_text' },
  { name: 'publishedAt', type: 'date' },
  { name: 'isDraft', type: 'checkbox' },
]

const generateMarkdowns = async () => {
  const response = await notionClient.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
  })
  for (const pageObjectResponse of response.results) {
    const response = pageObjectResponse as PageObjectResponse
    const slug = (response.properties['slug'] as NotionRichText).rich_text[0]
      .plain_text
    const extractedProperties = properties.map((property) => {
      if (notionStringProperties.includes(property.type)) {
        return extractStringValue(response, property)
      } else if (notionDateProperties.includes(property.type)) {
        return extractDateValue(response, property).toISOString().split('T')[0]
      } else if (notionBooleanProperties.includes(property.type)) {
        return extractBooleanValue(response, property)
      }
      throw new Error('Invalid property type')
    })

    const frontmatterLines = extractedProperties.map((value, index) => {
      const propertyName = properties[index].name
      return typeof value === 'string'
        ? `${propertyName}: '${value}'`
        : `${propertyName}: ${value}`
    })
    const mdBlocks = await n2m.pageToMarkdown(response.id)
    const mdString = n2m.toMarkdownString(mdBlocks)
    const markdown = `---\n${frontmatterLines.join('\n')}\n---\n ${
      mdString.parent
    }`
    const projectRoot = path.resolve(__dirname, '../../')
    const filePath = path.join(projectRoot, 'content', 'posts', `${slug}.md`)
    fs.mkdirSync(dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, markdown)
    console.log(`Generated ${filePath}`)
  }
}

const notionStringValue = {
  title: 'title',
  rich_text: 'rich_text',
} as const

const notionDateValue = {
  date: 'date',
} as const

const notionBooleanValue = {
  checkbox: 'checkbox',
} as const

type NotionValueType =
  | NotionStringValueType
  | NotionDateValueType
  | NotionBooleanValueType

type NotionStringValueType =
  (typeof notionStringValue)[keyof typeof notionStringValue]

type NotionDateValueType =
  (typeof notionDateValue)[keyof typeof notionDateValue]

type NotionBooleanValueType =
  (typeof notionBooleanValue)[keyof typeof notionBooleanValue]

const notionStringProperties = Object.values(notionStringValue).map(
  (e) => e as string
)

const notionDateProperties = Object.values(notionDateValue).map(
  (e) => e as string
)

const notionBooleanProperties = Object.values(notionBooleanValue).map(
  (e) => e as string
)

type NotionTitle = {
  type: 'title'
  title: { plain_text: string }[]
}

type NotionRichText = {
  type: 'rich_text'
  rich_text: { plain_text: string }[]
}

type NotionDate = {
  type: 'date'
  date: { start: string }
}

type NotionCheckBox = {
  type: 'checkbox'
  checkbox: boolean
}

type NotionProperty = {
  name: string
  type: NotionValueType
}

function extractStringValue(
  response: PageObjectResponse,
  property: NotionProperty
): string {
  const key = property.name
  if (property.type === 'title') {
    return (response.properties[key] as NotionTitle).title[0]
      .plain_text as string
  } else if (property.type === 'rich_text') {
    return (response.properties[key] as NotionRichText).rich_text[0]
      .plain_text as string
  }
  throw new Error('Invalid property type')
}

function extractDateValue(
  response: PageObjectResponse,
  property: NotionProperty
): Date {
  const key = property.name
  if (property.type === 'date') {
    return new Date(
      (response.properties[key] as NotionDate).date.start as string
    )
  }
  throw new Error('Invalid property type')
}

function extractBooleanValue(
  response: PageObjectResponse,
  property: NotionProperty
): boolean {
  const key = property.name
  if (property.type === 'checkbox') {
    return (response.properties[key] as NotionCheckBox).checkbox as boolean
  }
  throw new Error('Invalid property type')
}

;(async () => {
  await generateMarkdowns()
})()
