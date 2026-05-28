---
title: Gatsby製のブログにGoogleタグマネージャー経由でGoogleアナリティクスを導入する
date: 2020-02-13
description: Gatsby製のブログにGoogleタグマネージャー経由でGoogleアナリティクスを導入する
tags: ['フロントエンド', 'GatsbyJS']
---
アクセス解析をするためにブログにGoogleアナリティクスを導入しました。\
今後イベント取得の度に、リリースをするのは面倒なので、Googleタグマネージャーを設定して、アナリティクスの計測を設定しています。

今回はGatsby製のブログにGoogleタグマネージャーを設定する方法をまとめておきます。

## Googleタグマネージャーのコンテナ作成

最初にGoogleタグマネージャーのコンテナを作成しておきます。

![コンテナの作成](gtm-container-new.png)

## Googleアナリティクスの設定

管理 > +プロパティを作成 から新たに計測用のプロパティを作成しておきます。

## プラグインの追加

### gatsby-plugin-google-tagmanager

[gatsby-plugin-google-tagmanager](https://www.gatsbyjs.org/packages/gatsby-plugin-google-tagmanager/) を利用してGoogleタグマネージャーをページに埋め込みます。  
（\<head>タグに直接\<script>タグを埋め込む方法がが分からず、公式のプラグインがあったので利用しました。）

### インストール

```bash
$ yarn add gatsby-plugin-google-tagmanager
```

gastby-config.js にプラグインの設定を追記します。

```javascript
{
  resolve: `gatsby-plugin-google-tagmanager`,
  options: {
    id: `GTM-5MKNQWX`,

    // Include GTM in development.
    // Defaults to false meaning GTM will only be loaded in production.
    includeInDevelopment: false,

    // datalayer to be set before GTM is loaded
    // should be an object or a function that is executed in the browser
    // Defaults to null
    defaultDataLayer: { platform: "gatsby" },

    // Specify optional GTM environment details.
    gtmAuth: "xNwDtuXDGlgZTO1P8TF2cg",
    gtmPreview: "env-1",
    dataLayerName: 'dataLayer',
  }
}
```

設定する値は 管理 > Live（公開中）> コードを取得 の埋め込みコードから確認することができます。

![Googleタグマネージャーの埋め込みコード](gtm-script.png)

## Googleタグマネージャーの設定

### トリガーの作成

GatsbyJSはSPAでCSRで動作するため、変更の履歴をトリガーとして作成しておきます。

### 変数の作成

GAのトラッキングIDを設定した Googleアナリティクス設定 を変数として設定します。

![Googleアナリティクスの変数を作成](gtm-ga-variable.png)

### タグの作成

Googleアナリティクスにページビューを送信するタグを作成します。

Googleアナリティクスの設定には上で作成した変数を指定し、トリガーには「ページビュー」と「履歴の変更」の2つを設定しました。

初回のページ読み込みもトリガーさせるために、「ページビュー」も指定しています。

![タグの作成](gtm-tag.png)

## リリース前の確認

Googleタグマネージャーのプレビューモードを利用すれば、ローカルで埋め込みが正常に出来ているか確認できます。  

ワークスペース > プレビュー をクリックしてプレビューモードにした後に、ローカルで ページを表示します。

その際は次の設定を true に変更しておく必要があります。

```javascript
// Include GTM in development.
// Defaults to false meaning GTM will only be loaded in production.
includeInDevelopment: true,
```

ワークスペース > プレビュー をクリックしてプレビューモードにした後に、ローカルでサーバーを立ち上げてページを表示します。

正常にタグが埋め込まれている場合は、ローカルで表示したページ下部にGoogleタグマネージャーのプレビュー画面が表示されます。

## リリース

以上の設定を終えたら、Googleタグマネージャーの公開 と プラグイン追加の変更を本番環境にリリースすれば導入は完了です。

## おまけ

自分のアクセスを計測対象外とするために [Google Analytics オプトアウト アドオン (by Google)](https://chrome.google.com/webstore/detail/google-analytics-opt-out/fllaojicojecljbmefodhfapmkghcbnh) を利用しています。  
「ga.jsと連携して...」と書いてありますが、Googleタグマネージャーを経由する場合でも正常に動作してくれました。
