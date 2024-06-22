import fs from 'fs'
import path from 'path'
import { talksDir } from '../constants'

type FeaturedTalk = {
  emoji: string
  title: string
  body: string
  date: string
  link: string
  imageUrl: string
}

type Talk = {
  emoji: string
  isFeatured: boolean
  title: string
  body: string
  date: string
  type: 'talk' | 'community'
  link: string
  imageUrl: string | null
}

export async function getFeaturedTalks(): Promise<FeaturedTalk[]> {
  const talks = await getTalks()
  const featuredTalks = talks.filter(
    (talk) => talk.isFeatured && talk.imageUrl !== null
  )
  return featuredTalks.map((featuredTalk) => ({
    emoji: featuredTalk.emoji,
    title: featuredTalk.title,
    body: featuredTalk.body,
    date: featuredTalk.date,
    link: featuredTalk.link,
    imageUrl: featuredTalk.imageUrl!,
  }))
}

export async function getTalks(): Promise<Talk[]> {
  const filePath = path.join(talksDir, 'talks.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const json = JSON.parse(data)
  if (!Array.isArray(json.talks)) {
    throw new Error('Invalid JSON format: "talks" key is not an array')
  }
  const talks: Talk[] = json.talks

  talks.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return talks
}
