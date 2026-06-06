---
title: TypeScriptプロジェクトをモノリポ化した時のまとめ
date: 2020-08-09
description: ディレクトリ分割でフロントエンドとサーバーのコードを管理していたリポジトリをリファクタしてモノリポ化した時のまとめ。
tags: ['TypeScript']
---

1つのリポジトリ内でフロントエンドとサーバーのコードをディレクトリ分割の形式で管理していましたが、色々と辛くなってきたので、リファクタしてモノリポ化しました。  
その時に考慮した事をまとめています。

※ リファクタ後のリポジトリはプライベートリポジトリなので公開していません。

## 開発環境
フロントエンドのフレームワークとしてNext.jsを利用しており、外部へのAPIリクエストのプロキシを目的としてBFFをNext.jsのカスタムサーバーとしてexpressを用いて実装しています。

* BFF: TypeScript, Node.js, express（Next.jsのカスタムサーバー）
* フロントエンド: TypeScript, Next.js

### 初期構成
リファクタ前の構成は次のようになっており、ディレクトリ分割によりフロントとサーバーのコードを管理している状態でした。

```
.
├── .storybook
├── pages
├── public
├── src
│   ├── client
│   ├── common
│   ├── config
│   ├── server
│   └── types
├── stories
├── test
│   ├── src
│   │   ├── client
│   │   ├── common
│   │   └── server
│   └── tsconfig.json
├── next.config.js
├── nodemon.json
├── package.json
├── server.ts
├── tsconfig.json
├── tsconfig.common.json
└── tsconfig.server.json
```

### 初期構成の問題
初期のディレクトリ構成ではルートに大量のファイルやディレクトリが存在していて、初見で見た時にどのファイルやディレクトリがフロントとサーバーのどちらに関係しているのか非常に分かり辛い状態でした。また `src` や `test` の中で `server` と `client` でディレクトリを分けていますが、フロントとサーバーではTypeScriptの設定が異なるため、tsconfigの設定も複雑化していました。  
※ 説明のために省略していますが、実際は他にもDockerのディレクトリなども存在します。

## モノリポ化

### 利用ツールの検討
今回は yarn workspace のみを利用してモノリポ化を進めました。

モノリポ化で利用されるライブラリとしては [lerna](https://github.com/lerna/lerna) が有名ですが、採用を見送りました。今回のケースでは yarn workspace のみで目的が達成できたのと、lerna が BabelなどのOSSプロジェクト（一般に公開する前提のプロジェクト）をモノリポ化する目的で作られているように見え、プライベートなリポジトリでは冗長かつ依存ツールを追加して管理コストが増える事は避けたかったからです。

フロントとサーバーをモノリポで管理するツールとして [Nx](https://nx.dev/react) も検討しましたが、簡単に触った感じでは想像以上にフルスタックな印象を受け、Nx のディレクトリ構成に従う必要がありそうで、既存プロジェクトの移行コストが非常に高そうだったので見送りました。

参考として、 [Yarn Workspaces: monorepo management without Lerna for applications and coding examples](https://codewithhugo.com/yarn-workspaces-application-monorepo/) とかの記事もありました。

### TypeScript Project Reference
モノリポ化にあたり、TypeScript の [Project Reference](https://www.typescriptlang.org/docs/handbook/project-references.html) を新たに導入しました。これは、TS3.0 から追加された仕組みでTypeScriptのプロジェクトを独立して管理する事ができます。モノリポによりパッケージを分割するので、合わせてTypeScriptのビルドなどもパッケージ単位で分割したくて導入しました。

モノリポ環境では、@app/web => @app/server と依存している時に、@app/web を先にビルドすると、@app/server がビルドされておらずモジュール解決に失敗する問題が発生する可能性があります。Project Reference を導入すると、`tsc --build` と実行することで、@app/web をビルドする時に合わせて @app/server を必要に応じてビルドしてくれるので、依存関係の問題を解消する事もできます。

### 最終構成

モノリポ化した後のディレクトリ構成は次のようになりました。フロントとサーバーがパッケージ単位で分割されて関連する設定ファイルやディレクトリもパッケージでまとめられたので、非常に見通しが良くなりました。

```
├── workspaces
|   ├── common                複数のパッケージから共通で利用するパッケージ
|   │   ├── src               ソースコード置き場
|   |   ├── package.json
|   |   └── tsconfig.json     
|   ├── config                設定ファイルを保持するパッケージ
|   │   ├── index.ts          バレルファイル
|   │   ├── firebase.ts       
|   |   ├── package.json
|   |   └── tsconfig.json     TypeScriptの設定ファイル
|   ├── server                サーバー側のパッケージ
|   │   ├── src               ソースコード置き場
|   │   ├── test              テストコード置き場
|   │   ├── types             型定義ファイル置き場
|   |   ├── package.json
|   |   └── tsconfig.json     
|   ├── web
|   |   ├── .storybook        Storybookの設定ファイル置き場
|   |   ├── public            画像などの公開ファイル置き場
|   |   ├── pages             Next.jsのページコンポーネント置き場
|   |   ├── src
|   |   ├── stories           Storybookのストーリーファイル置き場
|   |   ├── test              テストコード置き場
|   |   ├── next.config.js    Next.jsの設定ファイル
|   |   ├── nodemon.json      開発環境でのNext.jsのカスタムサーバー自動起動の設定
|   |   ├── package.json
|   |   ├── server.ts         Next.jsのカスタムサーバー（実装はserverパッケージを参照）
|   |   ├── tsconfig.json
|   |   └── tsconfig.server.json
|   └── tsconfig.json
└── pakcage.json
```

`web` パッケージの package.json と tsconfig.json の一部です。

```json
# web/package.json

{
    "dependencies": {
        "@app/server": "*"
    }
}
```

```json
# web/tsconfig.json

{
    "extends": "../tsconfig.json",
    "references": [
        { "path": "../server" }
    ]
}
```
