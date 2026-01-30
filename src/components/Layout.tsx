import type { Child, FC } from 'hono/jsx'
import type { Metadata } from '../lib/metadata'
import { globalCSS } from '../lib/style'
import { Footer } from './Footer'
import { Head } from './Head'
import { Header } from './Header'

export const Layout: FC<{
  children: Child
  metadata: Metadata
}> = (props) => {
  return (
    <html class={globalCSS} lang="ja">
      <Head metadata={props.metadata} />
      <body>
        <Header {...props} />
        <main>{props.children}</main>
        <Footer />
      </body>
    </html>
  )
}
