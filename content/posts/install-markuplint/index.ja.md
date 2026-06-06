---
title: Reactのプロダクトにmarkuplintを導入する
date: 2022-12-19
description: ISUCON11に参加した記録です
tags: ['フロントエンド', 'React']
---

HTMLを仕様に基づいて正しく書くには思ったよりも必要な専門知識が必要です。
例えば以下のコードは`p`要素で許可されている内容は記述コンテンツのみなので、HTMLの仕様としては誤ったコードになります。

```html
<p>
  <h1>見出し</h1>
</p>
```

## HTMLの仕様に基づいてコーディングする目的
先ほどのコードはHTMLとしては構文エラーとなりますが、ブラウザ上では問題なく表示されます。見た目上問題ないのであれば、些細な問題なので別に良いのでは？と思うかもしれません。

ページを閲覧する対象は人だけでなくスクリーンリーダーや検索BOTなどの機械も含まれます。これらの機械が正確にページを解釈するには、HTMLの仕様に基づいて正しく記述されている事が重要になってきます。

## markuplintの導入
最初にも書いたように仕様に基づいてHTMLを記述するのは一定の専門知識が必要です。知識を持つ人がプルリクのタイミングでコードをチェックする事も可能ですが、それをするには全てコードをレビューする必要があり負担が膨大になります。

[markuplint](https://markuplint.dev/)を利用することで、HTMLの構文チェックを自動化でき全員が実装の段階で構文エラーに気づく事ができるようになります。また、構文エラーを通してHTMLの仕様を学ぶことも出来るので一石二鳥です。

### インストール
まずは必要なパッケージをインストールします。

`markuplint`パッケージはHTML構文チェクのコア機能を提供するCLIツールです。

`@markuplint/jsx-parser`パッケージはjsxで記述されたコードをHTML文字列にパースして構文チェック可能にするためのパッケージです。

`@markuplint/react-spec`パッケージはReactで定義されている`key`属性などを仕様として認識されるためのパッケージです。Reactのコードを構文チェックすると`error: 属性「key」は許可されていません (invalid-attr)`とHTML仕様に定義されていない`key`属性が不正な属性として検知されてしまうため、それを防ぐためにこのパッケージをインストールします。

vueやsvelteなどの他のライブラリに対応したparserやspecは[公式リポジトリ](https://github.com/markuplint/markuplint/tree/dev/packages/@markuplint)で探すことができます。

```shell
$ yarn markuplint @markuplint/jsx-parser @markuplint/react-spec
```

### 設定ファイルを作成
プロジェクトのルートに`.markuplintrc`を以下の内容で作成します。

```json
// .markuplintrc
{
    // テストファイルやストーリーファイルを除外
    "excludeFiles": [
        "./**/*.{test,spec,stories}.tsx"
    ],
    // ツールの推奨設定を利用
    "extends": [
        "markuplint:recommended"
    ],
    // jsxをHTMLテキストにパース
    "parser": {
        ".tsx$": "@markuplint/jsx-parser"
    },
    "specs": {
        ".tsx$": "@markuplint/react-spec"
    }

}
```

### 構文チェックを実行する
実際に以下のコンポーネントファイルを対象として構文チェックを実行してみます。

```tsx
// src/
const Hello = () => {
  return (
    <p>
      <h1>こんにちは</h1>
    </p>
  )
}
```

構文チェックの対象をblobパターンで指定をして実行をします。デフォルトでは対象ファイルの全て結果が表示されるので、`-p`オプションを付与することでエラーだけを出力するようにできます。

無事にHTMLの構文エラーが検出することができました。

```shell
$ yarn markuplint -p src/**/*.tsx
<markuplint> error: HTMLの仕様において、要素「p」の内容は妥当ではありません (permitted-contents) 
  4: ••••••••<p>
  5: ••••••••••••<h1>テスト</h1>
```

VSCodeを利用している場合には[markuplintプラグイン](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)もあるので、合わせてインストールしておくと便利です。