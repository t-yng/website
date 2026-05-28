---
title: tscとBabel
date: 2020-12-19
description: TypeScriptをトランスパイルする際のtscとbabelそれぞれの役割をまとめました。
tags: ['TypeScript']
---

## はじめに
TypeScriptをトランスパイルする手段として、主にtscとbabelという二つの選択肢があります。それぞれのツール役割について、どのような違いがあるかをまとめました。  
（webpackを利用する場合は、ts-loaderなどもありますが）

## tsc
tscはTypeScriptの開発チームが提供しているTypeScriptのトランスパイラで、TypeScriptで書かれたソースコードをJavaScriptへとトランスパイルするツールです。tscは `tsconfig.json` の `target` オプションで古いJavaScriptへのトランスパイルをサポートしています。例えば、`"target": "es5"` と指定することで、TypeScriptのコードをIE11などでも動くJavaScriptの構文にトランスパイルしてくれます。

しかし、ここで注意する点があります。tscのトランスパイル対象となるのは **JavaScriptの構文だけ** ということです。具体例として、次の `index.ts` をトランスパイルした `index.js` のコードを見てみます。  

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "ES2015"
    ]
  }
}

// index.ts
const fetchNumber = (): Promise<number> => {
  return new Promise<number>((resolve, reject) => {
    resolve(1);
  });
};

// index.js
var fetchNumber = function () {
    return new Promise(function (resolve, reject) {
        resolve(1);
    });
};
```

`() => {}` のアロー関数はES2015で導入された構文であるため、IE11では利用できません。そこで、tscがアロー関数を `function() {}` のようにES5の形式に変換してくれています。ただ、`Promise` はそのままの形式で残っています。`Promise`もES2015から導入された仕組みのため、このままでは、IE11では動かすことができません。
これは、先ほども述べたように tscのトランスパイルは **JavaScriptの構文だけ** を対象しており、Promiseなどの組み込みオブジェクトは構文でないため、tscのトランスパイル対象から外れてしまいます。

この問題を解決する方法として次に説明する Babel を利用します。

## Babel
BabelはES2020などの最新のJavaScriptコードをIE11などのブラウザでも動作するJavaScriptコードに変換するトランパイラーです。また構文のトランスパイル以外にも、テストで利用する `test-id` や デバッグ目的の `console.log` をプロダクションビルドの時だけ削除するなどのトランスパイルを実行することができます。

### Plugins と Presets
Babelを利用する上で `Plugins` と `Presets` という二つの概念だけは把握しておく必要があります。  

`Plugins`はBabelでどのようにコードを変換するかを定義したJSのプログラムです。  
例えば、`@babel/plugin-transform-arrow-functions` は ES2015から導入されたアロー関数 `() => {}` を `function() {}` というES5の形式に変化するためのプラグインです。Babelを利用する時は、複数のプラグインを組み合わせることで、目的に合わせてコードをトランスパイルしていきます。

実際にES2015の構文をES5にトランスパイルするには多くのプラグインを利用する必要があります。必要なプラグインを一つずつインストールして管理するのは大変です。一つのパッケージとして集約されていると、利用する際にパッケージをインストールするだけで良くなり非常に便利です。  

この複数のプラグインを目的に応じてパッケージとして集約する仕組みが `Presets` です。ユーザーが独自のプリセットを定義することも、他の人が定義したプリセットをインストールして利用することもできます。頻繁に利用するプリセットとしては、Babel公式が提供している `@babel/preset-env` があります。これは、ES2015以降のJavaScriptの構文をES5にトランスパイルするプラグインを集約したプリセットです。集約されているプラグインは、[babel/available\-plugins\.js at master · babel/babel](https://github.com/babel/babel/blob/master/packages/babel-preset-env/src/available-plugins.js) で確認できます。

### TypeScriptのトランスパイル
実際に先ほどのTypeScriptのコードをBabelを利用してIE11でも動作するコードに変換してみます。  

最初に必要なパッケージをインストールします。

- @babel/cli: Babelのcliツール
- @babel/core: Babelのコア機能
- @babel/preset-env: JavaScriptの構文をトランスパイルする かつ PromiseなどのPolyfillを注入
- @babel/preset-typescript: TypeScriptをトランスパイルする
- core-js@3: PromiseなどのPolyfillを定義したモジュール

```bash
# babelと関連するプリセットのインストール
$ yarn add -D @babel/cli @babel/core @babel/preset-env @babel/preset-typescript
$ yarn add core-js@3
```

Babelの設定ファイルはこんな感じです。

```json
// babel.config.json
{
  "presets": [
    [
      "@babel/preset-typescript",
      "@babel/preset-env",
      {
        "targets": {
          "ie": "11"
        },
        "useBuiltIns": "usage"
      }
    ]
  ]
}
```

TypeScript => @babel/preset-typescript => @babel/preset-env => JavaScript  
という流れでトランスパイルがされていきます。tscと異なる点は、`"useBuiltIns": "usage"`を指定することで、`targets`オプションで
指定しているブラウザでも動作させるために必要なPolyfillがBabelにより自動で注入されます。

実際に先ほどの `index.ts` に対してトランスパイルを実行して、出力されるJavaScriptを確認してみます。

```javascript
// src/index.js
"use strict";

