type Param = {
  blockId: string
  slug: string
  parent: string
}

export const getR2ImageUrlMarkdownString = async (
  param: Param
): Promise<string> => {
  const imageInfo = extractImageInfo(param.parent)
  const fileId = param.blockId
  const dir = `posts/${param.slug}`
  const key = `${dir}/${fileId}.${imageInfo.extension}`
  const r2ImageUrl = `${process.env.IMAGE_WORKER_BASE_URL}/${key}`
  const response = await fetch(r2ImageUrl)
  const statusCode = response.status

  if (statusCode === 200) {
    console.log(`Image already exists in R2 : ${r2ImageUrl}`)
    return toMarkdownString(key, r2ImageUrl)
  }

  if (statusCode === 404) {
    console.log(`Image does not exist in R2: ${r2ImageUrl}`)
    console.log('uploading...')
    const base64 = await fetchAndEncodeImage(imageInfo.url)
    const result = await fetch(
      `https://r2-image-worker.saigusa758cloudy.workers.dev/upload`,
      {
        method: 'PUT',
        body: JSON.stringify({ base64, fileId, dir }),
        headers: {
          Authorization: `Basic ${process.env.IMAGE_WORKER_AUTH_TOKEN}`,
        },
      }
    )
    if (result.status !== 200) {
      throw new Error('Failed to upload image to R2 image worker')
    }
    console.log('Image uploaded to R2')
    return toMarkdownString(key, r2ImageUrl)
  }
  throw new Error('Unexpected status code from R2 image worker')
}

const extractImageInfo = (
  markdown: string
): {
  url: string
  extension: string
} => {
  const regex = /!\[.*?\]\((.*?)\)/
  const match = markdown.match(regex)
  if (!match) throw new Error('Failed to extract image info from markdown')

  const url = match[1]
  const extensionMatch = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)
  if (!extensionMatch)
    throw new Error('Failed to extract image info from markdown')

  return {
    url,
    extension: extensionMatch[1],
  }
}

const fetchAndEncodeImage = async (imageUrl: string): Promise<string> => {
  const response = await fetch(imageUrl)
  const blob = await response.blob()
  const arrayBuffer = await blob.arrayBuffer()
  const base64data = btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  )
  return base64data
}

const toMarkdownString = (key: string, url: string) => {
  return `![${key}](${url})`
}
