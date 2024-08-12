import { css } from 'hono/css'
import { Child, FC } from 'hono/jsx'
import { Metadata } from '../lib/metadata'
import { globalCSS } from '../lib/style'
import { Footer } from './Footer'
import { Head } from './Head'
import { Header } from './Header'

const layoutCSS = css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`

export const Layout: FC<{
  children: Child
  metadata: Metadata
}> = (props) => {
  return (
    <html class={globalCSS} lang="ja">
      <Head metadata={props.metadata} />
      <body class={layoutCSS}>
        <Header {...props} />
        <main>{props.children}</main>
        <Footer />
      </body>
    </html>
  )
}
