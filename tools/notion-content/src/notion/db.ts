import type {
  QueryDatabaseParameters,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { notionClient } from './config'

const databaseIds = {
  contents: 'NOTION_CONTENTS_DB_ID',
  posts: 'NOTION_POSTS_DB_ID',
  talks: 'NOTION_TALKS_DB_ID',
} as const

export type DatabaseKey = keyof typeof databaseIds

export function queryNotionDatabase(
  key: DatabaseKey,
  args?: Omit<QueryDatabaseParameters, 'database_id'>,
): Promise<QueryDatabaseResponse> {
  return notionClient.databases.query({
    database_id: databaseId(key),
    ...args,
  })
}

function databaseId(key: DatabaseKey): string {
  const databaseKey = databaseIds[key]
  const databaseId = process.env[databaseKey]
  if (!databaseId) {
    throw new Error(`${databaseKey} is not defined`)
  }
  return databaseId
}
