import { FC } from 'hono/jsx'
import { Footer } from './Footer'
import { Head } from './Head'
import { Header } from './Header'
import { globalCSS } from '../lib/style'

export const Layout: FC = (props) => {
  return (
    <html class={globalCSS} lang="ja">
      <Head metadata={props.metadata} />
      <Header {...props} />
      <main>{props.children}</main>
      <Footer />
    </html>
  )
}
