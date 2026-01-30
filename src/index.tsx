import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { ssgParams } from 'hono/ssg'
import { Layout } from './components/Layout'
import { baseURL, siteName } from './lib/constants'
import { getAboutThisSite } from './lib/contents/aboutThisSite'
import { getContact } from './lib/contents/contact'
import { getPosts } from './lib/contents/post'
import { getFeaturedTalks, getTalks } from './lib/contents/talk'
import { defaultMetadata } from './lib/metadata'

const app = new Hono()

const [aboutThisSite, featuredTalks, talks, posts, contact] = await Promise.all(
  [
    getAboutThisSite(),
    getFeaturedTalks(),
    getTalks(),
    getPosts(),
    getContact(),
  ],
)

app.use('*', serveStatic({ root: 'public' }))

app.all(
  '*',
  jsxRenderer(
    ({ children }) => {
      return <>{children}</>
    },
    { docType: '<!DOCTYPE html>' },
  ),
)

app.get('/', (c) => {
  return c.render(
    <Layout metadata={defaultMetadata}>
      <div class="page">
        <h2>このページについて</h2>
        <div dangerouslySetInnerHTML={{ __html: aboutThisSite }}></div>
        <a href="/contact">お仕事の依頼はこちら</a>
        {talks.length > 0 && (
          <>
            <h2>登壇など</h2>
            {featuredTalks.map((featuredTalk) => (
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
                <div class="responsive-wrapper">
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
            ))}
            <h3>その他の登壇やコミュニティ活動</h3>
            <ul class="plain">
              {talks.map((talk) => (
                <li>
                  <time class="meta-time">{talk.date}</time>
                  {talk.emoji && <span class="meta-emoji">{talk.emoji}</span>}
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
            <ul class="plain">
              {posts
                .map((post) => (
                  <li>
                    <time class="meta-time">{post.publishedAt}</time>
                    {post.emoji && <span class="meta-emoji">{post.emoji}</span>}
                    <a href={`/posts/${post.slug}`}>{post.title}</a>
                  </li>
                ))
                .slice(0, 5)}
            </ul>
          </>
        )}
      </div>
    </Layout>,
  )
})

app.get('/posts', (c) => {
  const metadata = {
    title: `${siteName} - 記事一覧`,
    url: `${baseURL}/posts`,
    description: '記事一覧ページ',
    ogImage: 'https://cdn.kosukesaigusa.com/posts/og-image.webp',
  }
  return c.render(
    <Layout metadata={metadata}>
      <div class="page">
        <h1>記事一覧</h1>
        <div class="post-list">
          {posts.map((post) => (
            <div class="post-card">
              <div class="emoji-container">
                <div class="emoji">{post.emoji || '📝'}</div>
              </div>
              <div class="content">
                <h3>{post.title}</h3>
                <div class="post-meta">{post.publishedAt}</div>
                <div class="post-description">{post.description}</div>
                <a href={`/posts/${post.slug}`}>続きを読む</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>,
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
    const metadata = {
      title: `${siteName} - ${post.title}`,
      url: `${baseURL}/posts/${post.slug}`,
      description: post.description,
      ogImage: post.ogImage,
    }
    return c.render(
      <Layout metadata={metadata}>
        <div class="page">
          <div>
            <h1>{post.title}</h1>
            <div class="muted">投稿日: {post.publishedAt}</div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.body }}></div>
        </div>
      </Layout>,
    )
  },
)

app.get('/contact', async (c) => {
  const metadata = {
    title: `${siteName} - お仕事の依頼`,
    url: `${baseURL}/contact`,
    description: 'お仕事の依頼',
    ogImage: 'https://cdn.kosukesaigusa.com/assets/profile_1260_630.jpg',
  }
  return c.render(
    <Layout metadata={metadata}>
      <div class="page">
        <h1>お仕事の依頼</h1>
        <div dangerouslySetInnerHTML={{ __html: contact.body }}></div>
      </div>
    </Layout>,
  )
})

app.get('/404', (c) => c.notFound())

export default app
