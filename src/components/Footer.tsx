import type { FC } from 'hono/jsx'
import { siteName } from '../lib/constants'

export const Footer: FC = () => {
  return (
    <footer>
      <div>© 2024 {siteName}</div>
    </footer>
  )
}
