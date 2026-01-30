import { css } from 'hono/css'

export const globalCSS = css`
  /* Design tokens. */
  color-scheme: dark;
  --color-bg: #0b0f14;
  --color-surface: #0f1620;
  --color-surface-2: #121c28;
  --color-text: #e6edf3;
  --color-muted: #9db0c3;
  --color-link: #7ab7ff;
  --color-link-hover: #a7d2ff;
  --color-border: rgba(230, 237, 243, 0.12);
  --color-border-strong: rgba(230, 237, 243, 0.18);
  --color-code-bg: rgba(230, 237, 243, 0.08);
  --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.25);
  --shadow-2: 0 8px 24px rgba(0, 0, 0, 0.35);
  --radius-1: 10px;
  --radius-2: 14px;
  --space-1: 6px;
  --space-2: 10px;
  --space-3: 14px;
  --space-4: 20px;
  --space-5: 28px;
  --space-6: 40px;
  --max-width: 78ch;

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 32px 20px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family:
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      'Helvetica Neue',
      Arial,
      'Noto Sans',
      'Apple Color Emoji',
      'Segoe UI Emoji';
    background: var(--color-bg);
    color: var(--color-text);
    line-height: 1.7;
    letter-spacing: 0.01em;
  }

  main {
    width: 100%;
    max-width: var(--max-width);
    margin: 0 auto;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  header,
  footer {
    width: 100%;
    max-width: var(--max-width);
    margin: 0 auto;
  }

  header {
    padding-bottom: var(--space-4);
    margin-bottom: var(--space-5);
    border-bottom: 1px solid var(--color-border);
  }

  footer {
    padding-top: var(--space-5);
    margin-top: var(--space-6);
    border-top: 1px solid var(--color-border);
    color: var(--color-muted);
    font-size: 14px;
  }

  h1,
  h2,
  h3,
  h4 {
    line-height: 1.25;
    margin: 0 0 var(--space-3) 0;
    letter-spacing: 0;
  }

  h1 {
    font-size: 28px;
  }

  h2 {
    font-size: 20px;
  }

  h3 {
    font-size: 16px;
  }

  p {
    margin: 0 0 var(--space-3) 0;
  }

  a {
    color: var(--color-link);
    text-underline-offset: 3px;
  }

  a:hover {
    color: var(--color-link-hover);
  }

  a:focus-visible {
    outline: 2px solid var(--color-link);
    outline-offset: 2px;
    border-radius: 6px;
  }

  hr {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: var(--space-5) 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-1);
    overflow: hidden;
  }

  th,
  td {
    border-top: 1px solid var(--color-border);
    padding: 10px 12px;
    vertical-align: top;
  }

  th {
    text-align: left;
    background: var(--color-surface);
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-1);
  }

  code {
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
      'Courier New', monospace;
    font-size: 0.95em;
    padding: 2px 6px;
    border-radius: 8px;
    background: var(--color-code-bg);
    border: 1px solid var(--color-border);
  }

  pre {
    padding: 14px 16px;
    border-radius: var(--radius-2);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    overflow: auto;
    box-shadow: var(--shadow-1);
  }

  pre > code {
    all: unset;
  }

  .expressive-code {
    margin-bottom: var(--space-4);
  }

  blockquote {
    border: 1px solid var(--color-border-strong);
    background: var(--color-surface);
    border-radius: var(--radius-2);
    padding: 10px 14px;
    margin: 0 0 var(--space-4) 0;
    color: var(--color-muted);
  }

  /* Layout utilities. */
  .page {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  .muted {
    color: var(--color-muted);
  }

  /* Header. */
  header h2 {
    margin: 0 0 var(--space-3) 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
    letter-spacing: 0;
  }

  header nav {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
  }

  header nav a {
    display: inline-block;
    padding: 2px 0;
    text-decoration: none;
    color: var(--color-muted);
  }

  header nav a:hover {
    color: var(--color-link-hover);
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  header nav a.active {
    color: var(--color-text);
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  /* Lists shown on the top page. */
  ul {
    margin: 0;
    padding-left: 18px;
  }

  li {
    margin: 0 0 var(--space-2) 0;
  }

  ul.plain {
    list-style: none;
    padding-left: 0;
  }

  ul.plain li {
    display: flex;
    gap: 10px;
    align-items: baseline;
    margin: 0 0 var(--space-2) 0;
  }

  .meta-time {
    flex: 0 0 120px;
    font-variant-numeric: tabular-nums;
    color: var(--color-muted);
    font-size: 14px;
  }

  .meta-emoji {
    width: 1.5em;
    text-align: center;
  }

  /* Cards (posts list). */
  .post-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .post-card {
    border-radius: var(--radius-2);
    border: 1px solid var(--color-border);
    background: linear-gradient(180deg, var(--color-surface) 0%, #0d131c 100%);
    overflow: hidden;
    box-shadow: var(--shadow-2);
  }

  .post-card .emoji-container {
    background: rgba(122, 183, 255, 0.08);
    border-bottom: 1px solid var(--color-border);
    padding: 18px 18px;
    text-align: center;
  }

  .post-card .emoji {
    font-size: 44px;
  }

  .post-card .content {
    padding: 16px 18px 18px;
  }

  .post-card h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
  }

  .post-card .post-meta {
    font-size: 13px;
    color: var(--color-muted);
    margin-bottom: 8px;
  }

  .post-card .post-description {
    font-size: 14px;
    color: var(--color-text);
    opacity: 0.9;
    margin-bottom: 12px;
  }

  .post-card a {
    color: var(--color-link-hover);
    text-decoration: none;
  }

  .post-card a:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  /* Featured talk image wrapper. */
  .responsive-wrapper {
    width: 100%;
    position: relative;
    border-radius: var(--radius-2);
    overflow: hidden;
    border: 1px solid var(--color-border);
    background: var(--color-surface-2);
    box-shadow: var(--shadow-1);
    max-width: 720px;
    max-height: 260px;
    margin-top: var(--space-2);
    margin-bottom: var(--space-3);
  }

  .responsive-wrapper::before {
    content: '';
    display: block;
    padding-top: 44%;
  }

  .responsive-wrapper img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0;
  }
`
