import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { css } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { ssgParams } from 'hono/ssg'
import { Layout } from './components/Layout'
import { baseURL, siteName } from './lib/constants'
import { getAboutThisSite } from './lib/contents/aboutThisSite'
import { getContact } from './lib/contents/contact'
import { getPosts } from './lib/contents/post'
import { getFeaturedTalk, getTalks } from './lib/contents/talk'

const app = new Hono()

const [aboutThisSite, featuredTalk, talks, posts, contact] = await Promise.all([
  getAboutThisSite(),
  getFeaturedTalk(),
  getTalks(),
  getPosts(),
  getContact(),
])

type Metadata = {
  title: string
  url: string
  description: string
  ogImage?: string
}

let metadata: Metadata = {
  title: siteName,
  url: baseURL,
  description: 'Kosuke Saigusa (@kosukesaigusa) のプロフィールページです。',
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
  span {
    margin-right: 4px;
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
        <h2>このページについて</h2>
        <div dangerouslySetInnerHTML={{ __html: aboutThisSite }}></div>
        <a href="/contact">お仕事の依頼はこちら</a>
        {talks.length > 0 && (
          <>
            <h2>登壇など</h2>
            {featuredTalk && (
              <div>
                <h3>
                  <a
                    href={featuredTalk.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {featuredTalk.title}
                  </a>
                </h3>
                <div>
                  <a
                    href={featuredTalk.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={featuredTalk.imageUrl} alt={featuredTalk.title} />
                  </a>
                </div>
                <p>{featuredTalk.body}</p>
              </div>
            )}
            <h3>その他の登壇やコミュニティ活動</h3>
            <ul>
              {talks.map((talk) => (
                <li>
                  <time>{talk.date}</time>
                  <a href={talk.link} target="_blank" rel="noopener noreferrer">
                    {talk.title}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
        {posts.length > 0 && (
          <>
            <h2>最新の記事</h2>
            <ul>
              {posts
                .map((post) => (
                  <li>
                    <time>{post.publishedAt}</time>
                    {post.emoji && <span>{post.emoji}</span>}
                    <a href={`/posts/${post.slug}`}>{post.title}</a>
                  </li>
                ))
                .slice(0, 5)}
            </ul>
          </>
        )}
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

app.get('/contact', async (c) => {
  metadata = {
    description: 'お仕事の依頼',
    ogImage: '/icon.jpg',
    title: siteName + ' - お仕事の依頼',
    url: baseURL + '/contact',
  }
  return c.render(
    <Layout metadata={metadata}>
      <h1>お仕事の依頼</h1>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: contact.body }}></div>
    </Layout>
  )
})

app.get('/404', (c) => c.notFound())

export default app