require("core-js/modules/ES2015.promise.js");

require("core-js/modules/ES2015.object.to-string.js");

var fetchNumber = function fetchNumber() {
  return new Promise(function (resolve, reject) {
    resolve(1);
  });
};
```

tscと比較して、`Promise`のPolyfillが別モジュールとして読み込まれています。このようにBabelを利用することで、より柔軟にトランスパイルすることができます。

ただし、ここでも注意が必要でPolyfillを `reuire` という CommonJS Module 形式で読み込んでいるため、このままではブラウザ上で実行することができません。そのため、このモジュール読み込みを解決するために、モジュールバンドラーのWebpackを利用します。


### @babel/preset-typescriptの注意点
@babel/preset-typescriptの利用で知っておくべき注意点がいくつかあります。

#### 型チェック
ひとつは、型チェックが実行されないことです。BabelではTypeScriptから型を剥がして、JavaScriptにトランスパイルする作業だけを実行するため、仮に型の不整合が存在しても、トランスパイルが成功してしまいます。

```typescript
// src/index.ts
const n: number = "hello";
```

上記のコードをtscとBabelで実行してみると、Babelでは型エラーが発生せずにトランスパイルが成功します。これでは、TypeScriptを使う一番の目的である型の恩恵が受けられません。

```bash
# tscは型エラーでトランスパイルに失敗する
$ tsc src/index.ts
src/test.ts:1:7 - error TS2322: Type 'string' is not assignable to type 'number'.

1 const n: number = "test"
        ~
Found 1 error.

# Babelは型チェックされないのでトランスパイルに成功する
$ yarn babel src/index.ts
(#省略)
✨  Done in 0.54s.
```

そのため、Babelでトランスパイルをする場合は、事前にtscで別途型チェックを実施する必要があります。

```bash
$ tsc --noEmit src/index.ts && babel src/index.ts
src/test.ts:1:7 - error TS2322: Type 'string' is not assignable to type 'number'.
```

#### 一部機能の非対応
`const enums` や デコレーターなど一部のTypeScriptの機能を正常にトランスパイルできない問題があります。対応していないと絶対に困る問題ではないですが、プロジェクトによっては重要な問題となるので、これらの存在を認識していくことが重要です。  
詳細は [Choosing between Babel and TypeScript](https://blog.logrocket.com/choosing-between-babel-and-typescript-4ed1ad563e41/) を参照してください。

## おわりに
Babelで
今回は @babel/preset-typescript を利用したTypeScriptのトランスパイルを通して、tscとBabelの違いをまとめました。Babelで出力されたファイルはモジュール読み込みを含むため、webpackを利用してモジュール解決をする必要があります。しかし、webpackを利用する場合に、TypeScriptをトランスパイルする方法として `ts-loader` を使う方法もあります。別の機会にここら辺の話をまとめたいです。

## 参考
- [TypeScript: TSConfig Reference \- Docs on every TSConfig option](https://www.typescriptlang.org/tsconfig#target)
- [@babel/preset\-env · Babel](https://babeljs.io/docs/en/babel-preset-env#usebuiltins)
- [TypeScript and Babel 7 \| TypeScript](https://devblogs.microsoft.com/typescript/typescript-and-babel-7/)
- [Choosing between Babel and TypeScript](https://blog.logrocket.com/choosing-between-babel-and-typescript-4ed1ad563e41/)
- [TypeScriptをプロダクト開発に使う上でのベストプラクティスと心得 \- Qiita](https://qiita.com/jagaapple/items/ce0da04be28c35dc7d4f#5-interfaces%E3%81%A7%E3%81%AF%E3%81%AA%E3%81%8Ftype-aliases%E3%82%92%E5%88%A9%E7%94%A8%E3%81%99%E3%82%8B)
