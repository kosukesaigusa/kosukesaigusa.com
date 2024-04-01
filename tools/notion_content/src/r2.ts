type Param = {
  r2PathSegments: string[]
  imageUrl: string
  fileId: string
}

export async function getR2ImageUrl(param: Param): Promise<string> {
  const existingR2ImageUrl = await getExistingR2ImageUrl(param)
  if (existingR2ImageUrl !== null) {
    console.log(`✅ Image already exists in R2 : ${existingR2ImageUrl}`)
    return existingR2ImageUrl
  }
  console.log(`👀 Image does not exist in R2: ${param.imageUrl}`)
  console.log('🔄 uploading...')
  const r2ImageUrl = await uploadImageToR2(param)
  console.log(`✅ Uploaded image to R2: ${r2ImageUrl}`)
  return r2ImageUrl
}

async function getExistingR2ImageUrl(param: Param): Promise<string | null> {
  const extension = extractExtension(param.imageUrl)
  const r2Key = `${param.r2PathSegments.join('/')}/${param.fileId}.${extension}`
  const r2ImageUrl = `${process.env.IMAGE_WORKER_BASE_URL}/${r2Key}`
  const response = await fetch(r2ImageUrl)
  const statusCode = response.status
  if (statusCode === 200) {
    return r2ImageUrl
  }
  if (statusCode === 404) {
    return null
  }
  throw new Error('Unexpected status code from R2 image worker')
}

async function uploadImageToR2(param: Param): Promise<string> {
  const dir = param.r2PathSegments.join('/')
  const base64 = await encodeImage(param.imageUrl)
  const result = await fetch(`${process.env.IMAGE_WORKER_BASE_URL}/upload`, {
    method: 'PUT',
    body: JSON.stringify({ base64, fileId: param.fileId, dir }),
    headers: {
      Authorization: `Basic ${process.env.IMAGE_WORKER_AUTH_TOKEN}`,
    },
  })
  if (result.status !== 200) {
    throw new Error('Failed to upload image to R2 image worker')
  }
  const key = [
    ...param.r2PathSegments,
    `${param.fileId}.${extractExtension(param.imageUrl)}`,
  ].join('/')
  return `${process.env.IMAGE_WORKER_BASE_URL}/${key}`
}

async function encodeImage(imageUrl: string): Promise<string> {
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

function extractExtension(imageUrl: string): string {
  const extensionMatch = imageUrl.match(/\.([a-zA-Z0-9]+)(?:\?|$)/)
  if (!extensionMatch)
    throw new Error(
      `Failed to extract image extension from given imageUrl: ${imageUrl}`
    )
  return extensionMatch[1]
}
