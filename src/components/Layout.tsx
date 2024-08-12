import { Child, FC } from 'hono/jsx'
import { Metadata } from '../lib/metadata'
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
      <Header {...props} />
      <main>{props.children}</main>
      <Footer />
    </html>
  )
}
