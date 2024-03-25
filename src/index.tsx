import { Hono } from 'hono'
import { ssgParams } from 'hono/ssg'
import { css } from 'hono/css'
import { getPosts } from './lib/post'
import { serveStatic } from '@hono/node-server/serve-static'
import { Layout } from './components/Layout'
import { baseURL, siteName } from './lib/constants'
import { jsxRenderer } from 'hono/jsx-renderer'

const app = new Hono()

const posts = await getPosts()

type Metadata = {
  title: string
  url: string
  description: string
  ogImage?: string
}

let metadata: Metadata = {
  title: siteName,
  url: baseURL,
  description: '',
  ogImage: '/icon.jpg',
}

app.use('*', serveStatic({ root: 'public' }))

app.all(
  '*',
  jsxRenderer(
    ({ children }) => {
      return <>{children}</>
    },
    { docType: '<!DOCTYPE html>' }
  )
)

const postListCSS = css`
  ul {
    list-style-type: none;
    padding: unset;
  }
  ul li {
    display: flex;
    margin-bottom: 8px;
  }
  time {
    flex: 0 0 130px;
    font-style: italic;
    color: #595959;
  }
  ul li a:visited {
    color: #8e32dc;
  }
`

app.get('/', (c) => {
  metadata = {
    description: 'kosukesaigusa',
    ogImage: '/icon.jpg',
    title: siteName,
    url: baseURL,
  }
  return c.render(
    <Layout metadata={metadata}>
      <div class={postListCSS}>
        <h2>最新の記事</h2>
        <ul>
          {posts
            .map((post) => (
              <li>
                <time>{post.publishedAt}</time>
                <a href={`/posts/${post.slug}`}>{post.title}</a>
              </li>
            ))
            .slice(0, 5)}
        </ul>
      </div>
    </Layout>
  )
})

app.get(
  '/posts/:slug',
  ssgParams(async () => {
    return posts.map((post) => {
      return {
        slug: post.slug,
      }
    })
  }),
  async (c) => {
    const slug = c.req.param('slug')
    const post = posts.find((p) => p.slug === slug)
    if (!post) {
      return c.redirect('/404')
    }
    metadata = {
      description: post.description,
      ogImage: post.coverImage,
      title: siteName + ` - ${post.title}`,
      url: baseURL + '/posts/' + post.slug,
    }
    return c.render(
      <Layout metadata={metadata}>
        <h1>{post.title}</h1>
        <div>投稿日: {post.publishedAt}</div>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: post.body }}></div>
      </Layout>
    )
  }
)

app.get('/404', (c) => c.notFound())

export default app
