import fs from 'fs'
import path from 'path'
import { talksDir } from '../constants'

type FeaturedTalk = {
  title: string
  body: string
  date: string
  link: string
  imageUrl: string
}

type Talk = {
  isFeatured: boolean
  title: string
  body: string
  date: string
  type: 'talk' | 'community'
  link: string
  imageUrl: string | null
}

export async function getFeaturedTalk(): Promise<FeaturedTalk | undefined> {
  const talks = await getTalks()
  const featuredTalk = talks.find((talk) => talk.isFeatured)
  if (!featuredTalk) {
    return undefined
  }
  if (!featuredTalk.imageUrl) {
    throw new Error('Featured talk is missing an image')
  }
  return {
    title: featuredTalk.title,
    date: featuredTalk.date,
    link: featuredTalk.link,
    imageUrl: featuredTalk.imageUrl,
    body: featuredTalk.body,
  }
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
