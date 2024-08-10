import { basicAuth } from 'hono/basic-auth'
import { logger } from 'hono/logger'
import { Hono } from 'hono/quick'
import { detectType } from './utils'

type Bindings = {
  BUCKET: R2Bucket
  USER: string
  PASS: string
}

type Data = {
  base64: string
  fileId: string
  dir?: string
}

const maxAge = 60 * 60 * 24 * 30

const app = new Hono<{ Bindings: Bindings }>()

app.use(logger())

app.put('/upload', async (c, next) => {
  const auth = basicAuth({ username: c.env.USER, password: c.env.PASS })
  await auth(c, next)
})

app.put('/upload', async (c) => {
  const data = await c.req.json<Data>()
  const base64 = data.base64
  const fileId = data.fileId
  const dir = data.dir ? `${data.dir}/` : ''

  if (!fileId) return c.notFound()
  if (!base64) return c.notFound()
  const type = detectType(base64)
  if (!type) return c.notFound()

  const uint8Array = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  const key = dir + fileId + '.' + type?.suffix
  await c.env.BUCKET.put(key, uint8Array, {
    httpMetadata: { contentType: type.mimeType },
  })

  return c.text(key)
})

// app.get(
//   '*',
//   cache({
//     cacheName: 'r2-image-worker',
//   })
// )

// app.get('/:resources/:resourceId/:fileName', async (c) => {
//   const { resources, resourceId, fileName } = c.req.param()

//   const object = await c.env.BUCKET.get(
//     `${resources}/${resourceId}/${fileName}`
//   )
//   if (!object) return c.notFound()

//   const data = await object.arrayBuffer()
//   const contentType = object.httpMetadata?.contentType ?? ''

//   return c.body(data, 200, {
//     'Cache-Control': `public, max-age=${maxAge}`,
//     'Content-Type': contentType,
//   })
// })

// app.get('/assets/:fileName', async (c) => {
//   const fileName = c.req.param().fileName

//   const object = await c.env.BUCKET.get(`assets/${fileName}`)
//   if (!object) return c.notFound()

//   const data = await object.arrayBuffer()
//   const contentType = object.httpMetadata?.contentType ?? ''

//   return c.body(data, 200, {
//     'Cache-Control': `public, max-age=${maxAge}`,
//     'Content-Type': contentType,
//   })
// })

// export default app
