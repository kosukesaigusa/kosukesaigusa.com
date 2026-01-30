import type { FC } from 'hono/jsx'
import { siteName } from '../lib/constants'

export const Header: FC = (props) => {
  const path = new URL(props.metadata.url).pathname
  return (
    <header>
      <h2>{siteName}</h2>
      <nav>
        <a className={path === '/' ? 'active' : ''} href="/">
          Home
        </a>
        <a className={path === '/contact' ? 'active' : ''} href="/contact">
          Contact
        </a>
        <a className={path === '/posts' ? 'active' : ''} href="/posts">
          Posts
        </a>
        <a
          href="https://github.com/kosukesaigusa"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://x.com/kosukesaigusa"
          target="_blank"
          rel="noopener noreferrer"
        >
          X
        </a>
      </nav>
    </header>
  )
}
