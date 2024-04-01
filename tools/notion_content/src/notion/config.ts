import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

export const notionClient = new Client({ auth: process.env.NOTION_API_KEY! })

export const n2m = new NotionToMarkdown({ notionClient })
