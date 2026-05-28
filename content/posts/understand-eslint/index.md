---
title: ESLintをちゃんと理解する
date: 2021-01-19
description: ESLintは毎回プロジェクト開始の最初だけ設定して、その後あまり触ることが無く毎回なんとなくで設定して、新しく設定する時に設定項目を忘れてしまう事が多いので、各設定項目や導入プラグインの目的をちゃんと理解したいと思い、まとめました。
tags: ['フロントエンド']
---
[ESLint](https://github.com/eslint/eslint) は毎回プロジェクト開始の最初だけ設定して、その後あまり触ることが無く毎回なんとなくで設定して、新しく設定する時に設定項目を忘れてしまう事が多いので、各設定項目や導入プラグインの目的をちゃんと理解したいと思い、まとめました。

## ESLintとは？
ESLint は EcmaScript/JavaScript のリンターツールです。チームでコードの利用規約を決め、各自がルールを守って開発するのは大変です。新しくメンバーが増えたときにも、その人がチームのルールに馴染むまで何度もコードレビューで指摘する必要があるかもしれません。ESLintを導入することで、コードのルールチェックを自動化して、統一性のあるコードを担保することができます。

## ESLintの設定
ESLintは設定ファイルで全てルールのON/OFFなどを設定することができます。ESLintの基本的な設定項目について見ていきます。

[Configuring ESLint - ESLint - Pluggable JavaScript linter](https://eslint.org/docs/user-guide/configuring)

### Rules
`rules` オプションはESLintがどのような構文をエラーとするか無視するかを設定するオプションです。デフォルトで定義されているルールとしては「文末にセミコロンを必須とする」 `semi` などがあります。ユーザーは設定ファイルでこれらのルールを設定することで、自分好みにリンターの挙動をカスタマイズすることができます。  
ルールは `off` or `0` , `warn` or `1` , `error` or `2` を指定することで設定ができます。文字列でも数値でも、どちらを指定しても問題ありません。

ESLintは構文チェックで `error` となるルールが見つかった場合は 0以外のexit code で終了し、 `warn` の場合は警告として出力するが構文チェックとしては通過するようになっています。全てを `error` に設定するのも手ですが、Linterの構文エラーを解消するために思わず時間がかかる場合もあるので、チーム内で相談してルールの厳格性を決めると良いです。

次の例では `"quotes": ["error", "single"]` を指定して `'` を使わない場合に構文エラーとしています。また `"no-unused-var": "warn"` と設定することで、未使用の変数を警告として扱うようにしています。 `off` は次で紹介する `extends` を使った場合などに併用する場合が多いです。

```javascript
// error  Strings must use singlequote  quotes
const name = "taro"
// warning  'age' is assigned a value but never used  no-unused-vars
const age = 10
console.log(name)
```

```json
// .esrintrc
{
	"rules": {
		"quotes": ["error", "single"],
        "no-unused-var": "warn"
    }
}
```

### Extends
`extends` オプションではベースとなる設定を指定することで、その設定を継承することができます。先の `rules` オプションの例では、一つ一つルールを設定していました。しかし、毎回プロジェクトごとにルールを全て設定していくのは大変な作業です。そこで ESLint には公式が推奨しているプリセットが存在します。

`extends` オプションで `eslint:recommended` を指定することで、ベース設定を継承して一括で設定をすることができます。

どのようなルールが設定されるかは [公式ドキュメント](https://eslint.org/docs/rules/) を参照すれば確認することができます。

```json
{
	"extends": "eslint:recommended"
}
```

ベースとなる設定で一部のルールを無効にしたい場合には、先ほど説明した `rules` オプションで `off` を指定することで設定できます。

```json
{
	"extends": [
		"eslint:recommended"
	],
	"rules": {
        "no-ununsed-vars": "off"
    }
}
```

`extends` は配列で複数指定することが可能です。 `no-unsued-vars` などのルール設定が重複していた場合は、後から指定した設定で上書きされます。  
次の例では、 `eslint:recommended` で定義されている設定が  `plugin:react/recommended` で定義されている設定で上書きされます。

```json
{
	"extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ]
}
```

### Parser Options

ESLintはデフォルトでES5の構文をサポートしています。ES6以降の構文やJSXの構文を対象にする場合は `parserOptions` で設定します。

ここでは次の3つの項目について説明します。
- ecmaVersion
- sourceType
- ecmaFeatures 

`ecmaVersion` はEcmaScriptのバージョンを指定します。デフォルトの値は 5 です。  
デフォルトの設定で次のコードを構文チェックした場合は `The keyword 'const' is reserved` という構文エラーが発生します。

```javascript
// error  Parsing error: The keyword 'const' is reserved
const hello = () => {
    console.log("hello");
};
```

`ecmaVersion` のを指定すれば、構文チェックする EcmaScript のバージョンを変更できます。

```json
{
	"parserOptions": {
		"ecmaVersion": 2020
	}
}
```

`sourceType` はモジュールのタイプを指定します。デフォルトの値は `"script"` です。

デフォルトの設定で ESLint を利用すると import/export などのESモジュールを利用すると構文エラーとなります。

```javascript
// 'import' and 'export' may appear only with 'sourceType: module'
import { pick } from 'lodash';
```

import/export を利用する場合は `"module"` を指定します。

```json
{
	"parserOptions": {
		"sourceType": "module"
	}
}
```

`ecmaFeatures` は JavaScript で有効にする追加の構文拡張を指定します。

例えば、JSX は JavaScript の構文拡張のため、デフォルトの設定では構文エラーとなります。

```javascript
// error  Parsing error: Unexpected token <
const Hello = ({ name }) => <div>{name}</div>;
```

`"jsx": true` を指定することで、JSX も構文チェックができます。

```json
{
    "parserOptions": {
        "ecmaVersion": 2020,
        "ecmaFeatures": {
            "jsx": true
        }
    }
}
```

### Parser
ESLintはデフォルトで [Espree](https://github.com/eslint/espree) を構文解析のパーサーとして利用しています。TypeScript を構文チェックする場合に type キーワードなどは ECMAScript の構文ではないなため構文解析に失敗します。そのため、 `Parser` オプションで別のパーサーを指定する必要があります。

```typescript
// error  Parsing error: Unexpected token User
type User = {
    name: String;
}
```

TypeScriptの構文解析する場合は @typescript-eslint/parser をパーサーを指定します。

```bash
$ yann add -D typescript @typescript-eslint/parser
```

```json
{
  "parser": "@typescript-eslint/parser"
}
```

### Processor
一部のプラグインは特定の機能としてプロセッサーを提供しています。プロセッサーは Markdown ファイルから JavaScript のコードを抜き出して ESLint をかけたりできます。  
例えば、特定のファイルパスで一部のプラグインを無効にする [mradionov/eslint-plugin-disable](mradionov/eslint-plugin-disable) では、次のように `processer` オプションでプロセッサーを指定します。

```json
{
    "plugins": ["react", "disable"],
    "processor": "disable/disable",
    "overrides": [
        {
            "files": ["tests/**/*.test.js"],
            "settings": {
                "disable/plugins": ["react"]
            }
        }
    ]
}
```

### Environments
ブラウザや jest などのグローバル変数や関数を定義済みとして認識するための設定です。  
例えば、jest ではグローバル関数として `describe` や `it` などの関数が定義されますが、ESLint はその関数が定義されていることを認識することができません。 `no-undef` のルールを有効にした状態で、jestのコードを構文チェックを未定義のエラーが発生します。

```javascript
// error  'describe' is not defined  no-undef
describe("test", () => {
	// error  'it' is not defined  no-undef
    it("test", () => {});
});
```

```json
{
    "parserOptions": {
        "ecmaVersion": 6
    },
    "rules": {
        "no-undef": "error"
    },
}

```

`env` オプションで `jest` を設定することで `describe` などのグローバル関数が定義済みであることを ESLint に伝えることで、構文エラーを解消することできます。  
設定可能な環境の一覧は [公式のページ](https://eslint.org/docs/user-guide/configuring#specifying-environments) で確認できます。

```json
{
  "env": {
    "jest": true,
  }
}
```

### Globals
環境に依存しない独自に定義したグローバル変数をESLintに認識させるための設定です。  
値として `writable` , `readonly` , `off` が設定できます。

```javascript
// error  'bar' is not defined  no-undef
bar = "bar"
// error  'hoge' is not defined  no-undef
console.log(hoge)
```

```json
{
    "rules": {
        "no-undef": "error",
    "no-global-assign": "error"
    },
    "env": {
        "browser": true
    }
}
```

`writable`, `readonly` は定義済みのグローバル変数に対しての可能な操作を表しています。グローバル変数を上書きする事はほぼ無いのと、そもそも上書き自体がバッドプラクティスなので、基本的には `readonly` を指定すれば大丈夫です。

```javascript
// "readonly" と指定したグローバル変数を上書きしているので、まだ構文エラーが発生している。
// error  Read-only global 'bar' should not be modified  no-global-assign
bar = "bar"
console.log(hoge)
```

```json
// .eslintrc
{
    // (省略)
	"globals": {
		"hoge": "readonly",
		"bar": "readonly"
    }
}
```

上の例では、`no-global-assign` を有効にしている状態で `globals` オプションで `readonly` を設定している `bar` のグローバル変数に対して上書きを実行しており、ESLint の構文エラーが発生しています。  
グローバル変数を上書きする場合は `writable` を指定することで、構文チェックのエラーを解消できます。

```javascript
hoge = 'new hoge'
console.log(hoge)
```

```json
// .eslintrc
{
    // (省略)
	"globals": {
		"hoge": "readonly",
		"bar": "writable"
    }
}
```

### Plugins
ESLintでは「JSX が記述されている場合は React モジュールがインポートされていること」などの独自ルールをプラグインという形で組み込むことができます。  
`plugins` オプションでは利用したいプラグインを配列の形で指定します。また、プラグインを利用する場合は、事前にパッケージとしてインストールしておく必要があります。

例として、React の構文チェックプラグインである [yannickcr/eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) を導入してみます。

最初にプラグインをインストールします。

```bash
$ yarn add -D eslint-plugin-react
```

次にインストールしたプラグインを `plugins` オプションで指定して、使いたいルールを有効化します。
プラグイン名を指定するときに `eslint-plugin` のプレフィックは省略可能です。

```json
{
    // eslint-plugin-react でもOK
	"plugins": ["react"],
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		}
	},
	"rules": {
		"react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error"
    }
}
```

先の例では `plugins` オプションの例を示すために、敢えて冗長な書き方をしています。プラグインが提供するプリセットの設定をそのまま適用する場合には、次のように `extends` オプションで一括指定することも可能です。

```json
{
	"extends": [
	    "eslint:recommended",
	    "plugin:react/recommended"
    ]
}
```

### Shared Settings
`settins` オプションはESLintのルール実行時に参照される共通の設定値です。独自のカスタムルールから共通の値に参照したい場合などに利用できます。

 [yannickcr/eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) を利用する場合に次の設定を書く事でReactのバージョンを指定することができます。

```json
{
	"plugins": ["react"],
	"settings": {
		"react": {
			"version": "16.3"
        }
    }
}
```

## Prettierとの併用
Prettier とはコードの自動整形ツールです。

Prettier は `eslint --fix` では整形されないコードも整形してくれるため、ESLint よりも整形ツールとして優れているという利点があります。 次のようなコードは `eslint --fix` は自動整形してくれませんが、 Prettier はコードを自動整形してくれます。

```typescript
// eslint --fix ではこのコードは整形されない
const getAllPostsImpl: GetAllPosts = new GetAllPostsImpl(postsRepository, directoryRepository);
```

```typescript
// prettier だと整形される
const getAllPostsImpl: GetAllPosts = new GetAllPostsImpl(
	postsRepository, 
	directoryRepository
);
```

ESLint と Prettier の併用方法をインターネットで検索すると [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) をインストールして、ESLint 上で Prettier を実行する方法を見かけることがあります。しかし、この方法では Prettier を直接実行するよりも処理に時間がかかったり、自動整形されるコードが構文エラーとして表示される問題があり [公式のドキュメント](https://prettier.io/docs/en/integrating-with-linters.html) で非推奨とされています。

対応方法としては [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) を導入してPrettierと競合するルールをオフにして、`prettier && eslint` と先に Prettier でコードを整形をした後に ESLint で構文チェックを実行します。

```json
{
	"extends": [
		"eslint:recommended",
		"prettier"
	]
}
```

```bash
# 実行
$ prettier && eslint
```

## Reactの設定例
インストールするパッケージ

- [yannickcr/eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)
- [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks)

React v17.0 以降を利用する場合は Reactのモジュールをインポートする必要がなくなったので `react/react-in-jsx-scope` を `off` にしておくことをオススメします。

設定ファイル

```json
{
    "plugins": [
        "react-hooks"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 2020
    },
    "env": {
        "browser": true,
        "jest": true
    },
    "rules": {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react/display-name": "off",
    }
}
```

## TypeScriptの設定例

インストールするパッケージ

- [@typescript-eslint/pareser](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser)
- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)

```bash
$ yarn add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

設定ファイル

```json
{
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parserOptions": {
        "sourceType": "module",
        "ecmaVersion": 2020
    },
    "env": {
        "browser": true,
        "jest": true
    }
}
```