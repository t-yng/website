---
title: CIでスペルチェックを自動化してみたけど最終的にやめた話
date: 2021-12-14
description: この記事はYAMAP エンジニア Advent Calendar 2021の14日目の記事です。ある時、チーム内のコードレビューをしていてスペルミスの指摘が目立つようになってきました。スペルミスのチェックは人がやるより機械がやった方が早いということで、CIでスペルチェックを自動化してコードレビューで自動でスペルミスを指摘する仕組みを導入してみたので、導入方法とその後の効果をまとめました。

tags: ['自動化']
---

この記事は [YAMAP エンジニア Advent Calendar 2021](https://qiita.com/advent-calendar/2021/yamap-engginers) の14日目の記事です。

## 経緯
ある時、チーム内のコードレビューをしていてスペルミスの指摘が目立つようになってきました。

スペルミスのチェックは人がやるより機械がやった方が早いということで、CIでスペルチェックを自動化してコードレビューで自動でスペルミスを指摘する仕組みを導入してみたので、導入方法とその後の効果をまとめました。

この記事で書いているコードは全て [t-yng/ci-spell-check-sample](https://github.com/t-yng/ci-spell-check-sample) に置いてあります。

## 導入手段の検討
### 既存のGithub Actions
マーケットプレイスの GitHub Actions をリポジトリに導入するパターン。  
いくつか試したが期待する結果が得られなかったので、後述する GitHub Actions を自作する形式にした。

- [Typo CI](https://typoci.com/)
  - Github Actions でリポジトリにスペルチェックを導入可能
  - 調査段階では Github が 404 になっていたので詳細は調べてない
  - 執筆時点(2021/12/13 時点）で確認したら参照可能になっていた
- [Check spelling](https://github.com/marketplace/actions/check-spelling)
  - 調査時点では β版 の状態だった
- [misspell-fixer-action](https://github.com/marketplace/actions/misspell-fixer-action)
  - Developers.ioで[オススメ記事](https://dev.classmethod.jp/articles/spellcheck-on-actions/)があった

### スペルチェックのライブラリを GitHub Actions に組み込む
自前でスクリプトを書いて Github Actions を構築するパターン。  
[cspell](https://github.com/streetsidesoftware/cspell) を GitHub Actions に組み込みCIを構築することにしました。

- [misspell](https://github.com/client9/misspell)
  - 試してみたが期待したようにスペルミスを判定してくれなかった
  - ライブラリとして JavaScript などの言語はサポート外に見えた

- [misspell-fixer](https://github.com/vlajos/misspell-fixer)
  - ↑で挙げた misspell-fixer-action で利用されているライブラリ
  - 環境構築が面倒そうだったので試してない

- [cspell](https://github.com/streetsidesoftware/cspell)
  - VSCode の拡張で圧倒的な人気を誇る [Code Spell Checker
](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) で利用されているライブラリ
  - cliがあり手軽に実行できるのとVSCodeの拡張として使われている実績がある
  - prismjs などのライブラリ名や固有名詞がスペルミスとして扱われる点だけがデメリット  
     (単語辞書を作成すればスキップは可能）

## CIの構築
### cspellの導入とnpmスクリプトの作成
cspell のインストール

```shell
$ yarn add -D cspell
```

cspellの設定ファイル(.cspell.json)を作成

```json
// .cspell.json
{
  "version": "0.2",
  "language": "en",
  "words": [], // 固有名詞などチェックをスキップしたい単語を登録する
  "dictionaries": [
    "softwareTerms", 
    "misc",
    "companies",
    "typescript", 
    "node", 
    "html", 
    "css", 
    "fonts", 
    "filetypes", 
    "npm"
  ],
  "ignorePaths": [
    "**/node_modules/**",
    "**/.git/**",
    "**/.vscode/**",
    "**/.next/**",
    "**/__generated__/**",
    "**/package.json",
    "**/yarn-error.log",
    "**/yarn.lock"
  ]
}
```

npmスクリプトの作成

```json
{
  "scripts": {
    "spell-check": "cspell lint -c .cspell.json --show-suggestions"
  }
}
```

適当にタイポがあるコードを作って実行してみる。  
スペルチェックが正常に動作して代替の単語の提案してくれる部分ができた。

```javascript
// src/index.js
const heloo = (name) => console.log(`hello, ${name}`);
```

```shell
$ yarn spell-check
1/1 ./src/index.js 597.00ms X
/Users/tomohiro/workspace/examples/ci-spell-check/src/index.js:1:7 - Unknown word (heloo) Suggestions:  [helot, helio, hello, Helot, holo]
```

### GitHub Actions の実装
スペルチェックを実行するスクリプトは作れたので、あとは GitHub Actions でスクリプトを実行するだけです。  
`.github/workflows/spell-check.yaml` を作成してプッシュしたタイミングでスペルチェックが走るようにします。

```yaml
# .github/workflows/spell-check.yaml
name: review-on-push

on: push

jobs:
  spell-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - uses: actions/setup-node@v1
        with:
          node-version: '16.x'

      - name: Install Dependencies
        run: yarn install
        env:
          NODE_AUTH_TOKEN: ${{ secrets.AUTH_TOKEN_FOR_GITHUB_PKG }}

      - name: execute spell-check
        run: yarn spell-check
```

### Reviewdog でPRにコメントする
今の状態はどこのコードでスペルミスが発生しているのか分かりにくい状態なので Reviewdog でPRにコメントします。  
さらに cspell はスペルミスが見つかった時にエラーとしてスクリプトが終了するので Reviewdog を通すことでCIがエラーとなるのを防ぐこともできます。

```yaml
# .github/workflows/spell-check.yaml
- uses: reviewdog/action-setup@v1
- run: reviewdog -version

(省略)

- name: execute spell-check
  env:
    REVIEWDOG_GITHUB_API_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    yarn spell-check \
      | reviewdog -level=warning -efm="%f:%l:%c - %m" -reporter=github-pr-review
```

これでスペルミスがあった時に Reviewdog がPRに自動でコメントしてくれます。

![Reviewdogのコメント](spell-check-reviewdog.png)

### 修正差分に対してのみスペルチェックを実行する
リポジトリが肥大化していくとスペルチェックの対象コードが膨大になりスペルチェックの実行に時間がかかるので、修正差分だけを対象としてスペルチェックを実行するようにします。

```yaml
- uses: actions/checkout@v2
  with:
    fetch-depth: 0 # 差分取得のために全てのブランチを取得する

(省略)

- name: execute spell-check
  env:
    REVIEWDOG_GITHUB_API_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    git diff remotes/origin/$GITHUB_BASE_REF --name-only \ 
      | yarn spell-check \
      | reviewdog -level=warning -efm="%f:%l:%c - %m" -reporter=github-pr-review
```

## 導入後の結果
導入後はPRでスペルミスが自動で見つかり一定の効果を得ることができました。

しかし、デメリットでも書いたようにライブラリ名や固有名詞がスペルミスとして判定されてしまい、スペルミスでない単語もコメントで指摘されてしまっていました。この指摘が非常にノイズとなりコードレビューがやりづらくなってしまったので、結局CIは廃止する流れになりました。:smiling_face_with_tear:

## 結局どうしたか？
最終的には個々人の開発エディタにプラグインとしてスペルチェックの拡張を導入して、開発中にスペルチェックに気づけるようにする形で落ち着き、結果としてコードレビューでスペルミスを指摘することはほぼ無くなりました！

正直言うと最初からこの方法で良いとも思っていたのですが、個々人の開発環境に依存する解決策はできれば避けたく個人的にやってみたかったという理由でCIを導入を試していました。

CIは廃止する流れになりましたが、チームの問題への意識が高まって結果としてスペルミスの問題を解消されたので良かったです。
