import { baseURL, siteName } from './constants'

export type Metadata = {
  title: string
  url: string
  description: string
  ogImage?: string
}

export const defaultMetadata: Metadata = {
  title: siteName,
  url: baseURL,
  description: 'Kosuke Saigusa (@kosukesaigusa) のプロフィールページです。',
  ogImage: 'https://cdn.kosukesaigusa.com/assets/profile_1260_630.jpg',
}
