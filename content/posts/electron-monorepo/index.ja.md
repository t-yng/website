---
title: ElectronアプリをMonorepo構成で構築
date: 2023-01-06
description: Electronアプリのリポジトリ構成をMonorepo構成に変更したので、その時の内容をまとめました。
tags: ['Electron']
---

全体のコードやディレクトリ構成は[higeOhige/review-cat](https://github.com/higeOhige/review-cat)を参照ください。

## 動機
久しぶりにリポジトリを見返した時にビルドの仕組みを思い出すのに思ったよりも時間がかかってしまったので、もう少しリポジトリのビルド管理を楽にしたいと思い解決策とモノリポ構成を試してみました。

## 変更前の問題点
変更前は次のようなディレクトリ構成になっており、メインプロセスとレンダラープロセスのコードをそれぞれ`electron`, `renderer` ディレクトリで管理している状態になっていました。

`electron`ディレクトリのコードはesbuildでビルドをしており、`renderer`ディレクトリのコードはviteでビルドをしているため、異なるビルド構成のプロジェクトが一つのルートで複数管理されている状態になっているため、非常に複雑な状態になっていました。

```shell
.
├── babel.config.js
├── build.js
├── electron
│   ├── app.ts
│   ├── assets
│   ├── preload.ts
│   └── src
├── esbuild.js
├── jest.config.js
├── package.json
├── renderer
│   ├── assets
│   ├── index.html
│   ├── public
│   └── src
├── tsconfig.electron.json
├── tsconfig.json
├── vite.config.ts
└── yarn.lock
```

また、`electron/app.ts`でHTMLファイルを参照する箇所のコードではビルドされたディレクトリ構成に依存する形でパスの指定がされているため、ビルドの出力先のディレクトリ構成が変更されるとアプリが正常に動作しなくなる危険性も存在しました。

```ts
// electron/app.ts
const indexUrl = isDevelopment
  ? 'http://localhost:3000/'
  : `file://${path.resolve(__dirname, './index.html')}`; // ビルドされたdistディレクトリ内のディレクトリ構成に強く依存
```

実際にビルドスクリプトを見ると`dist`ディレクトリにビルドした成果物をマージするようにビルド構成が作られており、このビルドの仕組みと上記のコードが強く依存している状態になっています。

```json
{
  "scripts": {
    "build": "yarn clean && yarn vite:build && yarn electron:build",
    "vite:build": "tsc && vite build",
    "electron:build": "node esbuild.js && yarn electron:copy && node build.js",
    "electron:copy": "cpx 'electron/assets/images/**' dist/assets/images",
  }
}
```

## Monorepo構成に変更
`packages`ディレクトリを新たに作成して、その配下にメインプロセスのパッケージとして`main`ディレクトリをレンダラープロセスのパッケージとして`web`ディレクトリを新たに作成しました。

```shell
.
├── README.md
├── package.json
├── packages
│   ├── main
│   │   ├── assets
│   │   ├── build.js
│   │   ├── esbuild.js
│   │   ├── jest.config.js
│   │   ├── package.json
│   │   ├── src
│   │   └── tsconfig.json
│   └── web
│       ├── index.html
│       ├── jest.config.js
│       ├── package.json
│       ├── public
│       ├── src
│       ├── tsconfig.json
│       └── vite.config.ts
└── yarn.lock
```

モノリポ構成はYarn Workspacesで構築するために、`package.json`にworkspacesを新たに追加しています。

```json
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

### レンダラープロセスのビルド
レンダラープロセスについては`vite.config.ts`などレンダラーだけに必要なファイル群をそのまま`web`ディレクトリに移動しただけなので特別な変更は特にありませんが、Monorepo構成でパッケージとして定義するために`package.json`のname属性に`web`を指定している点と独立してビルドを考えられるのでnpmスクリプトの記述をスッキリさせています。

```json
{
  "name": "web",
  "scripts": {
    "dev": "yarn vite",
    "build": "yarn clean && vite build",
    "clean": "rimraf dist"
  }
}
```

### メインプロセスのビルド
レンダラープロセスのHTMLファイルの参照を外部パッケージ化した`web`パッケージのHTMLファイルを参照するように変更しました。具体的には`require.resolve`で動的にパスを指定するように変更しています。これにより上記で挙げていたHTMLファイルの参照がビルドされた成果物のディレクトリ構成に強く依存する問題を改善しています。

```ts
const indexUrl = isDevelopment
   ? 'http://localhost:3000/'
   : `file://${require.resolve('web/dist/index.html')}`;
```

`package.json`には`web`パッケージへの依存を新たに追記しています。

```json
{
  "dependencies": {
    "web": "*"
  }
}
```

### ビルドの依存関係を把握する
今回のMonorepo構成のビルドの依存関係を把握するために、[electron-builder](https://www.electron.build/)で生成されたアプリが最終的にどのようにパッケージングされているか中身を覗いてみます。

最初にElectronアプリはビルドされたリソースをasar形式でパッケージングするために、asarを解凍するためのコマンドをインストールします。

```shell
$ npm install -g asar
$ asar -V
v3.2.0
```

生成されたアプリにパッケージングされたasarファイルを解凍します。

```shell
$ asar extract app/mac-arm64/ReviewCat.app/Contents/Resources/app.asar extracted
```

中身は次のようになっており、メインプロセスでビルドされた`app.js`と`preload.js`が`dist`ディレクトリに配置されており、レンダラープロセスの`web`パッケージが`node_modules/web`に配置されていることが分かります。

```shell
extracted/
├── dist
│   ├── app.js
│   └── preload.js
├── node_modules
│   └── web
└── package.json
```

このようにレンダラープロセスを外部パッケージ化して`require.resolve`で`node_modules/web/dist/index.html`のHTMLファイルをメインプロセスが参照することで、ビルド後のディレクトリ構成に依存せずにHTMLファイルを参照できるようになりました。

これで、Monorepo構成でメインプロセスとレンダラープロセスを独立してパッケージとして管理することでビルドの依存関係が非常にシンプルになったのがイメージできました。

### tsconfigをパッケージとして管理
Monorepoでパッケージを独立させたことで、`tsconfig.json`が各パッケージで重複して管理されるになってしまいました。Turborepoの[examples/basic](https://github.com/vercel/turbo/tree/main/examples/basic)を参考にして、次のようにtsconfigを管理するパッケージを新たに追加して共通化しました。

```shell
.
├── README.md
├── package.json
├── packages
│   ├── main
│   │   └── tsconfig.json
│   ├── tsconfig
│   │   ├── base.json
│   │   └── package.json
│   └── web
│       └── tsconfig.json
└── yarn.lock
```

`packages/tsconfig/base.json`に共通の設定を記述して、`packages/main`ではこのパッケージで管理している定義を継承するように`tsconfig.json`を記述しています。

```json
// packages/main/package.json
{
  "devDependencies": {
    "tsconfig": "*"
  }
}
```

```json
// packages/main/tsconfig.json
{
  "extends": "tsconfig/base.json"
}
```

### ESLintの設定をパッケージとして管理
ESLintも利用するプラグインや設定ファイルを一つのパッケージで管理します。

```shell
.
├── README.md
├── package.json
├── packages
│   ├── eslint-config-custom
│   │   ├── index.js
│   │   └── package.json
│   ├── main
│   │   └── .eslintrc
│   └── web
│       └── .eslintrc
└── yarn.lock
```

tsconfigと同様に`packages/eslint-config-custom/index.js`に共通の設定を記述して、`packages/main`ではこのパッケージで管理している定義を`.eslintrc`で継承するようにしています。

```json
// packages/main/package.json
{
  "devDependencies": {
    "eslint-config-custom": "*"
  }
}
```

```json
// packages/main/.eslintrc
{
  "extends": ["custom"]
}
```

### 全体のビルドとアプリのパッケージング
最後に全体としてのビルド構成です。プロジェクトルートの`package.json`で各パッケージのビルドを管理するnpmスクリプトを記述しました。

ビルドについては`yarn workspaces run build`だと`packages/tsconfig`などのパッケージでビルドスクリプトが存在せずにエラーになるため、各ワークスペースを指定する形になっています。
また、コードのビルド自体は独立しているため`xxx & yyy`みたいな形式で並列ビルドしても問題無いのですが、何故か正常にプロセスが終了しない問題に遭遇したので、直列でビルドする形になっています。ここら辺は[Turborepo](https://turbo.build/repo)を導入していい感じにしたいです。

```json
{
  "scripts": {
    "build": "yarn workspace web build && yarn workspace main build",
    "package": "yarn workspace main package",
  }
}
```

### Codecovへカバレッジレポートを送信
Monorepo構成にしたことで自動テストのカバレッジが複数のディレクトリで管理されるようになったので、ここも対応をしておく必要がありました。CodecovではFlags機能を使うことで一つのプロジェクトで複数のカバレッジをまとめて管理できます。

GitHub Actionsのワークフローを次のように新しく定義しました。この書き方が最適な書き方かはかなり怪しいです。

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      # （省略）
      - run: yarn test:coverage
      - name: Upload main coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          flags: main
          directory: packages/main
      - name: Upload web coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          flags: web
          directory: packages/web
```

## Monorepo構成に変更してみて
目的としていたメインプロセスとレンダラープロセスのビルドを独立して管理できるようになったので、ElectronアプリとMonorepo構成はかなり相性が良いのではないかなと思っています。