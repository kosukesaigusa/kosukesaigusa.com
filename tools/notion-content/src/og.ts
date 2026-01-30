import fs from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer'

export async function generateOGImage(
  title: string,
  extension: 'png' | 'webp',
): Promise<Uint8Array> {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630 })

  const html = `
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: linear-gradient(135deg, #2c3e50 0%, #bdc3c7 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 630px;
            box-sizing: border-box;
          }
          .container {
            width: 1120px;
            height: 550px;
            background: white;
            border-radius: 20px;
            padding: 48px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          h1 {
            font-size: 56px;
            font-weight: bold;
            text-align: left;
            word-wrap: break-word;
            margin: 0;
            padding: 0;
            line-height: 1.2;
            color: #2c3e50;
          }
          .profile {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-top: auto;
          }
          .profile img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin-right: 20px;
            object-fit: cover;
          }
          .profile span {
            font-size: 36px;
            color: #2c3e50;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${title}</h1>
          <div class="profile">
            <img src="https://cdn.kosukesaigusa.com/assets/profile_1260_630.jpg" alt="Profile">
            <span>kosukesaigusa</span>
          </div>
        </div>
      </body>
    </html>
  `

  await page.setContent(html)
  const screenshot = await page.screenshot({ type: extension })
  await browser.close()

  return screenshot
}

async function main() {
  const extension = 'png'
  const title =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  const imageBuffer = await generateOGImage(title, extension)

  await fs.writeFile(
    path.join(__dirname, '..', `og-image.${extension}`),
    imageBuffer,
  )

  console.log('OG image generated successfully.')
}

main().catch(console.error)
