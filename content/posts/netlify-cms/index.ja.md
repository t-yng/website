---
title: GatsbyJS + Netlify CMS でエンジニアブログを立ち上げる
date: 2019-12-31
description: GatsbyJS + Netlify CMS でエンジニアブログを立ち上げる
tags: ['フロントエンド', 'GatsbyJS']
---
## Netfify CMSとは？

任意の静的サイトジェネレーターと組み合わせて利用可能なNetlifyが提供するCMSツールです。\
テキスト編集やプレビュー機能、画像アップロードなどの機能をWebベースのUIとして提供してくれます。\
また、GitHubのAPIを内部で利用しており、管理画面上で記事作成 => githubにpush => netlifyにデプロイ のフローを自動で実施してくれます。

## GastbyJSのテンプレートからブログを作成

立ち上げるブログが無いと何も始まりません。

最初に GatbyJS の [gatsbyjs/gatsby-starter-blog](https://github.com/gatsbyjs/gatsby-starter-blog) を利用してテンプレートからブログを作成します。

```shell
$ yarn add global gatsby-cli
$ gatsby new blog https://github.com/gatsbyjs/gatsby-starter-blog
```

たった2行でブログの作成が完了しました！\
デザインの修正とかやりだすと、やる事が増えて結局途中で諦めてしまう可能性がある（自分の性格上そうなる）ので、とりあえず公開する事だけを目標とします。  

デザインとかは後からゆっくり修正していきましょう。

### Netlify CMS をインストール

続いて Netlify CMS をインストールします。

```shell
$ cd blog
$ yarn add netlify-cms-app gatsby-plugin-netlify-cms
```

`static/admin/gatsby-config.yml` ファイルを作成して次の内容を貼り付けます。

```yaml
backend:
  name: git-gateway
  branch: master

media_folder: static/images/uploaded
public_folder: /images/uploaded

collections:
  - name: "blog"
    label: "Blog"
    folder: "content/blog"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    editor:
      preview: true # プレビュー表示を有効化
    publish_mode: editorial_workflow # ワークフロー管理を有効化
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Publish Date", name: "date", widget: "datetime" }
      - { label: "Description", name: "description", widget: "string" }
      - { label: "Body", name: "body", widget: "markdown" }
```

画像をアップロードする空ディレクトリを追加します。

```shell
$ mkdir -p static/images/uploaded
$ touch static/images/uploaded/.gitkeep
```

最後に `gatsby-config.js` にプラグインを追記します。

```
plugins: [`gatsby-plugin-netlify-cms`]
```

CMSのインストールはこれだけです。 すごい簡単で感動ですね。

実際にローカル環境で確認してみましょう。

```
$ yarn development
```

http://localhost:8000/admin にアクセスしてCMSのログイン画面が表示されたらOKです。 

ログインするには後述する Netlify の認証設定が必要です。

### ブログを公開する

ここまで来たら、いよいよNetlifyにブログを公開します。

最初にGitHubにリポジトリをデプロイします。

```shell
$ git add .
$ git commit -m "Initial Commit"
$ git remote add origin https://github.com/YOUR_USERNAME/NEW_REPO_NAME.git
$ git push -u origin master
```

続いて Netlify のページ上で `New Site From Git` を選択して手順に沿ってブログを公開します。

ビルド設定は次ように設定します。

```
Build Command: gatsby build
Publish directory: public/
```

<ブログのドメイン名>/admin にアクセスすれば管理画面を表示できます。

![テンプレートの画面](blog-template.png)

テンプレートのままですが、自分のブログが公開されました (*'ω'ﾉﾉﾞ☆ﾊﾟﾁﾊﾟﾁ

## CMSの管理ユーザーの作成

CMSの管理画面にログインするために Netlify の認証設定をして管理ユーザーを作成しましょう。 Netlifyの管理画面から公開したサイトを選択して次の手順に沿ってアカウント作成の作業を進めます。

1. Settings > Identity > Enable Identity を選択
2. Registration preferences > Edit Settings > Invite only を選択 この設定をしないと誰でもアカウントを作成して管理画面にログインできてしまうので、よほどの理由がない限りは設定しておくことをオススメします
3. Services > Git Gateway > Enable Git Gateway をクリック
4. Identityタブに移動 > Invite users をクリック 自分のメールアドレスを指定して自分を管理者として招待 送信された招待メールからアカウントを作成

これでCMSの管理画面にログイン出来るようになりました。

## 記事を投稿する

最後にCMSで最初の記事を投稿していきます。

1. /admin にアクセスして、管理画面にログイン
2. `new blog` をクリック
3. 記事を書いて `Save` をクリック
4. 問題なければ Publish をクリック

以上で記事が公開されます。
