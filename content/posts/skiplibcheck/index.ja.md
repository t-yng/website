---
title: TypeScriptのskipLibCheckを理解する
date: 2021-01-19
description: ESLintは毎回プロジェクト開始の最初だけ設定して、その後あまり触ることが無く毎回なんとなくで設定して、新しく設定する時に設定項目を忘れてしまう事が多いので、各設定項目や導入プラグインの目的をちゃんと理解したいと思い、まとめました。
tags: ['TypeScript']
---

tsconfig.json には [skipLibCheck](https://www.typescriptlang.org/ja/tsconfig#skipLibCheck) という設定オプションがあります。  
このオプションの挙動やどんな時に設定するかについてまとめました。

## skipLibCheckの挙動
このオプションのデフォルト値は false で true を設定することで `*.d.ts` ファイルに対する型チェックをスキップすることができます。

次のようなサーバーのコードを考えてみます。

```typescript
import express from "express";

const app = express();

app.post("/uses/sign_in", (req: express.Request, res: express.Response) => {
    if (req.tokens.includes('abc')) {
        res.sendStatus(200)
    } else {
        res.sendStatus(403);
    }
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
```

tsconfig.json では `skipLibCheck` は定義しておらず、デフォルトの false が設定されている状態です。

```json
{
    "compilerOptions": {
        "esModuleInterop": true,
        "typeRoots": [
            "node_modules/@types",
            "types"
        ]
    }
}
```

`req.tokens` は次のような型定義ファイルを作成して、 `express.Request` の型定義を拡張して新たにプロパティを定義しています。この時、 `tokens: Array` とジェネリクスを指定すべき箇所を誤って指定しているため、型定義エラーが発生しています。

```typescript
// types/express/index.d.ts
/// <reference types="express" />

// @see: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/method-override/index.d.ts
declare namespace Express {
    export interface Request {
        // Interface Array<T>
        // Generic type 'Array<T>' requires 1 type argument(s).ts(2314)
        tokens: Array;
    }
}
```

この状態で、 tsconfig.json にて `skipLibCheck: true` を設定します。

```json
{
    "compilerOptions": {
        "skipLibCheck": true,
        // (省略)
    }
}
```

`*.d.ts` ファイルに対する型チェックがスキップされるのでエラーが消え、正しくない型定義ファイルが存在してもコンパイルエラーが出なくなってしまいました。

```typescript
declare namespace Express {
    export interface Request {
        tokens: Array;
    }
}
```

この状態では `req.tokens` は `any` として解釈されます。

```typescript
// （省略）
app.post("/uses/sign_in", (req: express.Request, res: express.Response) => {
    // (property) Express.Request.tokens: any
    if (req.tokens.includes('abc')) {
        res.sendStatus(200)
    } else {
        res.sendStatus(403);
    }
});
```

## skipLibCheckのメリット
挙動を見る限りでは `skipLibCheck: true` を設定することで、型チェックの精度が下がるデメリットがありましたが `skipLibCheck: true` を設定するメリットは何なのでしょうか？

アプリケーションが中規模、大規模になり依存するパッケージが増えた時に、それに比例して型定義ファイルが増えていきます。 `tsc` のデフォルトの挙動では、TypeScriptをコンパイルするときに `@types/express` などのライブラリの `*.d.ts` に対しても型チェックを実施するため、コンパイル時間が増加します。 `skipLibCheck: true` を設定することで、型チェックの精度を犠牲にする代わりにコンパイル時間を削減できます。

```bash
# skipLibkCheck: false
$ yarn tsc --extendedDiagnostics -p ./
Files:                          88
Check time:                  1.47s
Total time:                  2.51s
✨  Done in 2.85s.

# skipLibCheck: true
$ yarn tsc --extendedDiagnostics -p ./
Files:                         88
Check time:                 0.18s
Total time:                 1.17s
✨  Done in 1.49s.
```

他のシナリオとしては、複数のパッケージが、それぞれが異なるバージョンの型定義ファイルに依存している（別々のパッケージ `@types/react@^16` と `@types/react@^17` に依存しているなど）場合に、同じ型定義ファイルが複数 node_modules にインストールされる場合があります。この時に `error TS2300: Duplicate Identifier` という型定義の重複エラーが発生してコンパイルに失敗します。  

解決策としては、パッケージのバージョンを上げるなどして依存関係を整理して重複を無くす方法があります。しかし、それが難しい場合は  `skipLibCheck: true` を指定することで型定義ファイルの型チェックをスキップすることで、エラーを回避することができます。

## さいごに
`skipLibCheck` は true or false のそれぞれにメリット・デメリットがあるため、プロジェクトで何を優先するかを決めて設定の有無を決めると良いでしょう。
