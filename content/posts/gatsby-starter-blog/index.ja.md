---
title: gatsby-starter-blogでコードのシンタックスハイライトを設定
date: 2020-02-04
description: gatsby-starter-blogでコードのシンタックスハイライトを設定
tags: ['フロントエンド', 'GatsbyJS']
---
[gatsbyjs/gatsby-starter-blog](https://github.com/gatsbyjs/gatsby-starter-blog) で作成したブログはデフォルトの状態ではコードのシンタックハイライトが無く非常に見辛いです。
プラグインを設定してシンタックハイライトを導入します

## プラグインの導入
gatsby-starter-blog には最初から [gatsby-remark-prismjs](https://gatsbyjs.org/packages/gatsby-remark-prismjs) がプラグインとしてインストールされています。
そのため、新たにプラグインをインストールする必要はなく、ハイライトのcss読み込み設定を修正するだけでシンタックハイライトを有効化できます。

```js
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,  // 初期状態でインストール済み
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
```

### CSSの読み込み設定
gatsby-browser.jsにて prismjs のテーマのCSS読み込みを追記します。  
デフォルトで利用できるテーマの一覧は [PrismJS/prism/themes](https://github.com/PrismJS/prism/tree/1d5047df37aacc900f8270b1c6215028f6988eb1/themes) で確認できます。

```js
import "prismjs/themes/prism-tomorrow.css"
```

## シンタックハイライトを利用
pre記法に言語タグを指定することでシンタックハイライトを利用できます。  
利用可能な言語タグの一覧は [prismjs](https://prismjs.com/#supported-languages) の公式ページに記載してあります。

~~~js
```js
console.log('シンタックハイライトだよ')
```
~~~
