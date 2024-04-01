import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { MdBlock } from 'notion-to-md/build/types'
import { toMarkdownImageLink, urlFromMarkdownImageLink } from '../markdown'
import { getR2ImageUrl } from '../r2'
import { n2m } from './config'

export type NotionProperty = {
  name: string
  type: NotionValueType
}

export function extractEmoji(response: PageObjectResponse): string | undefined {
  return (response.icon as { type: string; emoji: string } | null)?.emoji
}

export function extractSlug(response: PageObjectResponse): string {
  return (response.properties['slug'] as NotionRichText).rich_text[0].plain_text
}

type ParseNotionPropertiesParam = {
  slug: string
  response: PageObjectResponse
  properties: NotionProperty[]
}

export async function parseNotionProperties(
  param: ParseNotionPropertiesParam
): Promise<(string | boolean)[]> {
  const extractedProperties: (string | boolean)[] = []
  for (const property of param.properties) {
    if (notionStringProperties.includes(property.type)) {
      extractedProperties.push(extractStringValue(param.response, property))
    } else if (notionLinkProperties.includes(property.type)) {
      extractedProperties.push(extractLinkValue(param.response, property))
    } else if (notionFileProperties.includes(property.type)) {
      const imageUrl = extractFileValue(param.response, property)
      const r2ImageUrl = await getR2ImageUrl({
        r2PathSegments: ['posts', param.slug],
        imageUrl,
        fileId: 'cover_image',
      })
      extractedProperties.push(r2ImageUrl)
    } else if (notionDateProperties.includes(property.type)) {
      extractedProperties.push(
        extractDateValue(param.response, property).toISOString().split('T')[0]
      )
    } else if (notionBooleanProperties.includes(property.type)) {
      extractedProperties.push(extractBooleanValue(param.response, property))
    } else {
      throw new Error(
        `Invalid property type: ${property.type} (${property.type})`
      )
    }
  }
  return extractedProperties
}

export async function markdownContentFromNotionPage(
  pageId: string,
  r2PathSegments: string[]
): Promise<string> {
  const mdBlocks = await n2m.pageToMarkdown(pageId)
  const blocks: MdBlock[] = []
  for (const block of mdBlocks) {
    if (block.type === 'image') {
      const url = urlFromMarkdownImageLink(block.parent)
      const r2ImageUrl = await getR2ImageUrl({
        r2PathSegments: r2PathSegments,
        imageUrl: url,
        fileId: block.blockId,
      })
      const updatedBlock = {
        ...block,
        parent: toMarkdownImageLink({
          altText: block.blockId,
          url: r2ImageUrl,
        }),
      }
      blocks.push(updatedBlock)
    } else {
      blocks.push(block)
    }
  }

  const mdString = n2m.toMarkdownString(blocks)
  return mdString.parent
}

const notionStringValue = {
  title: 'title',
  rich_text: 'rich_text',
} as const

const notionLinkValue = {
  url: 'url',
} as const

const notionFileValue = {
  files: 'files',
} as const

const notionDateValue = {
  date: 'date',
} as const

const notionBooleanValue = {
  checkbox: 'checkbox',
} as const

type NotionValueType =
  | NotionStringValueType
  | NotionLinkValueType
  | NotionFileValueType
  | NotionDateValueType
  | NotionBooleanValueType

type NotionStringValueType =
  (typeof notionStringValue)[keyof typeof notionStringValue]

type NotionLinkValueType =
  (typeof notionLinkValue)[keyof typeof notionLinkValue]

type NotionFileValueType =
  (typeof notionFileValue)[keyof typeof notionFileValue]

type NotionDateValueType =
  (typeof notionDateValue)[keyof typeof notionDateValue]

type NotionBooleanValueType =
  (typeof notionBooleanValue)[keyof typeof notionBooleanValue]

const notionStringProperties = Object.values(notionStringValue).map(
  (e) => e as string
)

const notionLinkProperties = Object.values(notionLinkValue).map(
  (e) => e as string
)

const notionFileProperties = Object.values(notionFileValue).map(
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

type NotionLink = {
  type: 'url'
  url: string
}

type NotionFile = {
  type: 'files'
  files: { file: { url: string } }[]
}

type NotionDate = {
  type: 'date'
  date: { start: string }
}

type NotionCheckBox = {
  type: 'checkbox'
  checkbox: boolean
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

function extractLinkValue(
  response: PageObjectResponse,
  property: NotionProperty
): string {
  const key = property.name
  if (property.type === 'url') {
    return (response.properties[key] as NotionLink).url as string
  }
  throw new Error('Invalid property type')
}

function extractFileValue(
  response: PageObjectResponse,
  property: NotionProperty
): string {
  const key = property.name
  if (property.type === 'files') {
    return (response.properties[key] as NotionFile).files[0].file.url as string
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
