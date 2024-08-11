import devServer from '@hono/vite-dev-server'
import ssg from '@hono/vite-ssg'
import { defineConfig } from 'vite'
import Sitemap from 'vite-plugin-sitemap'

const entry = 'src/index.tsx'

export default defineConfig(() => {
  return {
    plugins: [devServer({ entry }), Sitemap(), ssg({ entry })],
  }
})
