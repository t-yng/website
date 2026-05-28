---
title: TypeScript4.5以降で追加されたTSConfigのオプションを調べてみた
date: 2023-12-14
description: 直近2年間でTSConfigのオプションが新たにどれだけ追加されたのかふと気になりました。TypeScriptの4.5のリリースが2021年の11月頃で約2年前なので、TypeScript4.5以降で追加されたTSConfigのオプションを調べてみました。
tags: ['TypeScript']
---
この記事は[TypeScriptアドベントカレンダー](https://qiita.com/advent-calendar/2023/typescript)14日目の記事です。

## はじめに
tsconfig.jsonには沢山のオプションが存在します。直近2年間でTSConfigのオプションが新たにどれだけ追加されたのかふと気になりました。

TypeScriptの4.5のリリースが2021年の11月頃で約2年前なので、TypeScript4.5以降で追加されたTSConfigのオプションを調べてみました。

## バージョン4.5以降で新たに追加されたオプションの一覧
|オプション|追加されたバージョン|
|--|--|
|preserveValueImports|4.5|
|moduleSuffixes|4.7|
|moduleDetection|4.7|
|allowArbitraryExtensions|5.0|
|allowImportingTsExtensions|5.0|
|customConditions|5.0|
|resolvePackageJsonExports|5.0|
|resolvePackageJsonImports|5.0|
|verbatimModuleSyntax|5.0|

## preserveValueImports
tscで未使用と判定されたコードが削除されるのを防ぐことができます。
このオプションは5.0で`verbatimModuleSyntax`が追加された関係で、最新では非推奨となっています。

### 使い方
次のコードではeval関数を評価することで`Animal`クラスの呼び出しが実行されます。しかし、tscは`Animal`が未使用だと判断するためインポート文を削除します。
その結果、コンパイルされたJavaScriptのコードを実行するとエラーが発生します。

```typescript
import { Animal } from "./animal.js";
eval("console.log(new Animal().isDangerous())");
```    

tsconfig.jsonで`preserveValueImports`をtrueに設定することで、未使用のインポートのコード削除を制限することができます。
```json
{
  "compilerOptions": {
    "preserveValueImports": true
  }
}
```

## moduleSuffixes
moduleSuffixesは、モジュール解決の際にファイルの拡張子をどのように扱うかを定義するための設定です。
異なる環境（例えばブラウザとNode.js）向けに異なるファイル拡張子を持つモジュールをビルドする際にこのオプションを利用することで、環境に応じたファイル解決を行うことができます。

例えば、プロジェクト内で異なる種類のモジュール（例: .browser.ts と .node.ts）を区別して管理する場合、moduleSuffixes によってこれらのファイルを適切に解決し、コードの整理に役立ちます。

### 使い方
配列にモジュールを解決する際に参照する拡張子を配列で指定します。この例では、TypeScriptがモジュールを解決する際に、.browser.ts、.node.ts、そして標準の .ts 拡張子をこの順序で検索します。

```json
{
  "compilerOptions": {
    "moduleSuffixes": [".browser", ".node", ""]
  }
}
```

上の設定で以下のを読み込んだ時に、myModule.browser.ts、myModule.node.ts、myModule.ts の順にファイルが存在するかどうかがチェックされます。

```typescript
import { myFunction } from "./myModule";
```

## moduleDetection
ファイルをモジュールとして解釈するかスクリプトとして解釈するかを制御します。
`auto`, `legacy`, `force`の3つの値が存在しており、デフォルトは`auto`です。

TypeScriptは元々import,export文の有無でファイルがモジュールであるかを判定していたが、その挙動が4.7から変更されたので、新たに追加されました。

### 使い方
`auto`を指定した場合は、ファイル内に import や export の有無だけでなく他の条件もチェックしてファイルがモジュールであるかを判定します。
moduleがnodenextやnode16の場合は、package.jsonのtypeフィールドをチェックします。
jsxがreact-jsxの場合はファイルがjsxファイルかどうかをチェックします。

`legacy`は、TypeScript4.6以下と同じ挙動をします。ファイル内に import や export ステートメントがある場合、そのファイルはモジュールとして扱います。そうでない場合はスクリプトとして扱います。

`force`は、型定義ファイル以外の全てのファイルを無条件でモジュールとして扱います。

```json
{
  "compilerOptions": {
    "moduleDetection": "legacy"
  }
}
```

## allowArbitraryExtensions
このオプションは、標準のJavaScriptやTypeScriptファイル拡張子以外で終わるインポートパスを扱うためのものです。このオプションを有効にすると、TypeScriptコンパイラは非標準のファイル拡張子に対応する宣言ファイルを探します。

たとえば、プロジェクトでバンドラーを使用してCSSファイルをTypeScriptファイルに直接インポートする場面がある場合、allowArbitraryExtensions オプションを有効にすると、TypeScriptは非標準拡張子のファイルをインポートする際にエラーを発生させなくなります。代わりに、{ファイル名}.d.{拡張子}.ts の形式の宣言ファイルを探します。これにより、非標準のファイルに対する型宣言やエクスポートを行う宣言ファイルを書く（または生成する）ことができ、TypeScriptで正しく理解し使用することが可能になります。

### 使い方

例えば、button.cssというCSSファイルがある場合、button.d.css.tsという宣言ファイルを作成し、CSSファイルの型宣言やエクスポートを行うことができます。これにより、TypeScriptはCSSファイルのインポートを正しく解釈し、TypeScriptコードで使用することができます。

この機能は、実行時にこれらの非標準インポートを処理できるバンドラーやその他のツールと使用することを前提としています。実行環境やバンドラーがこのようなインポートを処理する設定になっていない場合、このオプションを有効にすると実行時エラーが発生する可能性がありますので注意が必要です。

```css
/* button.css */
.button {
  color: red;
}
```

```typescript
// button.d.css.ts
declare const css: {
  button: string;
};
export default css;
```

```typescript
// Button.tsx
import styles from "./button.css";

styles.button; // string
```

```json
{
  "compilerOptions": {
    "allowArbitraryExtensions": true
  }  
}
```

## allowImportingTsExtensions
このオプションは、.ts、.mts、または .tsx のようなTypeScript特有の拡張子を記述してファイルをインポートすることを可能にします。

従来では`./util.ts`ようにts拡張子でファイルをインポートするとJavaScriptのランタイムでパス解決ができないため、エラーが発生していました。
このオプションを有効にすることで次のコードでエラーが発生しなくなります。

```typescript
// index.ts
import { hello } from './util.ts';
```

### 使い方
このオプションは --noEmit や --emitDeclarationOnly が有効になっており、JavaScriptファイルを出力しない場合のみ利用できます。
これらの.ts拡張子のインポートパスをそのままJavaScriptとして出力をすると、実行時に解決できずエラーが発生するためです。

```json
{
  "compilerOptions": {
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

## customConditions
TypeScriptがパッケージのexportsやimportsフィールドを解決する際に、追加の条件を設定することを可能にします。

### 使い方
customConditionsに複数の条件を指定することで、package.jsonのexportsやimportsフィールドに指定した条件が存在する場合に、条件にマッチしたファイルがインポートされます。

下の例では、`foo`を条件として指定しているので、`foo.mjs`が読み込まれます。

このフィールドは、--moduleがnode16またはnodenext かつ --moduleResolutionがbundlerの場合のみ有効です。

```json
{
  "compilerOptions": {
    "target": "es2022",
    "moduleResolution": "bundler",
    "customConditions": ["foo"]
  }
}
```

```json
// package.json
{
  // ...
  "exports": {
    "./hoge": {
      "foo": "./foo.mjs",
      "node": "./hoge.mjs",
      "import": "./hoge.mjs",
      "require": "./hoge.js"
    }
  }
}
```

## resolvePackageJsonExports
node_modules内のパッケージからファイルを読み込む際に、TypeScriptがそのパッケージのpackage.jsonのexportsフィールドを参照するかどうかを制御します。
このオプションが有効の場合、TypeScriptは package.jsonのexportsフィールドを利用してモジュール解決を行います。

この設定は--moduleResolutionがnode16、nodenext、bundlerのいずれかである場合に、デフォルトでtrueとなります。

### exportsフィールドについて
package.jsonのexportsフィールドはパッケージを配布する側がプラットフォームごとに読み込むファイルを制御することができます。

### 互換性の問題
下位互換性の問題として、resolvePackageJsonExportsがtrueになっている場合にexportsフィールドを参照することでパッケージが意図してないファイルのインポートがブロックされてコンパイルエラーが発生する可能性があります。

次の例ではパッケージ側がexportsフィールドで`src/utility.js`のみを公開しているので、それ以外のファイルのインポートがブロックされます。

```typescript
// 特別な理由で公開していないファイルを直接読み込んでいる
// exportsフィールドを参照するとファイル読み込みがブロックされる可能性がある
import { xxx } from '@package/dist/private/hoge';
```

```json
{
  "name": "package",
  "version": "1.0.0",
  "exports": {
    "./utility": "./src/utility.js"
  }
}
```

## resolvePackageJsonImports
package.jsonのimportsフィールドをTypeScriptが解析するかどうかを制御します。
このオプションが有効な場合、TypeScriptはファイルの読み込みを行う際にpackage.jsonのimportsフィールドを参照します。

この設定は--moduleResolutionがnode16、nodenext、bundlerのいずれかである場合に、デフォルトでtrueとなります。

### importsフィールドについて
package.jsonのimportsフィールドは読み込むパッケージに任意の名前をマッピングします。
次の例では`#dep`を`dep-node-native`にマッピングをしています。

```typescript
import {} from '#dep';
```

```json
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
} 
```

## verbatimModuleSyntax
モジュールのインポートとエクスポートの取り扱いを簡素化するオプションです。
デフォルトの値はfalseです。

TypeScriptはデフォルトで未使用なインポートや型のみを参照するインポートは出力するJavaScriptから削除します。
これらの挙動を制御するためにimportsNotUsedAsValuesやpreserveValueImportsが導入されました。しかし、これらのオプションを組み合わせて利用すると制御が複雑になり、対応できないエッジケースも存在しています。

verbatimModuleSyntaxを有効にすることで、この制御のルールをよりシンプルにできます。

### 使い方
trueを設定することで、`type`修飾子のインポートは全て削除して、それ以外はのインポート文は削除しない制御をすることできます。

### 使い方
```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true
  },
}
```

```typescript
// index.ts
// インポート文が全て削除される
import type { Util } from "./utils";

// 'import { b } from "./utils";' として出力される
import { group, type Pick, type Filter } from "./utils";

// 'import {} from "./utils";'として出力される
import { type Map } from "./utils";
```

## さいごに
直近2年で追加されたTSConfigのオプションを調べてみましたが、自分がちゃんと使ったことがないオプションばかりで、初めて知るものが多く勉強になりました。

傾向として振り返ると、モジュール解決周りのオプションが圧倒的に多い事に気づきESMとCJSのモジュール周りがどれだけ大変なのか
が見えてきて面白かったです。
