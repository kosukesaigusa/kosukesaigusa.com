# kosukesaigusa.com

Cloudflare Workers で公開する静的なプロフィールサイト。

## ローカルで確認する

```sh
npx --yes wrangler@4.156.0 dev
```

表示されるローカル URL をブラウザで開く。

Cloudflare API にアクセスする場合は、`mise.local.toml` に `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` を設定し、`mise exec --` に続けてコマンドを実行する。このファイルは Git 管理しない。

## 公開する

`main` への push をきっかけに、GitHub Actions が Cloudflare Workers にデプロイする。GitHub Actions のシークレットに `CLOUDFLARE_WORKERS_API_TOKEN` と `CLOUDFLARE_WORKERS_ACCOUNT_ID` を設定する。

`wrangler.toml` には `kosukesaigusa.com` をカスタムドメインとして設定している。Cloudflare の API トークンには、Worker のデプロイとカスタムドメインの設定に必要な権限を付与する。

初回の公開時には、Cloudflare Pages に設定されている `kosukesaigusa.com` の CNAME レコードとカスタムドメインを解除してから、Workers にデプロイする。切り替えが完了するまでサイトにアクセスできない時間が発生する。

ページとスタイルは `public/` 内のファイルを編集する。

## 画像

- `flutterkaigi-2026.png` は [登壇資料](https://flutterkaigi2026.kosukesaigusa.com/)の共有画像。
- `paper-evaluation.png` は [論文](https://www.anlp.jp/proceedings/annual_meeting/2026/pdf_dir/B8-13.pdf)の図 1 をトリミングした画像（M. Ota ほか、 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)）。
- `flutterkaigi-2024.webp` は [FlutterKaigi 2024 の登壇資料](https://www.slideshare.net/slideshow/omiai-flutter-flutterkaigi-2024/273516514)の 8 ページ目。
- `flutterkaigi-2023.webp` は [FlutterKaigi 2023 の登壇資料](https://www.slideshare.net/slideshow/dart-732c/263276078)の表紙。
- `flutterninjas-2024.webp` は [FlutterNinjas 2024 の登壇資料](https://www.slideshare.net/slideshow/flutterninjas-2024-exploring-full-stack-dart-for-firebase-server-side-development/270791886)の表紙。
- `fluttergakkai.png` は [FlutterGakkai](https://fluttergakkai.connpass.com/)のグループ画像。
- `github.svg` と `x.svg` は [Simple Icons](https://simpleicons.org/)のアイコン。
- `ogp.jpg` は SNS での共有画像。
